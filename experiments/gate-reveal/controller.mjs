// Original example controller, MIT. World changes belong to legal interaction, not video callbacks.
export const PROFILES = Object.freeze({
  base: Object.freeze({ weapon: .75, returnSeconds: 5, caption: 'The gate is open. Follow the markers to the amber beacon.' }),
  revised: Object.freeze({ weapon: 1.05, returnSeconds: 6.5, caption: 'The gate is open. Cross the arch, follow the stone markers, and reach the amber beacon beyond the walls.' }),
});

export class GateReveal {
  constructor(createMedia, profile = 'base') {
    if (typeof createMedia !== 'function' || !PROFILES[profile]) throw new TypeError('invalid media factory or profile');
    this.createMedia = createMedia;
    this.profile = profile;
    this.token = 0;
    this.playAttempt = 0;
    this.media = null;
    this.reset();
  }
  get active() { return ['A', 'B', 'C'].includes(this.stage); }
  get controlsEnabled() { return this.stage === 'game' && !this.paused; }
  get shotTime() { return this.stage === 'B' ? (this.media?.currentTime ?? 0) : this.elapsed; }
  reset(profile = this.profile) {
    if (!PROFILES[profile]) throw new TypeError('unknown profile');
    this.token++;
    this.releaseMedia();
    this.profile = profile;
    this.stage = 'game';
    this.elapsed = 0;
    this.paused = false;
    this.world = { unlocked: false, player: { x: -1, z: -3 }, crossed: false };
    this.reason = 'ready';
    this.transitions = ['game'];
  }
  start() {
    const p = this.world.player;
    if (!this.controlsEnabled || this.world.unlocked || Math.hypot(p.x + 2, p.z + 2.5) > 2.5) return false;
    this.world.unlocked = true; // Sole authoritative commit, before presentation takes control.
    this.token++;
    this.reason = 'interaction accepted';
    this.enter('A');
    return true;
  }
  enter(stage) {
    this.stage = stage;
    this.elapsed = 0;
    this.transitions.push(stage);
    if (stage === 'B') this.openMedia();
  }
  tick(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) throw new RangeError('nonnegative finite delta required');
    if (this.paused) return;
    if (this.stage === 'A' || this.stage === 'C') {
      this.elapsed += seconds;
      if (this.stage === 'A' && this.elapsed >= 4) this.enter('B');
      else if (this.stage === 'C' && this.elapsed >= PROFILES[this.profile].returnSeconds) this.finish('completed');
    }
  }
  openMedia() {
    const token = this.token;
    try {
      const media = this.createMedia();
      this.media = media;
      const isCurrent = () => this.token === token && this.media === media && this.stage === 'B';
      this.onEnded = () => {
        if (!isCurrent()) return;
        if (this.paused) this.pendingEnd = true;
        else this.toReturn('media ended');
      };
      this.onError = () => { if (isCurrent()) this.toReturn('media unavailable'); };
      media.addEventListener('ended', this.onEnded);
      media.addEventListener('error', this.onError);
      this.play();
    } catch {
      this.toReturn('media unavailable');
    }
  }
  play() {
    const media = this.media;
    const token = this.token;
    const attempt = ++this.playAttempt;
    Promise.resolve().then(() => {
      if (this.token !== token || this.media !== media || this.stage !== 'B' || this.paused) return;
      return media.play();
    }).then(() => {
      // A detached element cannot revive this sequence after skip/reset.
      if (this.token !== token || this.media !== media) media.pause();
    }, () => {
      // Pause intentionally cancels pending play; only the current unpaused attempt can fail the shot.
      if (this.token === token && this.media === media && this.stage === 'B' &&
          !this.paused && this.playAttempt === attempt) this.toReturn('play rejected');
    });
  }
  setPaused(paused) {
    if (!this.active) return;
    this.paused = Boolean(paused);
    if (this.stage !== 'B') return;
    if (this.paused) {
      this.playAttempt++;
      this.media.pause();
    } else if (this.pendingEnd) {
      this.toReturn('media ended');
    } else this.play();
  }
  toReturn(reason) {
    if (this.stage !== 'B') return;
    this.reason = reason;
    this.releaseMedia();
    this.enter('C'); // B is a shot, never the global exit.
  }
  releaseMedia() {
    this.playAttempt++;
    const media = this.media;
    this.media = null;
    this.pendingEnd = false;
    if (!media) return;
    media.removeEventListener('ended', this.onEnded);
    media.removeEventListener('error', this.onError);
    media.pause();
    media.removeAttribute('src');
    media.load();
    media.remove();
  }
  finish(reason) {
    if (!this.active) return;
    this.token++;
    this.releaseMedia();
    this.reason = reason;
    this.paused = false;
    this.enter('game');
  }
  skip() { this.finish('skipped'); }
  move(x, z, seconds) {
    if (![x, z, seconds].every(Number.isFinite) || seconds < 0 || seconds > .25) throw new RangeError('invalid movement delta');
    if (!this.controlsEnabled) return false;
    const length = Math.hypot(x, z);
    if (!length) return false;
    const p = this.world.player;
    const nx = Math.max(-8, Math.min(8, p.x + x / length * 3 * seconds));
    const nz = Math.max(-8, Math.min(14, p.z + z / length * 3 * seconds));
    // The physical wall remains after opening; passage is the central gap only.
    const touchesWall = Math.min(p.z, nz) <= .5 && Math.max(p.z, nz) >= -.5;
    if (touchesWall && (!this.world.unlocked || Math.max(Math.abs(p.x), Math.abs(nx)) > 1.35)) return false;
    p.x = nx;
    p.z = nz;
    if (p.z > 1) this.world.crossed = true;
    return true;
  }
  dispose() {
    this.token++;
    this.releaseMedia();
    this.stage = 'disposed';
    this.paused = false;
  }
}
