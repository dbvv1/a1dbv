import assert from "node:assert/strict";
export const expectedVersions = {
  node: "v24.19.0",
  core: "4.5.1",
  functions: "4.5.1",
  validator: "2.0.0-dev.3.10",
};
export const expectedInputSHA256 =
  "d97044e701822bac5a62696459b27d7b375aada5de8574ed4362edbba94771f7";
export function assertVersions(versions) {
  assert.deepEqual(
    versions,
    expectedVersions,
    "Pinned runtime/package versions changed",
  );
}
export function assertInput(hash) {
  assert.equal(hash, expectedInputSHA256, "Pinned Fox input hash changed");
}
export function assertExpected(results) {
  assertVersions(results.versions);
  assertInput(results.inputSHA256);
  const keys = [
    "R1_HeroColor",
    "R1_otherMembersUnchanged",
    "R2_R1Retained",
    "R2_otherMembersUnchanged",
    "R2_HeroOtherClipsUnchanged",
    "R2_HeroGeometrySkinHierarchyUnchanged",
    "R2_HeroRunOutputsUnchanged",
    "R2_HeroRunDuration08",
  ];
  for (const mode of ["naive", "keepUniqueNames", "cow", "rebuild"]) {
    assert.deepEqual(
      Object.keys(results.checks[mode]).sort(),
      keys.toSorted(),
      `${mode} check inventory changed`,
    );
    for (const key of keys) {
      const negative =
        (mode === "naive" &&
          ["R1_otherMembersUnchanged", "R2_otherMembersUnchanged"].includes(
            key,
          )) ||
        (mode === "keepUniqueNames" && key === "R2_otherMembersUnchanged");
      assert.equal(
        results.checks[mode][key],
        !negative,
        `Unexpected outcome: ${mode}.${key}`,
      );
    }
  }
  assert.equal(
    results.checks.cowMatchesRebuildR2,
    true,
    "Positive routes differ",
  );
  const names = [
    "source-r0",
    ...["naive", "keepUniqueNames", "cow", "rebuild"].flatMap((m) =>
      [0, 1, 2].map((r) => `${m}-r${r}`),
    ),
  ];
  assert.deepEqual(
    Object.keys(results.artifacts).sort(),
    names.sort(),
    "Artifact inventory changed",
  );
  for (const [name, a] of Object.entries(results.artifacts))
    assert.deepEqual(
      a.validator,
      { errors: 0, warnings: 0 },
      `Validator policy failed: ${name}`,
    );
}
