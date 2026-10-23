"""Independent consumer regression: preserve Series data and every named axis."""
import pandas as pd
import pytest
import xarray as xr
from hypothesis import example, given, settings, strategies as st

NAMES = [
    ('x', 'y'),
    ('__temporary_name', 'y'),
    ('x', '__temporary_name'),
    ('__temporary_name', '__temporary_name_fallback'),
    ('__temporary_name', '___temporary_name'),
    ('__temporary_name', '___temporary_name', '____temporary_name'),
]


def check_roundtrip(names: tuple[str, ...], series_name: str | None) -> None:
    levels = [[10 * i + 2, 10 * i + 5] for i in range(len(names))]
    index = pd.MultiIndex.from_product(levels, names=names)
    source = pd.Series(range(100, 100 + len(index)), index=index, name=series_name)
    result = xr.DataArray.from_series(source)
    assert result.name == source.name
    assert result.dims == names
    for name, values in zip(names, levels, strict=True):
        assert result.coords[name].dims == (name,)
        assert result.coords[name].values.tolist() == values
    pd.testing.assert_series_equal(result.to_series(), source)


@pytest.mark.parametrize('names', NAMES)
@pytest.mark.parametrize('series_name', [None, 'measure', '__temporary_name', '__temporary_name_fallback'])
def test_collision_family(names: tuple[str, ...], series_name: str | None) -> None:
    check_roundtrip(names, series_name)


@given(st.lists(st.integers(min_value=2, max_value=12), min_size=2, max_size=4, unique=True))
@example([2, 3, 4])
@settings(max_examples=100, deadline=None, derandomize=True)
def test_repeated_sentinel_collision(prefix_lengths: list[int]) -> None:
    names = tuple('_' * n + 'temporary_name' for n in prefix_lengths)
    check_roundtrip(names, '__temporary_name')


@pytest.mark.parametrize('index_name', ['x', '__temporary_name', '__temporary_name_fallback'])
def test_single_index_preserved(index_name: str) -> None:
    source = pd.Series([11, 22], index=pd.Index([2, 5], name=index_name), name='measure')
    pd.testing.assert_series_equal(xr.DataArray.from_series(source).to_series(), source)
