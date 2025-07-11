"""
Configuration module for the Cultural Center application.
Centralizes all configuration settings and environment variables.
"""

import os
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Settings:
    """Application settings loaded from environment variables."""
    
    # Application
    APP_NAME: str = "Cultural Center API"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    PORT: int = int(os.getenv("PORT", "8001"))
    
    # Database
    MONGO_URL: str = os.getenv("MONGO_URL", "mongodb://localhost:27017/")
    DATABASE_NAME: str = "cultural_center"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # SendGrid Email Configuration
    SENDGRID_API_KEY: Optional[str] = os.getenv("SENDGRID_API_KEY")
    SENDGRID_FROM_EMAIL: str = os.getenv("SENDGRID_FROM_EMAIL", "noreply@culturalcenter.com")
    
    # Frontend URLs (for CORS)
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://culturalcenter.com",
    ]
    
    # Analytics Configuration
    ANALYTICS_ENABLED: bool = os.getenv("ANALYTICS_ENABLED", "True").lower() == "true"
    ANALYTICS_BATCH_SIZE: int = int(os.getenv("ANALYTICS_BATCH_SIZE", "100"))
    ANALYTICS_FLUSH_INTERVAL: int = int(os.getenv("ANALYTICS_FLUSH_INTERVAL", "60"))
    
    # Application Limits
    MAX_UPLOAD_SIZE_MB: int = int(os.getenv("MAX_UPLOAD_SIZE_MB", "10"))
    MAX_USERS_PER_IMPORT: int = int(os.getenv("MAX_USERS_PER_IMPORT", "1000"))
    MAX_RESERVATIONS_PER_USER: int = int(os.getenv("MAX_RESERVATIONS_PER_USER", "10"))
    
    # QR Code Configuration
    QR_CODE_VERSION: int = int(os.getenv("QR_CODE_VERSION", "1"))
    QR_CODE_BOX_SIZE: int = int(os.getenv("QR_CODE_BOX_SIZE", "12"))
    QR_CODE_BORDER: int = int(os.getenv("QR_CODE_BORDER", "4"))
    
    # Event Categories
    EVENT_CATEGORIES: list = [
        "Dominican Cinema",
        "Classic Cinema", 
        "General Cinema",
        "Workshops",
        "Concerts",
        "Talks/Conferences",
        "Art Exhibitions",
        "3D Immersive Experiences"
    ]
    
    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = int(os.getenv("RATE_LIMIT_REQUESTS", "100"))
    RATE_LIMIT_PERIOD: int = int(os.getenv("RATE_LIMIT_PERIOD", "60"))  # seconds
    
    def __init__(self):
        """Initialize settings and validate configuration."""
        self._validate_settings()
    
    def _validate_settings(self):
        """Validate critical settings."""
        if self.ENVIRONMENT == "production":
            if self.SECRET_KEY == "your-secret-key-change-in-production":
                raise ValueError("SECRET_KEY must be changed for production!")
            if not self.SENDGRID_API_KEY:
                raise ValueError("SENDGRID_API_KEY is required for production!")
            if self.DEBUG:
                raise ValueError("DEBUG must be False in production!")
    
    @property
    def is_development(self) -> bool:
        """Check if running in development mode."""
        return self.ENVIRONMENT == "development"
    
    @property
    def is_production(self) -> bool:
        """Check if running in production mode."""
        return self.ENVIRONMENT == "production"
    
    @property
    def is_testing(self) -> bool:
        """Check if running in testing mode."""
        return self.ENVIRONMENT == "testing"
    
    def get_mongo_url(self) -> str:
        """Get MongoDB connection URL."""
        return self.MONGO_URL
    
    def get_cors_origins(self) -> list:
        """Get allowed CORS origins based on environment."""
        if self.is_development:
            return ["*"]  # Allow all origins in development
        return self.ALLOWED_ORIGINS


# Create a single instance of settings
settings = Settings()


# Export commonly used values
APP_NAME = settings.APP_NAME
APP_VERSION = settings.APP_VERSION
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
DATABASE_NAME = settings.DATABASE_NAME