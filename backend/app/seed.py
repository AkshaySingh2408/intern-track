from datetime import datetime, timedelta
import logging
from sqlalchemy.orm import Session
from app.database import engine, Base, SessionLocal
from app.models.user import User
from app.models.application import Application
from app.models.interview import Interview
from app.models.reminder import Reminder
from app.models.note import Note
from app.utils.security import get_password_hash

logger = logging.getLogger(__name__)

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        demo_email = "alex.chen@university.edu"
        user = db.query(User).filter(User.email == demo_email).first()

        if not user:
            print(f"Creating demo user: {demo_email}")
            user = User(
                email=demo_email,
                hashed_password=get_password_hash("DemoPass123!"),
                full_name="Alex Chen",
                college="University of California, Berkeley",
                degree="B.S. in Computer Science & Data Science",
                graduation_year=2026,
                target_role="Full Stack / Software Engineering Intern",
                preferred_locations="San Francisco, New York, Seattle, Remote",
                preferred_work_mode="Hybrid"
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        # Check existing applications
        existing_apps = db.query(Application).filter(Application.user_id == user.id).count()
        if existing_apps == 0:
            print("Seeding demo applications, interviews, reminders, and notes...")
            now = datetime.utcnow()

            sample_apps = [
                {
                    "company_name": "Google",
                    "job_title": "Software Engineering Intern - Summer 2026",
                    "job_description": "Join our Core Search & Infrastructure team. Work on distributed systems, high-throughput microservices in C++ and Go, and large-scale data indexing.",
                    "company_website": "https://careers.google.com",
                    "application_url": "https://careers.google.com/jobs/results/12345",
                    "location": "Mountain View, CA",
                    "work_mode": "Hybrid",
                    "employment_type": "Internship",
                    "salary": "$58/hr + Housing Stipend ($9,000)",
                    "application_date": now - timedelta(days=28),
                    "deadline": now + timedelta(days=45),
                    "status": "Interview",
                    "recruiter_name": "Jessica Taylor",
                    "recruiter_email": "jessica.t@google.com",
                    "interview_date": now + timedelta(days=3, hours=4),
                    "notes": "Passed technical phone screen. 2 back-to-back virtual onsite rounds scheduled next week focusing on Data Structures and System Design.",
                    "resume_version": "Alex_Chen_SWE_General_v3.pdf"
                },
                {
                    "company_name": "Stripe",
                    "job_title": "Software Engineer Intern - Billing & Payments",
                    "job_description": "Build financial infrastructure for the internet. Collaborate on payment rails, fraud detection pipelines, and developer-facing APIs with Ruby and Java.",
                    "company_website": "https://stripe.com/jobs",
                    "application_url": "https://stripe.com/jobs/listing/swe-intern",
                    "location": "San Francisco, CA",
                    "work_mode": "Remote",
                    "employment_type": "Internship",
                    "salary": "$62/hr + Relocation assistance",
                    "application_date": now - timedelta(days=20),
                    "deadline": now + timedelta(days=15),
                    "status": "Online Assessment",
                    "recruiter_name": "David Miller",
                    "recruiter_email": "dmiller@stripe.com",
                    "interview_date": None,
                    "notes": "Received Codesignal test invite. 70-minute assessment with 4 algorithmic questions. Deadline to submit is next Friday.",
                    "resume_version": "Alex_Chen_Fintech_v2.pdf"
                },
                {
                    "company_name": "Microsoft",
                    "job_title": "Software Engineer Intern - Azure Cloud",
                    "job_description": "Design and build scalable cloud computing solutions on Azure. Focus on Kubernetes orchestration, edge computing, and distributed telemetry.",
                    "company_website": "https://careers.microsoft.com",
                    "application_url": "https://careers.microsoft.com/us/en/job/ms-swe-2026",
                    "location": "Redmond, WA",
                    "work_mode": "Hybrid",
                    "employment_type": "Internship",
                    "salary": "$55/hr + Corporate Housing Provided",
                    "application_date": now - timedelta(days=45),
                    "deadline": None,
                    "status": "Offer",
                    "recruiter_name": "Sarah Jenkins",
                    "recruiter_email": "sarah.j@microsoft.com",
                    "interview_date": now - timedelta(days=10),
                    "notes": "Received official written offer letter! Base stipend $55/hr, $1,500 wellness allowance, full flight coverage. Decision deadline: end of month.",
                    "resume_version": "Alex_Chen_Cloud_v1.pdf"
                },
                {
                    "company_name": "Meta",
                    "job_title": "Enterprise Software Engineering Intern",
                    "job_description": "Develop internal tools and AI automation workflows for thousands of engineers across WhatsApp, Instagram, and Reality Labs.",
                    "company_website": "https://www.metacareers.com",
                    "application_url": "https://www.metacareers.com/jobs/swe-intern-26",
                    "location": "Menlo Park, CA",
                    "work_mode": "On-site",
                    "employment_type": "Internship",
                    "salary": "$56/hr + Housing Stipend",
                    "application_date": now - timedelta(days=14),
                    "deadline": now + timedelta(days=20),
                    "status": "Under Review",
                    "recruiter_name": "Michael Chang",
                    "recruiter_email": "mchang@meta.com",
                    "interview_date": None,
                    "notes": "Referred by senior engineer alumnus. Application moved to recruiter review queue.",
                    "resume_version": "Alex_Chen_SWE_General_v3.pdf"
                },
                {
                    "company_name": "Datadog",
                    "job_title": "Backend Engineering Intern - Observability",
                    "job_description": "Build high-throughput ingestion pipelines processing trillions of metrics every day using Go, Kafka, and Cassandra.",
                    "company_website": "https://www.datadoghq.com/careers",
                    "application_url": "https://careers.datadoghq.com/detail/109283",
                    "location": "New York, NY",
                    "work_mode": "Hybrid",
                    "employment_type": "Internship",
                    "salary": "$52/hr + Monthly transit pass",
                    "application_date": now - timedelta(days=18),
                    "deadline": now + timedelta(days=10),
                    "status": "Interview",
                    "recruiter_name": "Elena Rostova",
                    "recruiter_email": "elena.r@datadoghq.com",
                    "interview_date": now + timedelta(days=5, hours=2),
                    "notes": "1-hour technical interview scheduled. Focus will be on concurrency, Go channels, and API rate limiting.",
                    "resume_version": "Alex_Chen_Backend_v2.pdf"
                },
                {
                    "company_name": "Apple",
                    "job_title": "Software Tools Intern - CoreOS",
                    "job_description": "Develop low-level compiler toolchains, developer CLI tools, and automated testing frameworks for macOS and iOS.",
                    "company_website": "https://jobs.apple.com",
                    "application_url": "https://jobs.apple.com/en-us/details/20058291",
                    "location": "Cupertino, CA",
                    "work_mode": "On-site",
                    "employment_type": "Internship",
                    "salary": "$54/hr + Apple Employee Discount",
                    "application_date": now - timedelta(days=8),
                    "deadline": now + timedelta(days=25),
                    "status": "Applied",
                    "recruiter_name": "Chris Evans",
                    "recruiter_email": None,
                    "interview_date": None,
                    "notes": "Applied via university career fair handshake link.",
                    "resume_version": "Alex_Chen_Systems_v1.pdf"
                },
                {
                    "company_name": "Amazon",
                    "job_title": "Software Development Engineer Intern (SDE)",
                    "job_description": "Build scalable e-commerce systems, AWS microservices, and high-availability distributed services supporting millions of active customers.",
                    "company_website": "https://amazon.jobs",
                    "application_url": "https://amazon.jobs/en/jobs/265109",
                    "location": "Seattle, WA",
                    "work_mode": "Hybrid",
                    "employment_type": "Internship",
                    "salary": "$53/hr + $2,425/mo housing stipend",
                    "application_date": now - timedelta(days=32),
                    "deadline": None,
                    "status": "Applied",
                    "recruiter_name": "Amira Khan",
                    "recruiter_email": "amira.k@amazon.com",
                    "interview_date": None,
                    "notes": "Completed initial OA assessment with 100% test cases passed. Awaiting final round scheduling.",
                    "resume_version": "Alex_Chen_SWE_General_v3.pdf"
                },
                {
                    "company_name": "Netflix",
                    "job_title": "Data Platform Engineering Intern",
                    "job_description": "Design and optimize distributed streaming pipelines, real-time analytics engines, and recommendation features using Spark and Flink.",
                    "company_website": "https://jobs.netflix.com",
                    "application_url": "https://jobs.netflix.com/jobs/data-eng-intern",
                    "location": "Los Gatos, CA",
                    "work_mode": "Hybrid",
                    "employment_type": "Internship",
                    "salary": "$60/hr Top-of-market pay",
                    "application_date": now - timedelta(days=2),
                    "deadline": now + timedelta(days=30),
                    "status": "Wishlist",
                    "recruiter_name": None,
                    "recruiter_email": None,
                    "interview_date": None,
                    "notes": "Waiting for internal referral from alumni before submitting final portal application.",
                    "resume_version": "Alex_Chen_Data_v1.pdf"
                },
                {
                    "company_name": "Airbnb",
                    "job_title": "Frontend Engineering Intern - Guest Experience",
                    "job_description": "Craft pixel-perfect, accessible, and delightful interactive web interfaces using React, TypeScript, and modern design systems.",
                    "company_website": "https://careers.airbnb.com",
                    "application_url": "https://careers.airbnb.com/positions/39102",
                    "location": "San Francisco, CA",
                    "work_mode": "Remote",
                    "employment_type": "Internship",
                    "salary": "$50/hr + $2,000 travel coupon",
                    "application_date": now - timedelta(days=50),
                    "deadline": None,
                    "status": "Rejected",
                    "recruiter_name": "Liam Scott",
                    "recruiter_email": "recruiting@airbnb.com",
                    "interview_date": None,
                    "notes": "Received standard rejection after recruiter screen. Position filled internally.",
                    "resume_version": "Alex_Chen_Frontend_v2.pdf"
                },
                {
                    "company_name": "Palantir Technologies",
                    "job_title": "Forward Deployed Software Engineer Intern",
                    "job_description": "Deploy customized enterprise analytics applications directly into customer data infrastructure using TypeScript, Java, and Foundry.",
                    "company_website": "https://www.palantir.com/careers",
                    "application_url": "https://palantir.com/careers/fdse-intern",
                    "location": "Washington, DC",
                    "work_mode": "On-site",
                    "employment_type": "Internship",
                    "salary": "$55/hr",
                    "application_date": now - timedelta(days=40),
                    "deadline": None,
                    "status": "Withdrawn",
                    "recruiter_name": "Robert Vance",
                    "recruiter_email": "rvance@palantir.com",
                    "interview_date": None,
                    "notes": "Withdrew candidacy after accepting another offer.",
                    "resume_version": "Alex_Chen_SWE_General_v3.pdf"
                }
            ]

            created_app_models = []
            for item in sample_apps:
                app_obj = Application(user_id=user.id, **item)
                db.add(app_obj)
                db.flush()
                created_app_models.append(app_obj)

            # Seed interviews
            google_app = next(a for a in created_app_models if a.company_name == "Google")
            datadog_app = next(a for a in created_app_models if a.company_name == "Datadog")
            msft_app = next(a for a in created_app_models if a.company_name == "Microsoft")

            interviews_to_seed = [
                Interview(
                    user_id=user.id,
                    application_id=google_app.id,
                    interview_type="Technical",
                    interview_date=now + timedelta(days=3, hours=4),
                    meeting_link="https://meet.google.com/abc-wxyz-qrs",
                    status="Scheduled",
                    preparation_notes="Review Dijkstra, Trie prefix lookups, and LRU cache concurrency."
                ),
                Interview(
                    user_id=user.id,
                    application_id=datadog_app.id,
                    interview_type="Technical",
                    interview_date=now + timedelta(days=5, hours=2),
                    meeting_link="https://zoom.us/j/9876543210",
                    status="Scheduled",
                    preparation_notes="Focus on Go channel primitives, deadlock avoidance, and HTTP rate limiting algorithms."
                ),
                Interview(
                    user_id=user.id,
                    application_id=msft_app.id,
                    interview_type="Behavioral",
                    interview_date=now - timedelta(days=10),
                    meeting_link="https://teams.microsoft.com/l/meetup-join/123",
                    status="Completed",
                    preparation_notes="Practiced STAR method stories on leadership, conflict resolution, and technical setbacks."
                )
            ]
            db.add_all(interviews_to_seed)

            # Seed reminders
            stripe_app = next(a for a in created_app_models if a.company_name == "Stripe")
            reminders_to_seed = [
                Reminder(
                    user_id=user.id,
                    application_id=stripe_app.id,
                    title="Complete Stripe CodeSignal OA",
                    description="Take test in a quiet environment. 70 minutes duration. Practice 2 string manipulation and matrix questions beforehand.",
                    due_date=now + timedelta(days=2, hours=6),
                    is_completed=False,
                    priority="High"
                ),
                Reminder(
                    user_id=user.id,
                    application_id=google_app.id,
                    title="Google Technical Round Prep",
                    description="Run through Neetcode 150 Tree and Graph patterns. Revise time and space complexity explanations.",
                    due_date=now + timedelta(days=1, hours=3),
                    is_completed=False,
                    priority="High"
                ),
                Reminder(
                    user_id=user.id,
                    application_id=datadog_app.id,
                    title="Review Datadog System Architecture Blog",
                    description="Read official Datadog blog post on distributed tracing and Kafka consumer group scaling.",
                    due_date=now + timedelta(days=4),
                    is_completed=False,
                    priority="Medium"
                ),
                Reminder(
                    user_id=user.id,
                    application_id=None,
                    title="Update LinkedIn & GitHub Project Links",
                    description="Pin the full-stack capstone project and highlight PostgreSQL and Docker skills.",
                    due_date=now + timedelta(days=7),
                    is_completed=True,
                    priority="Low"
                )
            ]
            db.add_all(reminders_to_seed)

            # Seed notes
            notes_to_seed = [
                Note(
                    user_id=user.id,
                    application_id=google_app.id,
                    title="Google Recruiter Screen Insights",
                    content="Recruiter Jessica mentioned the team values clear communication and discussing trade-offs before writing a single line of code. Always test code with empty inputs, duplicates, and edge cases."
                ),
                Note(
                    user_id=user.id,
                    application_id=msft_app.id,
                    title="Azure Team Offer Details & Benefits",
                    content="Offer includes $55/hr base pay, full relocation or corporate apartment in downtown Bellevue, $1,500 health stipend, and 401(k) match. Manager is Sarah Jenkins."
                ),
                Note(
                    user_id=user.id,
                    application_id=None,
                    title="Fall 2026 Strategy & Cold Outreach Checklist",
                    content="1. Check alumni connections at target companies on LinkedIn.\n2. Send 5 tailored cold messages weekly.\n3. Keep GitHub commit graph active.\n4. Practice mock interviews on Pramp twice a week."
                )
            ]
            db.add_all(notes_to_seed)

            db.commit()
            print("Database successfully seeded with realistic sample data!")

    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
