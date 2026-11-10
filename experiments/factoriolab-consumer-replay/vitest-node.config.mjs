export default {
  server: { middlewareMode: true, ws: false, hmr: false },
  test: {
    api: { middlewareMode: true }, ui: false, watch: false,
    environment: 'jsdom', pool: 'threads', maxWorkers: 1,
  },
};
