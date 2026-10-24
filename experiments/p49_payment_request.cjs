const { createRequire } = require('node:module');
const req = createRequire(process.env.P49_PAYMENT_DIR + '/package.json');
const grpc = req('@grpc/grpc-js');
const loader = req('@grpc/proto-loader');
const proto = grpc.loadPackageDefinition(loader.loadSync(process.env.P49_PAYMENT_DIR + '/demo.proto'));
const client = new proto.oteldemo.PaymentService('127.0.0.1:'+process.env.PAYMENT_PORT, grpc.credentials.createInsecure());
const metadata = new grpc.Metadata();
metadata.set('traceparent', '00-'+process.env.P49_TRACE_ID+'-1234567890abcdef-01');
metadata.set('baggage', 'synthetic_request=true');
client.waitForReady(Date.now()+15000, err => {
 if(err) { console.error(err.message); client.close(); process.exitCode=2; return; }
 // Public demo-style synthetic card. Never a real account or processor.
 const request={amount:{currencyCode:'USD', units:1, nanos:0},creditCard:{creditCardNumber:'4111111111111111',creditCardCvv:123,creditCardExpirationYear:2099,creditCardExpirationMonth:12}};
 client.charge(request, metadata, {deadline:Date.now()+20000}, (err,response) => {
  console.log(JSON.stringify({scenario:process.env.P49_SCENARIO,traceId:process.env.P49_TRACE_ID, error:err?{code:err.code,details:err.details}:null,response:response||null}));
  client.close();
 });
});
