"""Regress the probe verdict using recorded output; not a substitute for stdio runs."""

import copy
import importlib.util
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).parent
SPEC = importlib.util.spec_from_file_location("time_probe", ROOT / "probe-time-eras.py")
assert SPEC and SPEC.loader
probe = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(probe)
FIXTURES = json.loads((ROOT / "verification.json").read_text())["cloud_acceptance"]


class ProbeVerdictTests(unittest.TestCase):
    def test_recorded_candidate_passes_all_contracts(self):
        self.assertTrue(probe.summarize(FIXTURES["candidate"]["probe"])["all_ok"])

    def test_recorded_baseline_is_not_accepted_as_candidate(self):
        verdict = probe.summarize(FIXTURES["baseline"]["probe"])
        self.assertFalse(verdict["all_ok"])
        self.assertTrue(
            all(
                value
                for key, value in verdict["checks"].items()
                if key.startswith("legacy_")
            )
        )

    def test_missing_report_and_missing_era_are_rejected(self):
        self.assertFalse(probe.summarize({})["all_ok"])
        for era in ("legacy", "modern"):
            with self.subTest(era=era):
                value = copy.deepcopy(FIXTURES["candidate"]["probe"])
                del value["eras"][era]
                self.assertFalse(probe.summarize(value)["all_ok"])

    def test_each_era_requires_conversion_success_and_value(self):
        for era in ("legacy", "modern"):
            for field, replacement in (
                ("is_error", True),
                ("text", "{}"),
                ("result_type", "wrong"),
            ):
                with self.subTest(era=era, field=field):
                    value = copy.deepcopy(FIXTURES["candidate"]["probe"])
                    value["eras"][era]["steps"]["convert"][field] = replacement
                    self.assertFalse(probe.summarize(value)["all_ok"])

    def test_each_tool_failure_is_required_in_each_era(self):
        for era in ("legacy", "modern"):
            for step in ("invalid_timezone", "missing_argument", "unknown_tool"):
                with self.subTest(era=era, step=step):
                    value = copy.deepcopy(FIXTURES["candidate"]["probe"])
                    value["eras"][era]["steps"][step]["is_error"] = False
                    self.assertFalse(probe.summarize(value)["all_ok"])

    def test_wrong_jsonrpc_codes_are_rejected(self):
        for era, step in (
            ("legacy", "resources_list"),
            ("modern", "resources_list"),
            ("modern", "ping"),
        ):
            with self.subTest(era=era, step=step):
                value = copy.deepcopy(FIXTURES["candidate"]["probe"])
                value["eras"][era]["steps"][step]["jsonrpc_code"] = -32603
                self.assertFalse(probe.summarize(value)["all_ok"])

    def test_schema_contract_is_required_even_if_both_eras_agree(self):
        value = copy.deepcopy(FIXTURES["candidate"]["probe"])
        for era in ("legacy", "modern"):
            value["eras"][era]["steps"]["tools_wire"][1]["inputSchema"]["required"] = []
        self.assertFalse(probe.summarize(value)["all_ok"])

    def test_fresh_process_must_pin_its_protocol(self):
        for era in ("legacy", probe.MODERN):
            with self.subTest(era=era):
                value = copy.deepcopy(FIXTURES["candidate"]["probe"])
                value["reconnect"][era]["protocol_version"] = "wrong"
                self.assertFalse(probe.summarize(value)["all_ok"])

    def test_discovery_requires_clean_process_and_exact_fields(self):
        value = copy.deepcopy(FIXTURES["candidate"]["probe"])
        value["raw_discover"]["process_returncode"] = 1
        self.assertFalse(probe.summarize(value)["all_ok"])
        value["raw_discover"]["process_returncode"] = 0
        del value["raw_discover"]["response"]["result"]["ttlMs"]
        self.assertFalse(probe.summarize(value)["all_ok"])


if __name__ == "__main__":
    unittest.main()
