"""
User-related Pydantic models
"""

from typing import Optional, List
from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    """Model for user registration"""
    name: str
    email: EmailStr
    password: str
    phone: str
    age: int
    location: str


class UserLogin(BaseModel):
    """Model for user login"""
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    """Model for user updates"""
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    age: Optional[int] = None
    location: Optional[str] = None
    is_admin: Optional[bool] = None


class User(BaseModel):
    """User response model"""
    id: str
    name: str
    email: str
    phone: str
    age: int
    location: str
    is_admin: bool = False
    created_at: Optional[str] = None


class BulkUserAction(BaseModel):
    """Model for bulk user actions"""
    user_ids: List[str]
    action: str  # "delete", "activate", "deactivate", "make_admin", "remove_admin"


class BulkImportResult(BaseModel):
    """Result model for bulk user import"""
    total_processed: int
    successful_imports: int
    failed_imports: int
    duplicate_emails: int
    errors: List[dict]
    imported_users: List[dict]


class PasswordReset(BaseModel):
    """Model for password reset request"""
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    """Model for password reset confirmation"""
    token: str
    new_password: str


class UserProfile(BaseModel):
    """Extended user profile model"""
    id: str
    name: str
    email: str
    phone: str
    age: int
    location: str
    is_admin: bool
    created_at: str
    last_login: Optional[str] = None
    total_reservations: Optional[int] = 0
    total_checkins: Optional[int] = 0
