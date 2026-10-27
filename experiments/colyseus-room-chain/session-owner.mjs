// One local gameplay session. Colyseus still owns transport, retries and state decoding.
export class SessionOwner {
  generation = 0;
  current = null;
  status = 'idle';
  error = null;
  trace = [];
  retiring = new Set();

  async connect(join) {
    const generation = this.invalidate('connecting');
    let room;
    try { room = await join(); }
    catch (error) {
      if (generation !== this.generation) return {status:'superseded'};
      this.status = 'failed';
      this.error = error.message;
      throw error;
    }
    if (generation !== this.generation) {
      await this.retire(room);
      return {status:'superseded'};
    }
    this.attach(room, generation);
    return {status:'adopted', roomId:room.roomId};
  }

  invalidate(status) {
    const previous = this.current;
    this.generation++;
    this.current = null; // Input, token and snapshot lose ownership before any await.
    this.status = status;
    this.error = null;
    if (previous) {
      previous.detach(); // Remove our handlers, not the SDK's own onLeave cleanup.
      if (!previous.closed) this.retire(previous.room);
    }
    return this.generation;
  }

  attach(room, generation) {
    const entry = {room, generation, snapshot:null, initialized:false, acceptedInput:false,
      issuedEpoch:null, issuedSeq:0, closed:false, detach:null};
    this.current = entry;
    this.status = 'waiting-state';
    const owns = () => this.current === entry && this.generation === generation;
    const listen = (signal, callback) => {
      const guarded = (...args) => { if (owns()) callback(...args); };
      signal(guarded);
      return () => signal.remove(guarded);
    };
    const record = event => this.trace.push({generation,roomId:room.roomId,sessionId:room.sessionId,...event});
    const suspend = kind => {
      entry.acceptedInput = false;
      entry.initialized = false;
      entry.issuedEpoch = null;
      this.status = 'waiting-state';
      record({kind});
    };
    const detach = [
      listen(room.onStateChange, state => {
        entry.snapshot = state.toJSON();
        entry.initialized = true;
        const confirmed = entry.snapshot.players[room.sessionId]?.lastSeq ?? 0;
        if (entry.issuedEpoch !== entry.snapshot.epoch) {
          entry.issuedEpoch = entry.snapshot.epoch;
          entry.issuedSeq = confirmed;
        } else entry.issuedSeq = Math.max(entry.issuedSeq, confirmed);
        entry.acceptedInput = entry.snapshot.phase === 'playing' && entry.snapshot.players[room.sessionId]?.connected === true;
        this.status = 'attached';
        record({kind:'state',phase:entry.snapshot.phase,score:entry.snapshot.score,epoch:entry.snapshot.epoch});
      }),
      listen(room.onDrop, () => suspend('drop')),
      listen(room.onReconnect, () => suspend('reconnected-before-state')),
      listen(room.onLeave, code => {
        entry.closed = true;
        entry.acceptedInput = false;
        entry.initialized = false;
        this.status = 'left';
        record({kind:'leave',code});
      }),
      listen(room.onError, (code,message) => record({kind:'error',code,message})),
      room.onMessage('rejected', message => { if (owns()) record({kind:'rejected',...message}); }),
    ];
    entry.detach = () => detach.forEach(remove => remove());
  }

  retire(room) {
    // 0.18.6 does not cancel an already scheduled retry when enabled becomes false.
    // Keep only a release listener: if that retry succeeds, leave THAT Room, never adopt it.
    room.reconnection.enabled = false;
    room.reconnection.enqueuedMessages.length = 0;
    const released = new Promise(resolve => {
      const onReconnect = () => { void room.leave(); };
      room.onReconnect(onReconnect);
      room.onLeave.once(() => { room.onReconnect.remove(onReconnect); resolve(); });
      if (room.connection.isOpen) void room.leave();
      else if (!room.reconnection.isReconnecting) {
        // Already closed, or a close event is queued; disabled retries cannot reopen it.
        room.onReconnect.remove(onReconnect);
        resolve();
      }
    });
    this.retiring.add(released);
    released.then(() => this.retiring.delete(released));
    return released;
  }

  async leave() {
    this.invalidate('idle');
    await Promise.all([...this.retiring]);
  }

  requireRoom() {
    if (!this.current || this.current.closed) throw new Error('no current session');
    return this.current;
  }

  ready(ready = true) { this.requireRoom().room.send('ready', {ready}); }

  activate({raw = false, data} = {}) {
    const entry = this.requireRoom();
    if (!entry.acceptedInput && !raw) throw new Error('wait for current playing state before input');
    if (data) entry.room.send('activate', data); // Test-only malformed/retry path.
    else {
      const seq = entry.issuedSeq + 1;
      entry.room.send('activate', {seq,epoch:entry.snapshot.epoch});
      entry.issuedSeq = seq;
    }
  }

  token() {
    const entry = this.requireRoom();
    if (!entry.initialized) throw new Error('wait for current state before saving token');
    return entry.room.reconnectionToken;
  }

  inspect() {
    const entry = this.current;
    return {generation:this.generation,status:this.status,error:this.error,
      roomId:entry?.room.roomId,sessionId:entry?.room.sessionId,
      initialized:entry?.initialized ?? false,acceptedInput:entry?.acceptedInput ?? false,
      snapshot:entry?.snapshot ?? null,issuedSeq:entry?.issuedSeq ?? 0,
      trace:[...this.trace],retiring:this.retiring.size};
  }
}
