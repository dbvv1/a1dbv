export function exactlyOne(items, label) {
  if (items.length !== 1)
    throw new Error(
      `Identity resolution refused: ${label}; expected exactly 1, found ${items.length}`,
    );
  return items[0];
}
export function validateMemberIds(d, member) {
  const seen = new Set();
  for (const n of d
    .getRoot()
    .listNodes()
    .filter((n) => n.getExtras().experimentMember === member)) {
    const id = n.getExtras().sourceNode;
    if (!Number.isInteger(id) || id < 0 || seen.has(id))
      throw new Error(
        `Identity resolution refused: ${member} missing or duplicate sourceNode ID`,
      );
    seen.add(id);
  }
}
export function nodeFor(d, member) {
  const n = exactlyOne(
    d
      .getRoot()
      .listNodes()
      .filter((n) => n.getExtras().experimentMember === member && n.getMesh()),
    `${member} mesh node`,
  );
  validateMemberIds(d, member);
  return n;
}
export function run(d) {
  const a = exactlyOne(
    d
      .getRoot()
      .listAnimations()
      .filter((a) => a.getName() === "Hero/Run"),
    "Hero/Run animation",
  );
  validateMemberIds(d, "Hero");
  if (a.listChannels().length === 0 || a.listSamplers().length === 0)
    throw new Error("Identity resolution refused: empty Hero/Run");
  if (
    a
      .listChannels()
      .some((c) => c.getTargetNode()?.getExtras().experimentMember !== "Hero")
  )
    throw new Error(
      "Identity resolution refused: Hero/Run targets another member",
    );
  return a;
}
