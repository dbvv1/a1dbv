// Nakama's embedded ES5 runtime, not Node. Only synthetic local data in the demo.
var BOARD = 'best_run_v1';
function failure(message, code) { throw {message: message, code: code}; }
function readOne(nk, collection, key, userId) {
  var rows = nk.storageRead([{collection: collection, key: key, userId: userId}]);
  return rows.length ? rows[0] : null;
}
function decode(payload) {
  var value;
  try { value = JSON.parse(payload); } catch (_) { failure('invalid JSON', 3); }
  if (!value || typeof value !== 'object' || Array.isArray(value)) failure('object required', 3);
  return value;
}
function project(nk, userId, profile) {
  // The board is a retryable projection, not part of the storage transaction.
  return nk.leaderboardRecordWrite(BOARD, userId, null, profile.best, 0,
    {profileSchema: profile.schema});
}
function settle(ctx, logger, nk, payload) {
  // A player session may never submit an authoritative result. The local demo
  // uses a trusted server-to-server caller, not an anti-cheat implementation.
  if (ctx.userId) failure('server settlement only', 7);
  var request = decode(payload);
  if (typeof request.userId !== 'string' || !/^[a-f0-9-]{36}$/.test(request.userId) ||
      typeof request.matchId !== 'string' || !/^[a-zA-Z0-9_-]{1,64}$/.test(request.matchId) ||
      typeof request.score !== 'number' || request.score < 0 || request.score > 1000000 ||
      Math.floor(request.score) !== request.score ||
      (request.rule !== 1 && request.rule !== 2)) failure('invalid settlement', 3);
  var fingerprint = request.resultFingerprint === undefined ? '' : request.resultFingerprint;
  if (typeof fingerprint !== 'string' || (fingerprint !== '' && !/^[a-f0-9]{64}$/.test(fingerprint))) failure('invalid result fingerprint', 3);
  if (nk.usersGetId([request.userId]).length !== 1) failure('unknown player', 5);
  var receipt = readOne(nk, 'settlement', request.matchId, request.userId);
  var old = readOne(nk, 'progress', 'main', request.userId);
  if (receipt) {
    if (receipt.value.score !== request.score || receipt.value.rule !== request.rule ||
        (receipt.value.resultFingerprint || '') !== fingerprint) {
      failure('result identity reused with a different result', 9);
    }
    return JSON.stringify({duplicate: true, progress: old.value});
  }
  var value = old ? old.value : {schema: 1, xp: 0, best: 0, runs: 0};
  var next = {schema: Math.max(value.schema, request.rule), xp: value.xp + Math.floor(request.score / 10),
    best: Math.max(value.best, request.score), runs: value.runs + 1};
  // Second requirement: a v2 bonus unlock is derived from authoritative XP;
  // old XP/best/runs survive instead of uploading a replacement client save.
  if (next.schema >= 2) next.dashUnlocked = next.xp >= 20;
  nk.storageWrite([
    {collection: 'settlement', key: request.matchId, userId: request.userId,
      value: {score: request.score, rule: request.rule, resultFingerprint: fingerprint}, version: '*', permissionRead: 0, permissionWrite: 0},
    {collection: 'progress', key: 'main', userId: request.userId,
      value: next, version: old ? old.version : '*', permissionRead: 1, permissionWrite: 0}
  ]);
  return JSON.stringify({duplicate: false, progress: next});
}
function beforeWrite(ctx, logger, nk, data) {
  if (!data.objects || data.objects.length < 1 || data.objects.length > 4) failure('one to four saves required', 3);
  for (var i = 0; i < data.objects.length; i++) {
    var object = data.objects[i];
    if (object.collection !== 'save' || !/^slot_[a-z0-9_]{1,20}$/.test(object.key)) failure('client save collection only', 7);
    if (object.permissionRead !== 1 || object.permissionWrite !== 1) failure('save must stay owner private', 7);
    if (typeof object.version !== 'string' || object.version.length === 0) failure('conditional save version required', 3);
    var value = decode(object.value);
    if (value.schema !== 1 || typeof value.chapter !== 'number' || value.chapter < 0 ||
        value.chapter > 99 || Math.floor(value.chapter) !== value.chapter) failure('invalid local checkpoint', 3);
  }
  return data;
}
function beforeDelete(ctx, logger, nk, data) {
  for (var i = 0; i < data.objectIds.length; i++) {
    if (data.objectIds[i].collection !== 'save') failure('cannot delete server progress', 7);
  }
  return data;
}
function repair(ctx, logger, nk, payload) {
  if (!ctx.userId) failure('player session required', 16);
  var profile = readOne(nk, 'progress', 'main', ctx.userId);
  if (!profile) failure('no confirmed progress', 5);
  var result = project(nk, ctx.userId, profile.value);
  return JSON.stringify({score: result.score});
}
var InitModule = function(ctx, logger, nk, initializer) {
  nk.leaderboardCreate(BOARD, true, 'desc', 'best', null, {source: 'confirmed_progress'});
  initializer.registerRpc('settle_demo_result', settle);
  initializer.registerBeforeWriteStorageObjects(beforeWrite);
  initializer.registerBeforeDeleteStorageObjects(beforeDelete);
  initializer.registerRpc('repair_my_rank', repair);
};
