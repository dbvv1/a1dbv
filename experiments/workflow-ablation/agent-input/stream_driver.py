"""Public starting interface. Implement run; Python 3.11+, standard library."""


class Cancel(Exception):
  """Cooperative cancellation requested by the handler."""


def run(source, handler):
  """Return a list of consumed values, preserving source order."""
  raise NotImplementedError("Implement the current round's contract")
