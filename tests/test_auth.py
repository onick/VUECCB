"""
Tests for authentication endpoints.
"""

import pytest
from fastapi.testclient import TestClient


class TestAuthentication:
    """Test authentication functionality."""
    
    @pytest.mark.unit
    def test_register_success(self, test_client: TestClient, test_user_data, mock_email_service):
        """Test successful user registration."""
        response = test_client.post("/api/register", json=test_user_data)
        
        assert response.status_code == 201
        data = response.json()
        
        # Check response structure
        assert "access_token" in data
        assert "token_type" in data
        assert data["token_type"] == "bearer"
        assert "user" in data
        
        # Check user data
        user = data["user"]
        assert user["email"] == test_user_data["email"]
        assert user["name"] == test_user_data["name"]
        assert user["phone"] == test_user_data["phone"]
        assert user["age"] == test_user_data["age"]
        assert user["location"] == test_user_data["location"]
        assert user["is_admin"] is False
        assert "id" in user
        
        # Check that welcome email was sent
        mock_email_service.assert_called_once()
    
    @pytest.mark.unit
    def test_register_duplicate_email(self, test_client: TestClient, test_user_data):
        """Test registration with duplicate email."""
        # Register first user
        response = test_client.post("/api/register", json=test_user_data)
        assert response.status_code == 201
        
        # Try to register with same email
        response = test_client.post("/api/register", json=test_user_data)
        assert response.status_code == 409
        assert "already registered" in response.json()["detail"].lower()
    
    @pytest.mark.unit
    def test_register_invalid_email(self, test_client: TestClient, test_user_data):
        """Test registration with invalid email."""
        test_user_data["email"] = "invalid-email"
        response = test_client.post("/api/register", json=test_user_data)
        assert response.status_code == 422
    
    @pytest.mark.unit
    def test_login_success(self, test_client: TestClient, test_user_data):
        """Test successful login."""
        # Register user first
        test_client.post("/api/register", json=test_user_data)
        
        # Login
        login_data = {
            "email": test_user_data["email"],
            "password": test_user_data["password"]
        }
        response = test_client.post("/api/login", json=login_data)
        
        assert response.status_code == 200
        data = response.json()
        
        # Check response structure
        assert "access_token" in data
        assert "token_type" in data
        assert data["token_type"] == "bearer"
        assert "user" in data
        
        # Check user data
        user = data["user"]
        assert user["email"] == test_user_data["email"]
        assert user["name"] == test_user_data["name"]
    
    @pytest.mark.unit
    def test_login_wrong_password(self, test_client: TestClient, test_user_data):
        """Test login with wrong password."""
        # Register user first
        test_client.post("/api/register", json=test_user_data)
        
        # Try to login with wrong password
        login_data = {
            "email": test_user_data["email"],
            "password": "wrongpassword"
        }
        response = test_client.post("/api/login", json=login_data)
        
        assert response.status_code == 401
        assert "Invalid credentials" in response.json()["detail"]
    
    @pytest.mark.unit
    def test_login_nonexistent_user(self, test_client: TestClient):
        """Test login with non-existent user."""
        login_data = {
            "email": "nonexistent@example.com",
            "password": "anypassword"
        }
        response = test_client.post("/api/login", json=login_data)
        
        assert response.status_code == 401
        assert "Invalid credentials" in response.json()["detail"]
    
    @pytest.mark.unit
    def test_protected_endpoint_without_token(self, test_client: TestClient):
        """Test accessing protected endpoint without token."""
        response = test_client.get("/api/reservations")
        assert response.status_code == 403
        assert "Not authenticated" in response.json()["detail"]
    
    @pytest.mark.unit
    def test_protected_endpoint_with_invalid_token(self, test_client: TestClient):
        """Test accessing protected endpoint with invalid token."""
        headers = {"Authorization": "Bearer invalid-token"}
        response = test_client.get("/api/reservations", headers=headers)
        assert response.status_code == 401
        assert "Could not validate credentials" in response.json()["detail"]
    
    @pytest.mark.unit
    def test_protected_endpoint_with_valid_token(self, test_client: TestClient, auth_headers):
        """Test accessing protected endpoint with valid token."""
        response = test_client.get("/api/reservations", headers=auth_headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)