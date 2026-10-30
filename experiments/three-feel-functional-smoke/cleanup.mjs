// Reuse reviewed capture-output.ts helpers at the pinned MOBA tree.
export async function closeOwned({closeBrowser,browserExitState,processEvidence,launchRequested,server,port,closePreview}){
 const result={browser:null,preview:null,errors:[],proven:false};
 try{const closed=await closeBrowser();result.browser={...closed,process:processEvidence??null,state:browserExitState(launchRequested,closed.serverClosed,closed.connectionClosed,processEvidence)};}catch(e){result.errors.push('browser: '+String(e));}
 // Independent: a failed/hanging browser close must not suppress preview closure.
 try{if(server)result.preview=await closePreview(server,port);}catch(e){result.errors.push('preview: '+String(e));}
 result.proven=!!result.browser&&['not-started','owned-handles-closed'].includes(result.browser.state)&&(!server||result.preview?.exitProven===true)&&result.errors.length===0;
 return result;
}
