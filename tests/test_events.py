"""
Tests for event endpoints.
"""

import pytest
from fastapi.testclient import TestClient


class TestEvents:
    """Test event functionality."""
    
    @pytest.mark.unit
    def test_get_events_public(self, test_client: TestClient):
        """Test getting events without authentication."""
        response = test_client.get("/api/events")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
    
    @pytest.mark.unit
    def test_get_categories(self, test_client: TestClient):
        """Test getting event categories."""
        response = test_client.get("/api/categories")
        assert response.status_code == 200
        
        categories = response.json()
        assert isinstance(categories, list)
        assert len(categories) == 8
        assert "Concerts" in categories
        assert "Workshops" in categories
    
    @pytest.mark.integration
    def test_create_event_as_admin(self, test_client: TestClient, admin_auth_headers, test_event_data):
        """Test creating an event as admin."""
        response = test_client.post(
            "/api/events",
            json=test_event_data,
            headers=admin_auth_headers
        )
        
        assert response.status_code == 201
        data = response.json()
        
        # Check event data
        assert data["title"] == test_event_data["title"]
        assert data["description"] == test_event_data["description"]
        assert data["category"] == test_event_data["category"]
        assert data["date"] == test_event_data["date"]
        assert data["time"] == test_event_data["time"]
        assert data["capacity"] == test_event_data["capacity"]
        assert data["location"] == test_event_data["location"]
        assert data["available_spots"] == test_event_data["capacity"]
        assert "id" in data
        assert "created_at" in data
    
    @pytest.mark.unit
    def test_create_event_as_regular_user(self, test_client: TestClient, auth_headers, test_event_data):
        """Test that regular users cannot create events."""
        response = test_client.post(
            "/api/events",
            json=test_event_data,
            headers=auth_headers
        )
        
        assert response.status_code == 403
        assert "admin" in response.json()["detail"].lower()
    
    @pytest.mark.unit
    def test_create_event_without_auth(self, test_client: TestClient, test_event_data):
        """Test creating event without authentication."""
        response = test_client.post("/api/events", json=test_event_data)
        assert response.status_code == 403
    
    @pytest.mark.unit
    def test_create_event_invalid_category(self, test_client: TestClient, admin_auth_headers, test_event_data):
        """Test creating event with invalid category."""
        test_event_data["category"] = "Invalid Category"
        response = test_client.post(
            "/api/events",
            json=test_event_data,
            headers=admin_auth_headers
        )
        
        assert response.status_code == 400
        assert "category" in response.json()["detail"].lower()
    
    @pytest.mark.integration
    def test_event_availability_updates(self, test_client: TestClient, admin_auth_headers, auth_headers, test_event_data):
        """Test that event availability updates when reservations are made."""
        # Create event
        response = test_client.post(
            "/api/events",
            json=test_event_data,
            headers=admin_auth_headers
        )
        event_id = response.json()["id"]
        
        # Check initial availability
        response = test_client.get("/api/events")
        events = response.json()
        event = next(e for e in events if e["id"] == event_id)
        assert event["available_spots"] == test_event_data["capacity"]
        
        # Make a reservation
        reservation_data = {
            "event_id": event_id,
            "user_id": "dummy_user_id"  # This would be extracted from token in real implementation
        }
        response = test_client.post(
            "/api/reservations",
            json=reservation_data,
            headers=auth_headers
        )
        assert response.status_code == 201
        
        # Check updated availability
        response = test_client.get("/api/events")
        events = response.json()
        event = next(e for e in events if e["id"] == event_id)
        assert event["available_spots"] == test_event_data["capacity"] - 1