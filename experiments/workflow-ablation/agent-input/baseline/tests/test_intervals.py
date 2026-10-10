import unittest
from intervals import compact_ranges


class ExistingTests(unittest.TestCase):
  def test_empty(self):
    self.assertEqual(compact_ranges([]), [])

  def test_separate_sorted(self):
    self.assertEqual(compact_ranges([(8, 9), (1, 3)]), [(1, 3), (8, 9)])

  def test_overlap(self):
    self.assertEqual(compact_ranges([(1, 4), (3, 6)]), [(1, 6)])

  def test_adjacent(self):
    self.assertEqual(compact_ranges([(1, 3), (4, 6)]), [(1, 6)])


if __name__ == "__main__":
  unittest.main()
