// Original synthetic mechanism demo, not OpenCode source.
class RetainedPluginPayload { constructor() { this.values = new Array(100_000).fill(7); } }
export const payload = new RetainedPluginPayload();
