// Observation only: OpenFeature's documented after hook, no value overrides.
const { createRequire } = require('node:module');
const req = createRequire(process.env.P49_PAYMENT_DIR + '/package.json');
const { OpenFeature } = req('@openfeature/server-sdk');
const { trace } = req('@opentelemetry/api');
OpenFeature.addHooks({after(context, details) {
  if (!['paymentFailure', 'emitRawPii'].includes(context.flagKey)) return;
  const sc = trace.getActiveSpan()?.spanContext();
  console.log('P49_FLAG ' + JSON.stringify({flagKey: context.flagKey, value: details.value, reason: details.reason, variant: details.variant, errorCode: details.errorCode, traceId:sc?.traceId, spanId:sc?.spanId}));
}});
