"""
Pytest configuration and fixtures.
"""

import pytest
from typing import Generator, Dict, Any
from fastapi.testclient import TestClient
from pymongo import MongoClient
import os

# Set test environment
os.environ["ENVIRONMENT"] = "testing"
os.environ["MONGO_URL"] = "mongodb://localhost:27017/cultural_center_test"


@pytest.fixture(scope="session")
def test_db():
    """Create a test database connection."""
    client = MongoClient(os.environ["MONGO_URL"])
    db = client.cultural_center_test
    
    yield db
    
    # Cleanup after all tests
    client.drop_database("cultural_center_test")
    client.close()


@pytest.fixture(autouse=True)
def clean_db(test_db):
    """Clean database before each test."""
    for collection in test_db.list_collection_names():
        test_db[collection].delete_many({})


@pytest.fixture
def test_user_data() -> Dict[str, Any]:
    """Sample user data for testing."""
    return {
        "name": "Test User",
        "email": "test@example.com",
        "password": "testpassword123",
        "phone": "+1234567890",
        "age": 25,
        "location": "Test City"
    }


@pytest.fixture
def test_admin_data() -> Dict[str, Any]:
    """Sample admin user data for testing."""
    return {
        "name": "Test Admin",
        "email": "admin@example.com",
        "password": "adminpassword123",
        "phone": "+0987654321",
        "age": 30,
        "location": "Admin City",
        "is_admin": True
    }


@pytest.fixture
def test_event_data() -> Dict[str, Any]:
    """Sample event data for testing."""
    return {
        "title": "Test Concert",
        "description": "A test concert event",
        "category": "Concerts",
        "date": "2025-12-31",
        "time": "20:00",
        "capacity": 100,
        "location": "Main Hall",
        "image_url": "https://example.com/concert.jpg"
    }


@pytest.fixture
def auth_headers(test_client: TestClient, test_user_data: Dict[str, Any]) -> Dict[str, str]:
    """Get authentication headers for a regular user."""
    # Register user
    response = test_client.post("/api/register", json=test_user_data)
    assert response.status_code == 201
    
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def admin_auth_headers(test_client: TestClient, test_admin_data: Dict[str, Any]) -> Dict[str, str]:
    """Get authentication headers for an admin user."""
    # Register admin user
    response = test_client.post("/api/register", json=test_admin_data)
    assert response.status_code == 201
    
    # In a real scenario, you'd update the user to be admin in the database
    # For testing, we'll assume the endpoint handles this
    
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def mock_email_service(mocker):
    """Mock email service to prevent actual emails during tests."""
    mock = mocker.patch("backend.services.email_service.email_service.send_email")
    mock.return_value = True
    return mock


@pytest.fixture
def sample_qr_code() -> str:
    """Sample QR code data URI for testing."""
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="