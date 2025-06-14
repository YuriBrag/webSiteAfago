# tests/test_app.py
import pytest
from app import app, sanitize_email_for_filename # Importe seu app e a função

def test_sanitize_email():
    assert sanitize_email_for_filename("test.user@example.com") == "test.user_example.com"
    assert sanitize_email_for_filename("user/invalid@char.com") == "user_invalid_char.com"
    assert sanitize_email_for_filename("simple_user") == "simple_user"