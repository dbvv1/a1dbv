#![cfg(test)]
// Original adapter: execute the unmodified official example's State, without opening a window.
#[allow(dead_code)]
mod official {
    include!(concat!(env!("OUT_DIR"), "/ex_game.rs"));
}
use ggrs::{Config, GgrsRequest, InputStatus, Message, NonBlockingSocket, PredictRepeatLast};
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};

#[derive(Clone, Serialize, Deserialize)]
struct State {
    ships: official::State,
    cooldown: [u8; 2],
    boosts: [u32; 2],
}
impl State {
    fn new() -> Self {
        Self {
            ships: official::State::new(2),
            cooldown: [0; 2],
            boosts: [0; 2],
        }
    }
    fn advance(&mut self, inputs: Vec<(official::Input, InputStatus)>) {
        for (i, (input, _)) in inputs.iter().enumerate() {
            self.cooldown[i] = self.cooldown[i].saturating_sub(1);
            if input.inp & 16 != 0 && self.cooldown[i] == 0 {
                self.cooldown[i] = 9;
                self.boosts[i] += 1;
                self.ships.velocities[i].0 += 1.0;
            }
        }
        self.ships.advance(inputs);
    }
    fn bytes(&self) -> Vec<u8> {
        bincode::serialize(self).unwrap()
    }
}
struct Setup;
impl Config for Setup {
    type Input = official::Input;
    type InputPredictor = PredictRepeatLast;
    type State = State;
    type Address = usize;
}
#[derive(Default)]
struct Traffic {
    round: usize,
    delay: usize,
    blocked: bool,
    packets: Vec<(usize, usize, usize, Vec<u8>)>,
}
struct Socket {
    id: usize,
    traffic: Arc<Mutex<Traffic>>,
}
impl NonBlockingSocket<usize> for Socket {
    fn send_to(&mut self, message: &Message, destination: &usize) {
        let mut t = self.traffic.lock().unwrap();
        let due = t.round + t.delay;
        t.packets.push((
            due,
            self.id,
            *destination,
            bincode::serialize(message).unwrap(),
        ));
    }
    fn receive_all_messages(&mut self) -> Vec<(usize, Message)> {
        let mut t = self.traffic.lock().unwrap();
        if t.blocked {
            return Vec::new();
        }
        let round = t.round;
        let mut result = Vec::new();
        t.packets.retain(|(due, from, to, bytes)| {
            if *due <= round && *to == self.id {
                result.push((*from, bincode::deserialize(bytes).unwrap()));
                false
            } else {
                true
            }
        });
        result
    }
}
#[derive(Default, Debug)]
struct Counts {
    saves: usize,
    loads: usize,
    advances: usize,
    stalls: usize,
    max_batch: usize,
}
struct Consumer {
    state: State,
    counts: Counts,
    omit_extension_on_load: bool,
}
impl Consumer {
    fn new(broken: bool) -> Self {
        Self {
            state: State::new(),
            counts: Counts::default(),
            omit_extension_on_load: broken,
        }
    }
    fn handle(&mut self, requests: Vec<GgrsRequest<Setup>>) {
        let mut advances = 0;
        for request in requests {
            match request {
                GgrsRequest::SaveGameState { cell, frame } => {
                    assert_eq!(frame, self.state.ships.frame);
                    // FNV-1a is diagnostic only, not a security or determinism guarantee.
                    let hash = self
                        .state
                        .bytes()
                        .iter()
                        .fold(14695981039346656037u64, |h, b| {
                            (h ^ u64::from(*b)).wrapping_mul(1099511628211)
                        });
                    cell.save(frame, Some(self.state.clone()), Some(hash as u128));
                    self.counts.saves += 1;
                }
                GgrsRequest::LoadGameState { cell, frame } => {
                    let saved = cell.load().expect("GGRS requested a missing snapshot");
                    assert_eq!(saved.ships.frame, frame);
                    if self.omit_extension_on_load {
                        self.state.ships = saved.ships;
                    } else {
                        self.state = saved;
                    }
                    self.counts.loads += 1;
                }
                GgrsRequest::AdvanceFrame { inputs } => {
                    self.state.advance(inputs);
                    self.counts.advances += 1;
                    advances += 1;
                }
            }
        }
        self.counts.max_batch = self.counts.max_batch.max(advances);
    }
}
fn input(frame: i32, player: usize, boost: bool) -> official::Input {
    let movement = if frame < 40 {
        if (frame / 5 + player as i32) % 2 == 0 {
            1 | 4
        } else {
            1 | 8
        }
    } else {
        0
    };
    let ability = if boost && frame < 40 && frame % 7 == 0 {
        16
    } else {
        0
    };
    official::Input {
        inp: movement | ability,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use ggrs::{GgrsError, P2PSession, PlayerType, SessionBuilder, SessionState};
    fn peers(window: usize) -> (Vec<P2PSession<Setup>>, Arc<Mutex<Traffic>>) {
        let traffic = Arc::new(Mutex::new(Traffic::default()));
        let mut peers: Vec<_> = (0..2)
            .map(|id| {
                SessionBuilder::<Setup>::new()
                    .with_max_prediction_window(window)
                    .add_player(
                        if id == 0 {
                            PlayerType::Local
                        } else {
                            PlayerType::Remote(0)
                        },
                        0,
                    )
                    .unwrap()
                    .add_player(
                        if id == 1 {
                            PlayerType::Local
                        } else {
                            PlayerType::Remote(1)
                        },
                        1,
                    )
                    .unwrap()
                    .start_p2p_session(Socket {
                        id,
                        traffic: traffic.clone(),
                    })
                    .unwrap()
            })
            .collect();
        for _ in 0..100 {
            for peer in &mut peers {
                peer.poll_remote_clients();
            }
            if peers
                .iter()
                .all(|p| p.current_state() == SessionState::Running)
            {
                return (peers, traffic);
            }
        }
        panic!("official P2P sessions did not synchronize");
    }
    fn run(window: usize, delay: usize, boost: bool, broken: bool) -> Vec<Consumer> {
        let (mut peers, traffic) = peers(window);
        traffic.lock().unwrap().delay = delay;
        let mut games = vec![Consumer::new(broken), Consumer::new(broken)];
        let target = 80;
        for round in 0..2000 {
            traffic.lock().unwrap().round = round;
            for peer in &mut peers {
                peer.poll_remote_clients();
            }
            for id in 0..2 {
                if peers[id].current_frame() >= target {
                    continue;
                }
                let frame = peers[id].current_frame();
                peers[id]
                    .add_local_input(id, input(frame, id, boost))
                    .unwrap();
                match peers[id].advance_frame() {
                    Ok(requests) => {
                        if !requests
                            .iter()
                            .any(|r| matches!(r, GgrsRequest::AdvanceFrame { .. }))
                        {
                            games[id].counts.stalls += 1;
                        }
                        games[id].handle(requests);
                    }
                    Err(GgrsError::PredictionThreshold) => games[id].counts.stalls += 1,
                    Err(error) => panic!("unexpected session error: {error:?}"),
                }
            }
            if peers.iter().all(|p| p.current_frame() == target) {
                break;
            }
        }
        assert!(
            peers.iter().all(|p| p.current_frame() == target),
            "timed out before target frame: {:?}",
            peers
                .iter()
                .map(|p| (p.current_frame(), p.confirmed_frame()))
                .collect::<Vec<_>>()
        );
        let mut reference = State::new();
        for frame in 0..target {
            reference.advance(
                (0..2)
                    .map(|id| (input(frame, id, boost), InputStatus::Confirmed))
                    .collect(),
            );
        }
        for game in &games {
            if broken {
                assert_ne!(
                    game.state.bytes(),
                    reference.bytes(),
                    "negative case failed to expose omitted state"
                );
                println!(
                    "incomplete restore: boost counts {:?}, confirmed reference {:?}",
                    game.state.boosts, reference.boosts
                );
            } else {
                assert_eq!(
                    game.state.bytes(),
                    reference.bytes(),
                    "full state differs from confirmed-input execution"
                );
            }
        }
        println!("window={window} delivery_rounds={delay} boost={boost} broken={broken} {:?}; {:?}; snapshot_bytes={}",games[0].counts,games[1].counts,games[0].state.bytes().len());
        games
    }
    #[test]
    fn immediate_delivery_official_sample() {
        run(8, 0, false, false);
    }
    #[test]
    fn late_input_rewinds_and_converges() {
        let games = run(8, 3, false, false);
        assert!(games
            .iter()
            .all(|g| g.counts.loads > 0 && g.counts.advances > 80));
    }
    #[test]
    fn lockstep_waits_without_snapshots() {
        let games = run(0, 3, false, false);
        assert!(games.iter().all(|g| g.counts.stalls > 0
            && g.counts.loads == 0
            && g.counts.saves == 0
            && g.counts.advances == 80));
    }
    #[test]
    fn second_change_restores_cooldown_and_usage() {
        run(8, 3, true, false);
    }
    #[test]
    fn incomplete_restore_is_detected() {
        run(8, 3, true, true);
    }
    #[test]
    fn missing_local_input_is_rejected() {
        let (mut peers, _) = peers(8);
        assert!(matches!(
            peers[0].advance_frame(),
            Err(GgrsError::InvalidRequest { .. })
        ));
    }
    #[test]
    fn missing_remote_input_exhausts_prediction() {
        let (mut peers, traffic) = peers(8);
        traffic.lock().unwrap().blocked = true;
        let mut game = Consumer::new(false);
        let mut threshold = false;
        for _ in 0..20 {
            let frame = peers[0].current_frame();
            peers[0].add_local_input(0, input(frame, 0, false)).unwrap();
            match peers[0].advance_frame() {
                Ok(requests) => {
                    let before = game.state.ships.frame;
                    game.handle(requests);
                    if game.state.ships.frame == before {
                        threshold = true;
                        break;
                    }
                }
                Err(GgrsError::PredictionThreshold) => {
                    threshold = true;
                    break;
                }
                Err(error) => panic!("{error:?}"),
            }
        }
        assert!(threshold);
        assert_eq!(game.state.ships.frame, 8);
        println!("missing remote: stops at frame {}", game.state.ships.frame);
    }
}
