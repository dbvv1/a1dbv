#!/usr/bin/env python3
"""Offline check of fixed sqlite-chronicle README SQL, not the package/CLI.

SQL copied unchanged from Simon Willison / sqlite-chronicle contributors,
SQL fixtures: Apache-2.0; harness authored here: repository MIT license.
Full upstream license: sqlite-chronicle-LICENSE.txt. No upstream NOTICE
file was present at the latest pinned SHA. Modifications: SQL embedded in
this independently written test harness; original SQL statements unchanged.
Network, dependencies, installation and private data are not used at runtime.
A passing harness confirms the specified observations INCLUDING known bugs;
it does not certify sqlite-chronicle or any model as correct.
"""
import hashlib
import json
import sqlite3
import sys

VERSIONS = {'old': '25370bdd9ce4d5c3be93d5035e86b44bd9346476', 'intermediate': '60f09b9833f4bbc44ea52cd89cf9c4e5329a804e', 'final': '9cd5293f5e89825a8824c1f258231e0592d8579f', 'latest': 'ee8d2a1db5090d14279f0acb56b5d46a5c50e44c'}
SQL = {
    "old": r'''CREATE TABLE dogs (id integer primary key, name text, age integer);

CREATE TABLE "_chronicle_dogs" (
  "id" INTEGER,
  __added_ms INTEGER,
  __updated_ms INTEGER,
  __version INTEGER,
  __deleted INTEGER DEFAULT 0,
  PRIMARY KEY("id")
);

CREATE INDEX "_chronicle_dogs__version_idx"
  ON "_chronicle_dogs"(__version);

CREATE TRIGGER "chronicle_dogs_ai"
AFTER INSERT ON "dogs"
FOR EACH ROW
BEGIN
  INSERT OR IGNORE INTO "_chronicle_dogs" (
    "id", __added_ms, __updated_ms, __version, __deleted
  ) VALUES (
    NEW."id",
    CAST((julianday('now') - 2440587.5)*86400*1000 AS INTEGER),
    CAST((julianday('now') - 2440587.5)*86400*1000 AS INTEGER),
    COALESCE((SELECT MAX(__version) FROM "_chronicle_dogs"),0) + 1,
    0
  );
END;

CREATE TRIGGER "chronicle_dogs_au"
AFTER UPDATE ON "dogs"
FOR EACH ROW
WHEN OLD."name" IS NOT NEW."name" OR OLD."age" IS NOT NEW."age"
BEGIN
  UPDATE "_chronicle_dogs"
  SET __updated_ms = CAST((julianday('now') - 2440587.5)*86400*1000 AS INTEGER),
    __version = COALESCE((SELECT MAX(__version) FROM "_chronicle_dogs"),0) + 1
  WHERE "id"=NEW."id";
END;

CREATE TRIGGER "chronicle_dogs_ad"
AFTER DELETE ON "dogs"
FOR EACH ROW
BEGIN
  UPDATE "_chronicle_dogs"
    SET __updated_ms = CAST((julianday('now') - 2440587.5)*86400*1000 AS INTEGER),
      __version = COALESCE((SELECT MAX(__version) FROM "_chronicle_dogs"),0) + 1,
      __deleted = 1
  WHERE "id"=OLD."id";
END
''',
    "intermediate": r'''CREATE TABLE dogs (id integer primary key, name text, age integer);

CREATE TABLE "_chronicle_dogs" (
  "id" INTEGER,
  __added_ms INTEGER,
  __updated_ms INTEGER,
  __version INTEGER,
  __deleted INTEGER DEFAULT 0,
  PRIMARY KEY("id")
);

CREATE INDEX "_chronicle_dogs__version_idx"
  ON "_chronicle_dogs"(__version);

CREATE TABLE "_chronicle_snapshot_dogs" (key TEXT PRIMARY KEY, value TEXT);

CREATE TRIGGER "chronicle_dogs_bi"
BEFORE INSERT ON "dogs"
FOR EACH ROW
WHEN EXISTS(SELECT 1 FROM "dogs" WHERE "id"=NEW."id")
BEGIN
  INSERT OR REPLACE INTO "_chronicle_snapshot_dogs"(key, value)
  VALUES(CAST(NEW."id" AS TEXT), (SELECT json_array("name", "age") FROM "dogs" WHERE "id"=NEW."id"));
END;

CREATE TRIGGER "chronicle_dogs_ai"
AFTER INSERT ON "dogs"
FOR EACH ROW
BEGIN
  -- Un-delete if re-inserting a previously deleted row
  UPDATE "_chronicle_dogs"
  SET __updated_ms = CAST((julianday('now') - 2440587.5)*86400*1000 AS INTEGER), __version = COALESCE((SELECT MAX(__version) FROM "_chronicle_dogs"),0) + 1, __deleted = 0
  WHERE "id"=NEW."id" AND __deleted = 1;

  -- Replace with actual change: bump version
  UPDATE "_chronicle_dogs"
  SET __updated_ms = CAST((julianday('now') - 2440587.5)*86400*1000 AS INTEGER), __version = COALESCE((SELECT MAX(__version) FROM "_chronicle_dogs"),0) + 1
  WHERE "id"=NEW."id" AND __deleted = 0
    AND EXISTS(SELECT 1 FROM "_chronicle_snapshot_dogs" WHERE key = CAST(NEW."id" AS TEXT))
    AND json_array(NEW."name", NEW."age") IS NOT (SELECT value FROM "_chronicle_snapshot_dogs" WHERE key = CAST(NEW."id" AS TEXT));

  -- Clean up snapshot
  DELETE FROM "_chronicle_snapshot_dogs" WHERE key = CAST(NEW."id" AS TEXT);

  -- Fresh insert: create chronicle entry (NO INSERT OR IGNORE!)
  INSERT INTO "_chronicle_dogs"("id", __added_ms, __updated_ms, __version, __deleted)
  SELECT NEW."id", CAST((julianday('now') - 2440587.5)*86400*1000 AS INTEGER), CAST((julianday('now') - 2440587.5)*86400*1000 AS INTEGER), COALESCE((SELECT MAX(__version) FROM "_chronicle_dogs"),0) + 1, 0
  WHERE NOT EXISTS(SELECT 1 FROM "_chronicle_dogs" WHERE "id"=NEW."id");
END;

CREATE TRIGGER "chronicle_dogs_au"
AFTER UPDATE ON "dogs"
FOR EACH ROW
WHEN OLD."name" IS NOT NEW."name" OR OLD."age" IS NOT NEW."age"
BEGIN
  UPDATE "_chronicle_dogs"
  SET __updated_ms = CAST((julianday('now') - 2440587.5)*86400*1000 AS INTEGER),
    __version = COALESCE((SELECT MAX(__version) FROM "_chronicle_dogs"),0) + 1
  WHERE "id"=NEW."id";
END;

CREATE TRIGGER "chronicle_dogs_ad"
AFTER DELETE ON "dogs"
FOR EACH ROW
WHEN NOT EXISTS(SELECT 1 FROM "_chronicle_snapshot_dogs" WHERE key = CAST(OLD."id" AS TEXT))
BEGIN
  UPDATE "_chronicle_dogs"
    SET __updated_ms = CAST((julianday('now') - 2440587.5)*86400*1000 AS INTEGER),
      __version = COALESCE((SELECT MAX(__version) FROM "_chronicle_dogs"),0) + 1,
      __deleted = 1
  WHERE "id"=OLD."id";
END
''',
    "final": r'''CREATE TABLE dogs (id integer primary key, name text, age integer);

CREATE TABLE "_chronicle_dogs" (
  "id" INTEGER,
  __added_ms INTEGER,
  __updated_ms INTEGER,
  __version INTEGER,
  __deleted INTEGER DEFAULT 0,
  PRIMARY KEY("id")
);

CREATE INDEX "_chronicle_dogs__version_idx"
  ON "_chronicle_dogs"(__version);

CREATE TABLE "_chronicle_snapshot_dogs" (key TEXT PRIMARY KEY, value TEXT);

CREATE TRIGGER "chronicle_dogs_bi"
BEFORE INSERT ON "dogs"
FOR EACH ROW
WHEN EXISTS(SELECT 1 FROM "dogs" WHERE "id"=NEW."id")
BEGIN
  INSERT OR REPLACE INTO "_chronicle_snapshot_dogs"(key, value)
  VALUES(CAST(NEW."id" AS TEXT), (SELECT json_array(quote("name"), quote("age")) FROM "dogs" WHERE "id"=NEW."id"));
END;

CREATE TRIGGER "chronicle_dogs_ai"
AFTER INSERT ON "dogs"
FOR EACH ROW
BEGIN
  -- Un-delete if re-inserting a previously deleted row
  UPDATE "_chronicle_dogs"
  SET __updated_ms = CAST((julianday('now') - 2440587.5)*86400*1000 AS INTEGER), __version = COALESCE((SELECT MAX(__version) FROM "_chronicle_dogs"),0) + 1, __deleted = 0
  WHERE "id"=NEW."id" AND __deleted = 1;

  -- Replace with actual change: bump version
  UPDATE "_chronicle_dogs"
  SET __updated_ms = CAST((julianday('now') - 2440587.5)*86400*1000 AS INTEGER), __version = COALESCE((SELECT MAX(__version) FROM "_chronicle_dogs"),0) + 1
  WHERE "id"=NEW."id" AND __deleted = 0
    AND EXISTS(SELECT 1 FROM "_chronicle_snapshot_dogs" WHERE key = CAST(NEW."id" AS TEXT))
    AND json_array(quote(NEW."name"), quote(NEW."age")) IS NOT (SELECT value FROM "_chronicle_snapshot_dogs" WHERE key = CAST(NEW."id" AS TEXT));

  -- Clean up snapshot
  DELETE FROM "_chronicle_snapshot_dogs" WHERE key = CAST(NEW."id" AS TEXT);

  -- Fresh insert: create chronicle entry (NO INSERT OR IGNORE!)
  INSERT INTO "_chronicle_dogs"("id", __added_ms, __updated_ms, __version, __deleted)
  SELECT NEW."id", CAST((julianday('now') - 2440587.5)*86400*1000 AS INTEGER), CAST((julianday('now') - 2440587.5)*86400*1000 AS INTEGER), COALESCE((SELECT MAX(__version) FROM "_chronicle_dogs"),0) + 1, 0
  WHERE NOT EXISTS(SELECT 1 FROM "_chronicle_dogs" WHERE "id"=NEW."id");
END;

CREATE TRIGGER "chronicle_dogs_au"
AFTER UPDATE ON "dogs"
FOR EACH ROW
WHEN OLD."name" IS NOT NEW."name" OR OLD."age" IS NOT NEW."age"
BEGIN
  UPDATE "_chronicle_dogs"
  SET __updated_ms = CAST((julianday('now') - 2440587.5)*86400*1000 AS INTEGER),
    __version = COALESCE((SELECT MAX(__version) FROM "_chronicle_dogs"),0) + 1
  WHERE "id"=NEW."id";
END;

CREATE TRIGGER "chronicle_dogs_ad"
AFTER DELETE ON "dogs"
FOR EACH ROW
WHEN NOT EXISTS(SELECT 1 FROM "_chronicle_snapshot_dogs" WHERE key = CAST(OLD."id" AS TEXT))
BEGIN
  UPDATE "_chronicle_dogs"
    SET __updated_ms = CAST((julianday('now') - 2440587.5)*86400*1000 AS INTEGER),
      __version = COALESCE((SELECT MAX(__version) FROM "_chronicle_dogs"),0) + 1,
      __deleted = 1
  WHERE "id"=OLD."id";
END
''',
    "latest": r'''CREATE TABLE dogs (id integer primary key, name text, age integer);

CREATE TABLE "_chronicle_dogs" (
  "id" INTEGER,
  __added_ms INTEGER,
  __updated_ms INTEGER,
  __version INTEGER,
  __deleted INTEGER DEFAULT 0,
  PRIMARY KEY("id")
);

CREATE INDEX "_chronicle_dogs__version_idx"
  ON "_chronicle_dogs"(__version);

CREATE TABLE "_chroniclesnapshots" (table_name TEXT, key TEXT, value TEXT, PRIMARY KEY(table_name, key));

CREATE TRIGGER "chronicle_dogs_bi"
BEFORE INSERT ON "dogs"
FOR EACH ROW
WHEN EXISTS(SELECT 1 FROM "dogs" WHERE "id"=NEW."id")
BEGIN
  INSERT OR REPLACE INTO "_chroniclesnapshots"(table_name, key, value)
  VALUES('dogs', CAST(NEW."id" AS TEXT), (SELECT json_array(quote("name"), quote("age")) FROM "dogs" WHERE "id"=NEW."id"));
END;

CREATE TRIGGER "chronicle_dogs_ai"
AFTER INSERT ON "dogs"
FOR EACH ROW
BEGIN
  -- Un-delete if re-inserting a previously deleted row
  UPDATE "_chronicle_dogs"
  SET __added_ms = CAST((julianday('now') - 2440587.5)*86400*1000 AS INTEGER), __updated_ms = CAST((julianday('now') - 2440587.5)*86400*1000 AS INTEGER), __version = COALESCE((SELECT MAX(__version) FROM "_chronicle_dogs"),0) + 1, __deleted = 0
  WHERE "id"=NEW."id" AND __deleted = 1;

  -- Replace with actual change: bump version
  UPDATE "_chronicle_dogs"
  SET __updated_ms = CAST((julianday('now') - 2440587.5)*86400*1000 AS INTEGER), __version = COALESCE((SELECT MAX(__version) FROM "_chronicle_dogs"),0) + 1
  WHERE "id"=NEW."id" AND __deleted = 0
    AND EXISTS(SELECT 1 FROM "_chroniclesnapshots" WHERE table_name = 'dogs' AND key = CAST(NEW."id" AS TEXT))
    AND json_array(quote(NEW."name"), quote(NEW."age")) IS NOT (SELECT value FROM "_chroniclesnapshots" WHERE table_name = 'dogs' AND key = CAST(NEW."id" AS TEXT));

  -- Clean up snapshot
  DELETE FROM "_chroniclesnapshots" WHERE table_name = 'dogs' AND key = CAST(NEW."id" AS TEXT);

  -- Fresh insert: create chronicle entry (NO INSERT OR IGNORE!)
  INSERT INTO "_chronicle_dogs"("id", __added_ms, __updated_ms, __version, __deleted)
  SELECT NEW."id", CAST((julianday('now') - 2440587.5)*86400*1000 AS INTEGER), CAST((julianday('now') - 2440587.5)*86400*1000 AS INTEGER), COALESCE((SELECT MAX(__version) FROM "_chronicle_dogs"),0) + 1, 0
  WHERE NOT EXISTS(SELECT 1 FROM "_chronicle_dogs" WHERE "id"=NEW."id");
END;

CREATE TRIGGER "chronicle_dogs_au"
AFTER UPDATE ON "dogs"
FOR EACH ROW
WHEN OLD."name" IS NOT NEW."name" OR OLD."age" IS NOT NEW."age"
BEGIN
  UPDATE "_chronicle_dogs"
  SET __updated_ms = CAST((julianday('now') - 2440587.5)*86400*1000 AS INTEGER),
    __version = COALESCE((SELECT MAX(__version) FROM "_chronicle_dogs"),0) + 1
  WHERE "id"=NEW."id";
END;

CREATE TRIGGER "chronicle_dogs_ad"
AFTER DELETE ON "dogs"
FOR EACH ROW
WHEN NOT EXISTS(SELECT 1 FROM "_chroniclesnapshots" WHERE table_name = 'dogs' AND key = CAST(OLD."id" AS TEXT))
BEGIN
  UPDATE "_chronicle_dogs"
    SET __updated_ms = CAST((julianday('now') - 2440587.5)*86400*1000 AS INTEGER),
      __version = COALESCE((SELECT MAX(__version) FROM "_chronicle_dogs"),0) + 1,
      __deleted = 1
  WHERE "id"=OLD."id";
END
''',
}


def run():
    if not __debug__:
        raise SystemExit("Run without -O: observations rely on active assertions")
    if len(sys.argv) != 1:
        raise SystemExit("This offline check accepts no arguments")
    print(json.dumps({"python": sys.version.split()[0], "sqlite": sqlite3.sqlite_version}))
    count = 0
    for label, sql in SQL.items():
        print(json.dumps({"label": label, "sha": VERSIONS[label],
                          "sql_sha256": hashlib.sha256(sql.encode()).hexdigest()}))
        for recursive in (0, 1):
            for case, before, after in (
                ("text", "Cleo", "Pancakes"),
                ("blob", bytes.fromhex("DEAD"), bytes.fromhex("CAFE")),
                ("nul", "a\0x", "a\0y"),
                ("null", None, None),
            ):
                db = sqlite3.connect(":memory:")
                try:
                    db.executescript(sql)
                    db.execute(f"PRAGMA recursive_triggers={recursive}")
                    db.execute("INSERT INTO dogs VALUES (1, ?, 2)", (before,))
                    # Deterministic provenance marker; only test instrumentation
                    # changes this metadata, never the upstream triggers/schema.
                    db.execute("UPDATE _chronicle_dogs SET __added_ms=123")
                    versions = []
                    error = None
                    update_control_version = None
                    try:
                        for value in (after, after):
                            db.execute("INSERT OR REPLACE INTO dogs VALUES (1, ?, 2)", (value,))
                            versions.append(db.execute("SELECT __version FROM _chronicle_dogs").fetchone()[0])
                    except sqlite3.Error as exc:
                        error = str(exc)
                    if label == "intermediate" and case == "blob":
                        assert error == "JSON cannot hold BLOB values", error
                        assert db.execute("SELECT name FROM dogs").fetchone()[0] == before
                        assert db.execute("SELECT __version FROM _chronicle_dogs").fetchone()[0] == 1
                    else:
                        assert error is None, error
                        expected = ([3, 5] if recursive else [2, 3]) if label == "old" else (
                            [1, 1] if case == "null" or (case == "nul" and label in ("final", "latest")) else [2, 2])
                        assert versions == expected, (label, recursive, case, versions, expected)
                        row = db.execute("SELECT name FROM dogs").fetchone()[0]
                        assert row == after, (row, after)
                        metadata = db.execute("SELECT __deleted, __added_ms FROM _chronicle_dogs").fetchone()
                        assert metadata[0] == 0
                        assert (metadata[1] == 123) == (label != "old")
                        replace_hex = db.execute("SELECT hex(name) FROM dogs").fetchone()[0]
                        if case == "nul" and label in ("final", "latest"):
                            # Consumer's version cursor would see no update.
                            assert db.execute("SELECT count(*) FROM _chronicle_dogs WHERE __version > 1").fetchone()[0] == 0
                            db.execute("UPDATE dogs SET name=? WHERE id=1", ("a\0z",))
                            update_control_version = db.execute("SELECT __version FROM _chronicle_dogs").fetchone()[0]
                            assert update_control_version == 2
                        if label != "old":
                            table = "_chroniclesnapshots" if label == "latest" else "_chronicle_snapshot_dogs"
                            assert db.execute(f'SELECT count(*) FROM "{table}"').fetchone()[0] == 0
                    print(json.dumps({"label": label, "recursive_triggers": recursive,
                                      "case": case, "replace_versions": versions, "error": error,
                                      "replace_hex": None if error else replace_hex,
                                      "nul_update_control_version": update_control_version}))
                    count += 1
                finally:
                    db.close()
    assert count == 32
    print("32 scenarios matched expected observations, including historical failures and residual NUL miss")


if __name__ == "__main__":
    run()
