const net = require('node:net');
net.Server.prototype.listen = function () {
  throw new Error('AUDIT_DENIED_LISTEN: Node DOM check must not open a listener');
};
