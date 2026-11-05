"""Fail closed on real socket connects while replaying approved public cassettes."""
import socket
import pytest
attempts = []
def denied(*args, **kwargs):
    attempts.append('socket_connect')
    raise RuntimeError('offline replay prohibits real socket connections')
socket.socket.connect = denied
socket.socket.connect_ex = denied
socket.getaddrinfo = denied
@pytest.fixture(autouse=True)
def reject_network_attempts():
    start = len(attempts)
    yield
    assert len(attempts) == start, 'unexpected real socket connection attempt'
