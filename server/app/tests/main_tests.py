from fastapi.testclient import TestClient

from ..main import app

client = TestClient(app)

def return_False():
    return False

def test_static_files():
    has_files = return_False()
    assert has_files == True