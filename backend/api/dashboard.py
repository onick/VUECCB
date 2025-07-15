"""
Dashboard API endpoints
"""

from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime, timedelta
from typing import Dict, Any

from models.common import SuccessResponse, DashboardStats
from core.security import get_admin_user
from core.database import database

router = APIRouter()


@router.get("/dashboard/stats", response_model=SuccessResponse)
async def get_dashboard_stats(admin_user: dict = Depends(get_admin_user)):
    """Get comprehensive dashboard statistics (Admin only)"""
    try:
        # Get current date references
        now = datetime.utcnow()
        today = now.date().isoformat()
        this_month_start = now.replace(day=1).isoformat()
        
        # Total counts
        total_users = database.users.count_documents({"deleted": {"$ne": True}})
        total_events = database.events.count_documents({})
        total_reservations = database.reservations.count_documents({"status": {"$ne": "cancelled"}})
        total_checkins = database.checkins.count_documents({})
        
        # Today's counts
        users_today = database.users.count_documents({
            "created_at": {"$regex": f"^{today}"},
            "deleted": {"$ne": True}
        })
        
        reservations_today = database.reservations.count_documents({
            "created_at": {"$regex": f"^{today}"},
            "status": {"$ne": "cancelled"}
        })
        
        checkins_today = database.checkins.count_documents({
            "timestamp": {"$regex": f"^{today}"}
        })
        
        # This month's events
        events_this_month = database.events.count_documents({
            "created_at": {"$gte": this_month_start}
        })
        
        # Calculate revenue
        revenue_today_pipeline = [
            {
                "$match": {
                    "created_at": {"$regex": f"^{today}"},
                    "status": {"$ne": "cancelled"}
                }
            },
            {
                "$lookup": {
                    "from": "events",
                    "localField": "event_id",
                    "foreignField": "id",
                    "as": "event"
                }
            },
            {"$unwind": "$event"},
            {
                "$group": {
                    "_id": None,
                    "total": {"$sum": {"$ifNull": ["$event.price", 0]}}
                }
            }
        ]
        
        revenue_month_pipeline = [
            {
                "$match": {
                    "created_at": {"$gte": this_month_start},
                    "status": {"$ne": "cancelled"}
                }
            },
            {
                "$lookup": {
                    "from": "events",
                    "localField": "event_id",
                    "foreignField": "id",
                    "as": "event"
                }
            },
            {"$unwind": "$event"},
            {
                "$group": {
                    "_id": None,
                    "total": {"$sum": {"$ifNull": ["$event.price", 0]}}
                }
            }
        ]
        
        revenue_today_result = list(database.reservations.aggregate(revenue_today_pipeline))
        revenue_month_result = list(database.reservations.aggregate(revenue_month_pipeline))
        
        revenue_today = revenue_today_result[0]["total"] if revenue_today_result else 0
        revenue_this_month = revenue_month_result[0]["total"] if revenue_month_result else 0
        
        # Calculate check-in rate
        checkin_rate = 0.0
        if total_reservations > 0:
            checked_in_count = database.reservations.count_documents({"status": "checked_in"})
            checkin_rate = (checked_in_count / total_reservations) * 100
        
        # Popular events (top 5 by reservations)
        popular_events_pipeline = [
            {
                "$match": {"status": {"$ne": "cancelled"}}
            },
            {
                "$group": {
                    "_id": "$event_id",
                    "reservation_count": {"$sum": 1}
                }
            },
            {
                "$lookup": {
                    "from": "events",
                    "localField": "_id",
                    "foreignField": "id",
                    "as": "event"
                }
            },
            {"$unwind": "$event"},
            {
                "$project": {
                    "event_id": "$_id",
                    "event_title": "$event.title",
                    "event_category": "$event.category",
                    "event_date": "$event.date",
                    "reservation_count": 1,
                    "capacity": "$event.capacity"
                }
            },
            {"$sort": {"reservation_count": -1}},
            {"$limit": 5}
        ]
        
        popular_events = list(database.reservations.aggregate(popular_events_pipeline))
        
        # Recent activity (last 10 activities)
        recent_activity = []
        
        # Recent users
        recent_users = list(database.users.find(
            {"deleted": {"$ne": True}},
            {"name": 1, "email": 1, "created_at": 1}
        ).sort("created_at", -1).limit(3))
        
        for user in recent_users:
            recent_activity.append({
                "type": "user_registration",
                "message": f"New user registered: {user['name']}",
                "timestamp": user["created_at"],
                "icon": "user-plus"
            })
        
        # Recent reservations
        recent_reservations = list(database.reservations.aggregate([
            {"$match": {"status": {"$ne": "cancelled"}}},
            {
                "$lookup": {
                    "from": "users",
                    "localField": "user_id",
                    "foreignField": "id",
                    "as": "user"
                }
            },
            {"$unwind": "$user"},
            {
                "$lookup": {
                    "from": "events",
                    "localField": "event_id",
                    "foreignField": "id",
                    "as": "event"
                }
            },
            {"$unwind": "$event"},
            {
                "$project": {
                    "user_name": "$user.name",
                    "event_title": "$event.title",
                    "created_at": 1,
                    "status": 1
                }
            },
            {"$sort": {"created_at": -1}},
            {"$limit": 3}
        ]))
        
        for reservation in recent_reservations:
            icon = "check-circle" if reservation["status"] == "checked_in" else "calendar"
            recent_activity.append({
                "type": "reservation",
                "message": f"{reservation['user_name']} reserved '{reservation['event_title']}'",
                "timestamp": reservation["created_at"],
                "icon": icon
            })
        
        # Recent events
        recent_events = list(database.events.find(
            {},
            {"title": 1, "category": 1, "created_at": 1}
        ).sort("created_at", -1).limit(2))
        
        for event in recent_events:
            recent_activity.append({
                "type": "event_created",
                "message": f"New event created: {event['title']}",
                "timestamp": event["created_at"],
                "icon": "calendar-plus"
            })
        
        # Sort recent activity by timestamp
        recent_activity.sort(key=lambda x: x["timestamp"], reverse=True)
        recent_activity = recent_activity[:10]  # Keep only top 10
        
        # Create dashboard stats object
        stats = DashboardStats(
            total_users=total_users,
            total_events=total_events,
            total_reservations=total_reservations,
            total_checkins=total_checkins,
            users_today=users_today,
            events_this_month=events_this_month,
            reservations_today=reservations_today,
            checkins_today=checkins_today,
            revenue_today=revenue_today,
            revenue_this_month=revenue_this_month,
            checkin_rate=round(checkin_rate, 1),
            popular_events=popular_events,
            recent_activity=recent_activity
        )
        
        return SuccessResponse(
            message="Dashboard statistics retrieved successfully",
            data=stats.dict()
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve dashboard statistics"
        )


@router.get("/dashboard/quick-stats")
async def get_quick_stats(admin_user: dict = Depends(get_admin_user)):
    """Get quick stats for dashboard widgets (Admin only)"""
    try:
        today = datetime.utcnow().date().isoformat()
        
        # Quick counts
        stats = {
            "users": {
                "total": database.users.count_documents({"deleted": {"$ne": True}}),
                "today": database.users.count_documents({
                    "created_at": {"$regex": f"^{today}"},
                    "deleted": {"$ne": True}
                })
            },
            "events": {
                "total": database.events.count_documents({}),
                "published": database.events.count_documents({"published": True})
            },
            "reservations": {
                "total": database.reservations.count_documents({"status": {"$ne": "cancelled"}}),
                "today": database.reservations.count_documents({
                    "created_at": {"$regex": f"^{today}"},
                    "status": {"$ne": "cancelled"}
                })
            },
            "checkins": {
                "total": database.checkins.count_documents({}),
                "today": database.checkins.count_documents({
                    "timestamp": {"$regex": f"^{today}"}
                })
            }
        }
        
        return SuccessResponse(
            message="Quick statistics retrieved successfully",
            data=stats
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve quick statistics"
        )


@router.get("/dashboard/system-status")
async def get_system_status(admin_user: dict = Depends(get_admin_user)):
    """Get system status information (Admin only)"""
    try:
        # Database health
        db_health = await database.health_check()
        
        # Basic system info
        system_status = {
            "database": db_health,
            "api_version": "2.0.0",
            "status": "healthy" if db_health.get("status") == "connected" else "unhealthy",
            "timestamp": database.get_current_timestamp(),
            "environment": "development",  # This could come from settings
            "features": {
                "analytics": True,
                "email_notifications": True,
                "qr_codes": True,
                "bulk_operations": True
            }
        }
        
        return SuccessResponse(
            message="System status retrieved successfully",
            data=system_status
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve system status"
        )


@router.get("/dashboard/activity-feed")
async def get_activity_feed(
    limit: int = 20,
    admin_user: dict = Depends(get_admin_user)
):
    """Get real-time activity feed (Admin only)"""
    try:
        activities = []
        
        # Recent check-ins
        recent_checkins = list(database.checkins.aggregate([
            {
                "$lookup": {
                    "from": "users",
                    "localField": "user_id",
                    "foreignField": "id",
                    "as": "user"
                }
            },
            {"$unwind": "$user"},
            {
                "$lookup": {
                    "from": "events",
                    "localField": "event_id",
                    "foreignField": "id",
                    "as": "event"
                }
            },
            {"$unwind": "$event"},
            {
                "$project": {
                    "type": {"$literal": "checkin"},
                    "message": {
                        "$concat": [
                            "$user.name",
                            " checked in to ",
                            "$event.title"
                        ]
                    },
                    "timestamp": 1,
                    "user_name": "$user.name",
                    "event_title": "$event.title",
                    "method": 1
                }
            },
            {"$sort": {"timestamp": -1}},
            {"$limit": limit // 2}
        ]))
        
        activities.extend(recent_checkins)
        
        # Recent reservations
        recent_reservations = list(database.reservations.aggregate([
            {"$match": {"status": {"$ne": "cancelled"}}},
            {
                "$lookup": {
                    "from": "users",
                    "localField": "user_id",
                    "foreignField": "id",
                    "as": "user"
                }
            },
            {"$unwind": "$user"},
            {
                "$lookup": {
                    "from": "events",
                    "localField": "event_id",
                    "foreignField": "id",
                    "as": "event"
                }
            },
            {"$unwind": "$event"},
            {
                "$project": {
                    "type": {"$literal": "reservation"},
                    "message": {
                        "$concat": [
                            "$user.name",
                            " reserved ",
                            "$event.title"
                        ]
                    },
                    "timestamp": "$created_at",
                    "user_name": "$user.name",
                    "event_title": "$event.title",
                    "status": 1
                }
            },
            {"$sort": {"timestamp": -1}},
            {"$limit": limit // 2}
        ]))
        
        activities.extend(recent_reservations)
        
        # Sort all activities by timestamp
        activities.sort(key=lambda x: x["timestamp"], reverse=True)
        activities = activities[:limit]
        
        return SuccessResponse(
            message="Activity feed retrieved successfully",
            data={"activities": activities}
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve activity feed"
        )
