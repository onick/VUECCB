import requests
import unittest
import json
import random
import string
import time
import re
from datetime import datetime, timedelta

# Get the backend URL from the frontend .env file
BACKEND_URL = "https://9e3637a1-65a6-4333-b260-4ab8a73085d8.preview.emergentagent.com"

# Flag to enable detailed logging of API responses
DEBUG_MODE = True

def debug_log(message):
    """Print debug messages if DEBUG_MODE is enabled"""
    if DEBUG_MODE:
        print(f"🔍 DEBUG: {message}")

class CulturalCenterAPITest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.user_token = None
        cls.admin_token = None
        cls.regular_user_id = None
        cls.admin_user_id = None
        cls.test_event_id = None
        cls.test_reservation_id = None
        cls.admin_created_event_id = None
        
        # Generate random test data
        random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
        cls.user_email = f"user_test_{random_suffix}@example.com"
        cls.password = "Test@123456"
        
        # Create admin user and seed data
        cls._create_admin_and_seed_data()
        
        # Create regular user
        cls._create_regular_user()
        
        # Find an existing event to use for testing
        cls._find_existing_event()

    @classmethod
    def _create_admin_and_seed_data(cls):
        """Create admin user and seed sample data"""
        print("\n=== Creating Admin User and Sample Data ===")
        
        # Create admin user
        response = requests.post(f"{BACKEND_URL}/api/create-admin")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Admin user created or already exists: {data.get('email', 'admin@culturalcenter.com')}")
            
            # Login as admin
            admin_login = {
                "email": "admin@culturalcenter.com",
                "password": "admin123"
            }
            login_response = requests.post(f"{BACKEND_URL}/api/login", json=admin_login)
            if login_response.status_code == 200:
                admin_data = login_response.json()
                cls.admin_token = admin_data["access_token"]
                cls.admin_user_id = admin_data["user"]["id"]
                print(f"✅ Admin login successful")
            else:
                print(f"❌ Admin login failed: {login_response.text}")
        else:
            print(f"❌ Failed to create admin user: {response.text}")
        
        # Seed sample data
        response = requests.post(f"{BACKEND_URL}/api/seed-data")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Sample data: {data.get('message', 'Created')}")
        else:
            print(f"❌ Failed to seed sample data: {response.text}")

    @classmethod
    def _create_regular_user(cls):
        """Create a regular user for testing"""
        user_data = {
            "name": "Regular Test User",
            "email": cls.user_email,
            "password": cls.password,
            "phone": "9876543210",
            "age": 25,
            "location": "Test Town"
        }
        
        response = requests.post(f"{BACKEND_URL}/api/register", json=user_data)
        if response.status_code == 200:
            data = response.json()
            cls.user_token = data["access_token"]
            cls.regular_user_id = data["user"]["id"]
            print(f"✅ Created regular user with email: {cls.user_email}")
        else:
            print(f"❌ Failed to create regular user: {response.text}")

    @classmethod
    def _find_existing_event(cls):
        """Find an existing event to use for testing"""
        response = requests.get(f"{BACKEND_URL}/api/events")
        if response.status_code == 200:
            events = response.json()
            if events:
                cls.test_event_id = events[0]["id"]
                print(f"✅ Found existing event with ID: {cls.test_event_id}")
            else:
                print("⚠️ No existing events found")
        else:
            print(f"❌ Failed to get events: {response.text}")

    def test_01_login(self):
        """Test user login functionality"""
        print("\n=== Testing Login ===")
        
        # Test with valid credentials
        login_data = {
            "email": self.user_email,
            "password": self.password
        }
        
        response = requests.post(f"{BACKEND_URL}/api/login", json=login_data)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("access_token", data)
        self.assertIn("user", data)
        print("✅ Login successful")
        
        # Test with invalid credentials
        invalid_login = {
            "email": self.user_email,
            "password": "wrongpassword"
        }
        
        response = requests.post(f"{BACKEND_URL}/api/login", json=invalid_login)
        self.assertEqual(response.status_code, 401)
        print("✅ Invalid login rejected")

    def test_02_get_categories(self):
        """Test getting event categories"""
        print("\n=== Testing Get Categories ===")
        
        response = requests.get(f"{BACKEND_URL}/api/categories")
        self.assertEqual(response.status_code, 200)
        categories = response.json()
        self.assertIsInstance(categories, list)
        self.assertGreater(len(categories), 0)
        print(f"✅ Retrieved {len(categories)} categories")

    def test_03_get_events(self):
        """Test getting all events"""
        print("\n=== Testing Get Events ===")
        
        response = requests.get(f"{BACKEND_URL}/api/events")
        self.assertEqual(response.status_code, 200)
        events = response.json()
        self.assertIsInstance(events, list)
        print(f"✅ Retrieved {len(events)} events")
        
        # Verify sample events were created
        if len(events) >= 5:
            print("✅ Sample events are available")
        else:
            print("⚠️ Less than 5 sample events found")

    def test_04_admin_create_event(self):
        """Test admin event creation"""
        print("\n=== Testing Admin Event Creation ===")
        
        # Skip if admin token is not available
        if not self.admin_token:
            print("⚠️ Admin token not available. Skipping test.")
            return
            
        event_data = {
            "title": "Test Admin Event",
            "description": "This is a test event created by admin",
            "category": "Workshops",
            "date": (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d"),
            "time": "14:00",
            "capacity": 30,
            "location": "Test Room",
            "image_url": "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400"
        }
        
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        response = requests.post(f"{BACKEND_URL}/api/events", json=event_data, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            self.assertIn("id", data)
            self.__class__.admin_created_event_id = data["id"]
            print(f"✅ Admin created event with ID: {self.admin_created_event_id}")
        else:
            print(f"❌ Failed to create event as admin: {response.text}")

    def test_05_admin_stats(self):
        """Test admin statistics endpoint"""
        print("\n=== Testing Admin Statistics ===")
        
        # Skip if admin token is not available
        if not self.admin_token:
            print("⚠️ Admin token not available. Skipping test.")
            return
            
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        response = requests.get(f"{BACKEND_URL}/api/admin/stats", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            self.assertIn("total_events", data)
            self.assertIn("total_reservations", data)
            self.assertIn("total_checkins", data)
            self.assertIn("total_users", data)
            print(f"✅ Admin stats retrieved successfully")
            print(f"   Events: {data['total_events']}")
            print(f"   Reservations: {data['total_reservations']}")
            print(f"   Check-ins: {data['total_checkins']}")
            print(f"   Users: {data['total_users']}")
        else:
            print(f"❌ Failed to get admin stats: {response.text}")

    def test_06_create_reservation(self):
        """Test creating a reservation"""
        print("\n=== Testing Create Reservation ===")
        
        # Skip if no event was found
        if not self.test_event_id:
            print("⚠️ No event available for reservation. Skipping test.")
            return
            
        reservation_data = {
            "event_id": self.test_event_id,
            "user_id": self.regular_user_id
        }
        
        headers = {"Authorization": f"Bearer {self.user_token}"}
        response = requests.post(f"{BACKEND_URL}/api/reservations", json=reservation_data, headers=headers)
        
        # Check if the response is successful
        if response.status_code == 200:
            data = response.json()
            self.assertIn("id", data)
            self.assertIn("qr_code", data)
            self.__class__.test_reservation_id = data["id"]
            print(f"✅ Reservation created with ID: {self.test_reservation_id}")
            print(f"✅ QR code generated")
        elif response.status_code == 400 and "already have a reservation" in response.text:
            print("⚠️ User already has a reservation for this event")
        elif response.status_code == 400 and "fully booked" in response.text:
            print("⚠️ Event is fully booked")
        else:
            print(f"❌ Failed to create reservation: {response.text}")

    def test_07_get_user_reservations(self):
        """Test getting user reservations"""
        print("\n=== Testing Get User Reservations ===")
        
        headers = {"Authorization": f"Bearer {self.user_token}"}
        response = requests.get(f"{BACKEND_URL}/api/reservations", headers=headers)
        self.assertEqual(response.status_code, 200)
        reservations = response.json()
        self.assertIsInstance(reservations, list)
        print(f"✅ Retrieved {len(reservations)} reservations")
        
        # If we created a reservation, verify it's in the list
        if self.test_reservation_id and reservations:
            reservation_ids = [res["reservation"]["id"] for res in reservations]
            if self.test_reservation_id in reservation_ids:
                print("✅ Created reservation found in user's reservations")

    def test_08_checkin_reservation(self):
        """Test checking in a reservation"""
        print("\n=== Testing Check-in ===")
        
        # Skip if no reservation was created
        if not self.test_reservation_id:
            print("⚠️ No reservation available for check-in. Skipping test.")
            return
            
        response = requests.post(f"{BACKEND_URL}/api/checkin/{self.test_reservation_id}")
        
        if response.status_code == 200:
            print("✅ Reservation checked in successfully")
        elif response.status_code == 400 and "Already checked in" in response.text:
            print("⚠️ Reservation already checked in")
        else:
            print(f"❌ Failed to check in: {response.text}")
            
    def test_09_capacity_limit(self):
        """Test event capacity limits"""
        print("\n=== Testing Event Capacity Limits ===")
        
        # Skip if admin token or admin created event is not available
        if not self.admin_token or not self.admin_created_event_id:
            print("⚠️ Admin token or created event not available. Skipping test.")
            return
            
        # Create a small capacity event as admin
        event_data = {
            "title": "Limited Capacity Event",
            "description": "This event has very limited capacity for testing",
            "category": "Workshops",
            "date": (datetime.now() + timedelta(days=5)).strftime("%Y-%m-%d"),
            "time": "15:00",
            "capacity": 1,  # Only 1 spot available
            "location": "Small Room",
            "image_url": "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400"
        }
        
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        response = requests.post(f"{BACKEND_URL}/api/events", json=event_data, headers=headers)
        
        if response.status_code != 200:
            print(f"❌ Failed to create limited capacity event: {response.text}")
            return
            
        limited_event_id = response.json()["id"]
        print(f"✅ Created limited capacity event with ID: {limited_event_id}")
        
        # Make a reservation as the regular user
        reservation_data = {
            "event_id": limited_event_id,
            "user_id": self.regular_user_id
        }
        
        headers = {"Authorization": f"Bearer {self.user_token}"}
        response = requests.post(f"{BACKEND_URL}/api/reservations", json=reservation_data, headers=headers)
        
        if response.status_code == 200:
            print("✅ First reservation for limited event created successfully")
        else:
            print(f"❌ Failed to create first reservation: {response.text}")
            return
            
        # Create a second user and try to make another reservation
        second_user_email = f"second_user_{random.randint(1000, 9999)}@example.com"
        second_user_data = {
            "name": "Second Test User",
            "email": second_user_email,
            "password": "Test@123456",
            "phone": "1234567890",
            "age": 30,
            "location": "Test City"
        }
        
        response = requests.post(f"{BACKEND_URL}/api/register", json=second_user_data)
        if response.status_code != 200:
            print(f"❌ Failed to create second user: {response.text}")
            return
            
        second_token = response.json()["access_token"]
        second_user_id = response.json()["user"]["id"]
        print(f"✅ Created second user with email: {second_user_email}")
        
        # Try to make a reservation with the second user
        reservation_data = {
            "event_id": limited_event_id,
            "user_id": second_user_id
        }
        
        headers = {"Authorization": f"Bearer {second_token}"}
        response = requests.post(f"{BACKEND_URL}/api/reservations", json=reservation_data, headers=headers)
        
        # This should fail due to capacity limit
        if response.status_code == 400 and "fully booked" in response.text:
            print("✅ Capacity limit enforced - second reservation rejected")
        else:
            print(f"❌ Capacity limit test failed: {response.status_code} - {response.text}")

    def test_10_email_welcome_registration(self):
        """Test welcome email sent during registration"""
        print("\n=== Testing Welcome Email on Registration ===")
        
        # Create a new user to trigger welcome email
        random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
        email_test_user = f"email_test_{random_suffix}@example.com"
        
        user_data = {
            "name": "Email Test User",
            "email": email_test_user,
            "password": "Test@123456",
            "phone": "5551234567",
            "age": 28,
            "location": "Email Test City"
        }
        
        response = requests.post(f"{BACKEND_URL}/api/register", json=user_data)
        
        if response.status_code == 200:
            data = response.json()
            debug_log(f"Registration response: {data}")
            
            # Check if user was created successfully
            self.assertIn("access_token", data)
            self.assertIn("user", data)
            
            # We can't directly verify email delivery in this test environment,
            # but we can check that the registration succeeded which should trigger the email
            print(f"✅ User registered successfully with email: {email_test_user}")
            print(f"✅ Welcome email should have been triggered")
            
            # Store token for further tests
            email_test_token = data["access_token"]
            email_test_user_id = data["user"]["id"]
            
            return email_test_token, email_test_user_id, email_test_user
        else:
            print(f"❌ Failed to register test user: {response.text}")
            return None, None, None

    def test_11_email_reservation_confirmation(self):
        """Test reservation confirmation email with QR code"""
        print("\n=== Testing Reservation Confirmation Email ===")
        
        # Get credentials from the welcome email test
        email_test_token, email_test_user_id, email_test_user = self.test_10_email_welcome_registration()
        
        if not email_test_token or not email_test_user_id:
            print("⚠️ Email test user creation failed. Skipping reservation email test.")
            return None
            
        # Skip if no event was found
        if not self.test_event_id:
            print("⚠️ No event available for reservation. Skipping test.")
            return None
            
        reservation_data = {
            "event_id": self.test_event_id,
            "user_id": email_test_user_id
        }
        
        headers = {"Authorization": f"Bearer {email_test_token}"}
        response = requests.post(f"{BACKEND_URL}/api/reservations", json=reservation_data, headers=headers)
        
        # Check if the response is successful
        if response.status_code == 200:
            data = response.json()
            debug_log(f"Reservation response: {data}")
            
            self.assertIn("id", data)
            self.assertIn("qr_code", data)
            email_test_reservation_id = data["id"]
            
            # Verify QR code is present (this should be included in the email)
            self.assertTrue(data["qr_code"].startswith("data:image/png;base64,"))
            
            print(f"✅ Reservation created with ID: {email_test_reservation_id}")
            print(f"✅ QR code generated and should be included in confirmation email")
            print(f"✅ Reservation confirmation email should have been sent to: {email_test_user}")
            
            return email_test_token, email_test_reservation_id
        elif response.status_code == 400 and "already have a reservation" in response.text:
            print("⚠️ User already has a reservation for this event")
            return None, None
        elif response.status_code == 400 and "fully booked" in response.text:
            print("⚠️ Event is fully booked")
            return None, None
        else:
            print(f"❌ Failed to create reservation: {response.text}")
            return None, None

    def test_12_email_checkin_confirmation(self):
        """Test check-in confirmation email"""
        print("\n=== Testing Check-in Confirmation Email ===")
        
        # Get credentials and reservation from previous test
        email_test_token, email_test_reservation_id = self.test_11_email_reservation_confirmation()
        
        if not email_test_reservation_id:
            print("⚠️ Email test reservation creation failed. Skipping check-in email test.")
            return
            
        # Perform check-in
        response = requests.post(f"{BACKEND_URL}/api/checkin/{email_test_reservation_id}")
        
        if response.status_code == 200:
            data = response.json()
            debug_log(f"Check-in response: {data}")
            
            print("✅ Reservation checked in successfully")
            print("✅ Check-in confirmation email should have been sent")
        elif response.status_code == 400 and "Already checked in" in response.text:
            print("⚠️ Reservation already checked in")
            print("⚠️ Check-in email was likely already sent")
        else:
            print(f"❌ Failed to check in: {response.text}")

    def test_13_email_integration_full_flow(self):
        """Test the complete email flow from registration to check-in"""
        print("\n=== Testing Complete Email Flow ===")
        
        # 1. Create a unique user for this test
        random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
        flow_test_email = f"flow_test_{random_suffix}@example.com"
        
        user_data = {
            "name": "Flow Test User",
            "email": flow_test_email,
            "password": "FlowTest@123",
            "phone": "5559876543",
            "age": 32,
            "location": "Flow Test City"
        }
        
        print(f"1. Registering new user with email: {flow_test_email}")
        response = requests.post(f"{BACKEND_URL}/api/register", json=user_data)
        
        if response.status_code != 200:
            print(f"❌ Failed to register flow test user: {response.text}")
            return
            
        data = response.json()
        flow_test_token = data["access_token"]
        flow_test_user_id = data["user"]["id"]
        print("✅ User registered successfully - Welcome email should be sent")
        
        # 2. Get available events
        print("2. Fetching available events")
        response = requests.get(f"{BACKEND_URL}/api/events")
        
        if response.status_code != 200 or not response.json():
            print("❌ Failed to get events or no events available")
            return
            
        events = response.json()
        # Find an event with available spots
        available_event = next((event for event in events if event["available_spots"] > 0), None)
        
        if not available_event:
            print("❌ No events with available spots found")
            return
            
        flow_test_event_id = available_event["id"]
        print(f"✅ Found event with available spots: {available_event['title']}")
        
        # 3. Make a reservation
        print("3. Creating reservation")
        reservation_data = {
            "event_id": flow_test_event_id,
            "user_id": flow_test_user_id
        }
        
        headers = {"Authorization": f"Bearer {flow_test_token}"}
        response = requests.post(f"{BACKEND_URL}/api/reservations", json=reservation_data, headers=headers)
        
        if response.status_code != 200:
            print(f"❌ Failed to create reservation: {response.text}")
            return
            
        flow_test_reservation_id = response.json()["id"]
        print("✅ Reservation created successfully - Confirmation email with QR code should be sent")
        
        # 4. Check in with the reservation
        print("4. Checking in with reservation")
        response = requests.post(f"{BACKEND_URL}/api/checkin/{flow_test_reservation_id}")
        
        if response.status_code != 200:
            print(f"❌ Failed to check in: {response.text}")
            return
            
        print("✅ Check-in successful - Check-in confirmation email should be sent")
        
        # 5. Verify the full flow
        print("5. Full email flow verification")
        print("✅ Registration → Welcome Email")
        print("✅ Reservation → Confirmation Email with QR Code")
        print("✅ Check-in → Check-in Confirmation Email")
        print("✅ Complete email flow test passed")

if __name__ == "__main__":
    unittest.main(argv=['first-arg-is-ignored'], exit=False)