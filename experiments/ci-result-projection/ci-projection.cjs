// Pure JSON -> JSON. Exactly one explicitly requested first page per source.
// The caller must use exact SHA, per_page=100&page=1 and no state/event filters.
// checks uses filter=latest. This is NOT required-CI or merge eligibility logic.
function projectCIPage(kind, sha, body) {
  if (!['statuses','checks','actions'].includes(kind)) throw Error('Invalid source kind');
  const key = {statuses:'statuses', checks:'check_runs', actions:'workflow_runs'}[kind];
  if (!key || !/^[0-9a-f]{40}$/.test(sha) || !body ||
      !Array.isArray(body[key]) || !Number.isSafeInteger(body.total_count) ||
      body.total_count < body[key].length) throw Error('Invalid API page');
  if (kind === 'statuses' && typeof body.state !== 'string') throw Error('Invalid combined state');
  if (kind === 'statuses' && body.sha !== sha) throw Error('SHA mismatch');
  const link = (...values) => values.find(value => {
    if (typeof value !== 'string') return false;
    try { const u = new URL(value); return ['http:', 'https:'].includes(u.protocol) && !u.username && !u.password; }
    catch { return false; }
  }) || null;
  const items = body[key].map(x => {
    if (!x || typeof x !== 'object' || typeof (kind === 'statuses' ? x.state : x.status) !== 'string') throw Error('Invalid record');
    if (kind !== 'statuses' && x.head_sha !== sha) throw Error('SHA mismatch');
    if (kind !== 'statuses' && x.conclusion !== null && typeof x.conclusion !== 'string') throw Error('Invalid conclusion');
    if (kind === 'statuses' && x.description != null && typeof x.description !== 'string') throw Error('Invalid status description');
    const status = kind === 'statuses' ? x.state : x.status;
    const conclusion = kind === 'statuses' ? null : (x.conclusion ?? null);
    const observation = kind === 'statuses'
      ? (['error','failure'].includes(status) ? 'failure' : ['pending','success'].includes(status) ? status : 'unknown')
      : ['queued','in_progress','waiting','requested','pending'].includes(status) ? 'pending'
      : status !== 'completed' ? 'unknown'
      : ['failure','timed_out'].includes(conclusion) ? 'failure'
      : ['success','neutral','skipped','cancelled','action_required','stale'].includes(conclusion) ? conclusion : 'unknown';
    return {id:x.id ?? null, name:x.context ?? x.name ?? null,
      sha:kind === 'statuses' ? body.sha : x.head_sha,
      status, conclusion, observation,
      ...(kind === 'statuses' ? {description:x.description ?? null} : {}),
      url:kind === 'statuses' ? link(x.target_url) : link(x.html_url, x.details_url)};
  });
  const total = body.total_count;
  return {source:kind, sha, query_scope:{statuses:'commit_statuses_latest_per_context',
      checks:'check_runs_filter_latest', actions:'actions_head_sha_without_event_filter'}[kind],
    combined_state:kind === 'statuses' ? (body.state ?? null) : null,
    total_count:total, returned_count:items.length, missing_count:total-items.length,
    // Only completeness against this endpoint's reported total; not all CI.
    page:1, per_page:100, page_complete:total === items.length,
    observation:total === 0 ? 'no_records_observed' : 'records_observed', items};
}
function projectCI(sha, {statuses, checks, actions}) {
  return {sha, sources:[projectCIPage('statuses',sha,statuses),
    projectCIPage('checks',sha,checks), projectCIPage('actions',sha,actions)]};
}
module.exports = {projectCIPage, projectCI};
