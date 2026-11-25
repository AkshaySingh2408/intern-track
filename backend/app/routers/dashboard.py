from datetime import datetime, timedelta
from typing import List, Dict
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, asc
from app.database import get_db
from app.models.user import User
from app.models.application import Application
from app.models.interview import Interview
from app.schemas.dashboard import (
    DashboardSummary,
    DashboardAnalytics,
    DashboardRecentApplications,
    StatusDistributionItem,
    TimelineItem,
    MonthlyStatItem,
    LocationStatItem,
    WorkModeStatItem,
    DeadlineItem
)
from app.schemas.application import ApplicationResponse
from app.schemas.interview import InterviewResponse
from app.utils.security import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

STATUS_COLORS = {
    "Wishlist": "#64748B",
    "Applied": "#3B82F6",
    "Under Review": "#F59E0B",
    "Online Assessment": "#8B5CF6",
    "Interview": "#06B6D4",
    "Offer": "#10B981",
    "Rejected": "#F43F5E",
    "Withdrawn": "#475569",
}

@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    apps = db.query(Application).filter(Application.user_id == current_user.id).all()
    total = len(apps)

    counts = {
        "Wishlist": 0,
        "Applied": 0,
        "Under Review": 0,
        "Online Assessment": 0,
        "Interview": 0,
        "Offer": 0,
        "Rejected": 0,
        "Withdrawn": 0,
    }

    for app in apps:
        if app.status in counts:
            counts[app.status] += 1
        else:
            counts[app.status] = 1

    interviews_count = counts.get("Interview", 0)
    offers_count = counts.get("Offer", 0)
    active_evaluated = total - counts.get("Wishlist", 0) - counts.get("Withdrawn", 0)

    # Calculate conversion rates
    interview_rate = round((interviews_count / active_evaluated * 100), 1) if active_evaluated > 0 else 0.0
    offer_rate = round((offers_count / active_evaluated * 100), 1) if active_evaluated > 0 else 0.0

    return DashboardSummary(
        total=total,
        wishlist=counts.get("Wishlist", 0),
        applied=counts.get("Applied", 0),
        under_review=counts.get("Under Review", 0),
        online_assessment=counts.get("Online Assessment", 0),
        interview=interviews_count,
        offer=offers_count,
        rejected=counts.get("Rejected", 0),
        withdrawn=counts.get("Withdrawn", 0),
        interview_conversion_rate=interview_rate,
        offer_conversion_rate=offer_rate,
    )

@router.get("/analytics", response_model=DashboardAnalytics)
def get_dashboard_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    apps = db.query(Application).filter(Application.user_id == current_user.id).all()
    interviews = db.query(Interview).filter(Interview.user_id == current_user.id).all()
    total = len(apps)

    # 1. Status distribution
    status_counts: Dict[str, int] = {}
    for app in apps:
        status_counts[app.status] = status_counts.get(app.status, 0) + 1

    status_dist = [
        StatusDistributionItem(
            name=status,
            value=count,
            color=STATUS_COLORS.get(status, "#3B82F6")
        )
        for status, count in status_counts.items() if count > 0
    ]

    # 2. Applications over time (past 30 days)
    now = datetime.utcnow()
    thirty_days_ago = now - timedelta(days=29)
    date_map = {}
    for i in range(30):
        d = (thirty_days_ago + timedelta(days=i)).strftime("%b %d")
        date_map[d] = 0

    for app in apps:
        if app.application_date and app.application_date >= thirty_days_ago:
            d_str = app.application_date.strftime("%b %d")
            if d_str in date_map:
                date_map[d_str] += 1

    timeline = [TimelineItem(date=k, count=v) for k, v in date_map.items()]

    # 3. Monthly stats (last 6 months)
    monthly_data: Dict[str, Dict[str, int]] = {}
    for i in range(5, -1, -1):
        # Month calculation
        year = now.year
        month = now.month - i
        while month <= 0:
            month += 12
            year -= 1
        m_key = f"{year}-{month:02d}"
        m_label = datetime(year, month, 1).strftime("%b %Y")
        monthly_data[m_key] = {"label": m_label, "apps": 0, "interviews": 0, "offers": 0}

    for app in apps:
        if app.application_date:
            key = app.application_date.strftime("%Y-%m")
            if key in monthly_data:
                monthly_data[key]["apps"] += 1
                if app.status == "Offer":
                    monthly_data[key]["offers"] += 1

    for inv in interviews:
        if inv.interview_date:
            key = inv.interview_date.strftime("%Y-%m")
            if key in monthly_data:
                monthly_data[key]["interviews"] += 1

    monthly_stats = [
        MonthlyStatItem(
            month=val["label"],
            applications=val["apps"],
            interviews=val["interviews"],
            offers=val["offers"]
        )
        for val in monthly_data.values()
    ]

    # 4. Applications by location
    location_counts: Dict[str, int] = {}
    for app in apps:
        loc = app.location.strip() if app.location else "Not Specified"
        location_counts[loc] = location_counts.get(loc, 0) + 1
    
    sorted_locations = sorted(location_counts.items(), key=lambda x: x[1], reverse=True)[:6]
    location_stats = [LocationStatItem(name=k, value=v) for k, v in sorted_locations]

    # 5. Work mode
    work_modes: Dict[str, int] = {"Remote": 0, "Hybrid": 0, "On-site": 0}
    for app in apps:
        mode = app.work_mode or "Remote"
        work_modes[mode] = work_modes.get(mode, 0) + 1
    work_mode_stats = [WorkModeStatItem(name=k, value=v) for k, v in work_modes.items() if v > 0]

    # Metrics
    total_interviews = len(interviews)
    total_offers = sum(1 for app in apps if app.status == "Offer")
    interview_rate = round((total_interviews / total * 100), 1) if total > 0 else 0.0
    offer_rate = round((total_offers / total * 100), 1) if total > 0 else 0.0

    # Smart insights
    insights = []
    if total == 0:
        insights.append("Start by logging your first internship application using the 'Quick Add' button.")
    else:
        if offer_rate > 10.0:
            insights.append(f"Outstanding performance! Your offer rate is {offer_rate}%, which is well above the industry average.")
        elif interview_rate > 20.0:
            insights.append(f"Strong resume response! Your interview rate is {interview_rate}%. Focus on behavioral and technical prep.")
        else:
            insights.append("Keep applying consistently. The average candidate submits 40-70 applications before landing multiple offers.")

        most_common_loc = sorted_locations[0][0] if sorted_locations else None
        if most_common_loc and most_common_loc != "Not Specified":
            insights.append(f"Your primary target location is {most_common_loc}. Keep tailoring your resume to local market requirements.")

        pending_oas = sum(1 for a in apps if a.status == "Online Assessment")
        if pending_oas > 0:
            insights.append(f"You have {pending_oas} active Online Assessments pending. Schedule dedicated time blocks to complete them before deadlines.")

    return DashboardAnalytics(
        status_distribution=status_dist,
        applications_over_time=timeline,
        monthly_stats=monthly_stats,
        location_stats=location_stats,
        work_mode_stats=work_mode_stats,
        interview_conversion_rate=interview_rate,
        offer_conversion_rate=offer_rate,
        total_applications=total,
        total_interviews=total_interviews,
        total_offers=total_offers,
        insights=insights
    )

@router.get("/recent-applications", response_model=DashboardRecentApplications)
def get_dashboard_recent(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 5 recent applications
    recent = db.query(Application).filter(
        Application.user_id == current_user.id
    ).order_by(desc(Application.application_date)).limit(5).all()

    # Upcoming interviews
    now = datetime.utcnow()
    upcoming_invs = db.query(Interview).filter(
        Interview.user_id == current_user.id,
        Interview.interview_date >= now - timedelta(hours=2),
        Interview.status == "Scheduled"
    ).order_by(asc(Interview.interview_date)).limit(5).all()

    inv_responses = []
    for inv in upcoming_invs:
        app = db.query(Application).filter(Application.id == inv.application_id).first()
        res = InterviewResponse.model_validate(inv)
        if app:
            res.company_name = app.company_name
            res.job_title = app.job_title
        inv_responses.append(res)

    # Upcoming deadlines
    deadlines = db.query(Application).filter(
        Application.user_id == current_user.id,
        Application.deadline.isnot(None),
        Application.deadline >= now - timedelta(days=1)
    ).order_by(asc(Application.deadline)).limit(5).all()

    deadline_items = [
        DeadlineItem(
            id=app.id,
            company_name=app.company_name,
            job_title=app.job_title,
            deadline=app.deadline.isoformat(),
            status=app.status
        )
        for app in deadlines
    ]

    return DashboardRecentApplications(
        recent_applications=[ApplicationResponse.model_validate(app) for app in recent],
        upcoming_interviews=inv_responses,
        upcoming_deadlines=deadline_items
    )
