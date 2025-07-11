"""
Database connection and management module.
"""

from pymongo import MongoClient
from pymongo.database import Database
from pymongo.errors import ConnectionFailure
import logging
from typing import Optional

from .config import settings

logger = logging.getLogger(__name__)


class DatabaseManager:
    """Manages MongoDB connection and database operations."""
    
    def __init__(self):
        self._client: Optional[MongoClient] = None
        self._db: Optional[Database] = None
    
    def connect(self) -> Database:
        """
        Establish connection to MongoDB.
        Returns the database instance.
        """
        try:
            if not self._client:
                self._client = MongoClient(settings.get_mongo_url())
                # Test the connection
                self._client.admin.command('ping')
                logger.info(f"Successfully connected to MongoDB at {settings.MONGO_URL}")
            
            if not self._db:
                self._db = self._client[settings.DATABASE_NAME]
                self._create_indexes()
            
            return self._db
            
        except ConnectionFailure as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise
    
    def _create_indexes(self):
        """Create database indexes for better performance."""
        try:
            # Users collection indexes
            self._db.users.create_index("email", unique=True)
            self._db.users.create_index("created_at")
            self._db.users.create_index("is_admin")
            self._db.users.create_index("deleted")
            self._db.users.create_index("location")
            self._db.users.create_index("age")
            self._db.users.create_index([("name", "text"), ("email", "text"), ("location", "text")])
            
            # Reservations collection indexes
            self._db.reservations.create_index("user_id")
            self._db.reservations.create_index("event_id")
            self._db.reservations.create_index("created_at")
            self._db.reservations.create_index("status")
            self._db.reservations.create_index("checkin_code", unique=True, sparse=True)
            
            # Events collection indexes
            self._db.events.create_index("date")
            self._db.events.create_index("category")
            self._db.events.create_index("created_at")
            self._db.events.create_index([("title", "text"), ("description", "text")])
            
            logger.info("Database indexes created successfully")
        except Exception as e:
            logger.warning(f"Some indexes may already exist: {e}")
    
    def disconnect(self):
        """Close the database connection."""
        if self._client:
            self._client.close()
            self._client = None
            self._db = None
            logger.info("Disconnected from MongoDB")
    
    def get_database(self) -> Database:
        """Get the database instance, connecting if necessary."""
        if not self._db:
            return self.connect()
        return self._db
    
    def health_check(self) -> bool:
        """Check if the database connection is healthy."""
        try:
            if self._client:
                self._client.admin.command('ping')
                return True
            return False
        except:
            return False


# Create a singleton instance
db_manager = DatabaseManager()

# Convenience function to get database
def get_db() -> Database:
    """Get the database instance."""
    return db_manager.get_database()