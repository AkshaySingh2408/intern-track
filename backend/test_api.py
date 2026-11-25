from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_full_flow():
    # 1. Health check
    res = client.get("/api/health")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    print("✓ /api/health passed:", res.json())

    # 2. Login demo user
    login_res = client.post("/api/auth/login", json={
        "email": "alex.chen@university.edu",
        "password": "DemoPass123!"
    })
    assert login_res.status_code == 200, f"Login failed: {login_res.text}"
    data = login_res.json()
    token = data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("✓ /api/auth/login passed. User:", data["user"]["full_name"])

    # 3. GET /api/auth/me
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200, f"Me failed: {me_res.text}"
    print("✓ /api/auth/me passed")

    # 4. GET /api/dashboard/summary
    summary_res = client.get("/api/dashboard/summary", headers=headers)
    assert summary_res.status_code == 200, f"Summary failed: {summary_res.text}"
    print("✓ /api/dashboard/summary passed:", summary_res.json())

    # 5. GET /api/dashboard/analytics
    analytics_res = client.get("/api/dashboard/analytics", headers=headers)
    assert analytics_res.status_code == 200, f"Analytics failed: {analytics_res.text}"
    print("✓ /api/dashboard/analytics passed")

    # 6. GET /api/dashboard/recent-applications
    recent_res = client.get("/api/dashboard/recent-applications", headers=headers)
    assert recent_res.status_code == 200, f"Recent failed: {recent_res.text}"
    print("✓ /api/dashboard/recent-applications passed")

    # 7. GET /api/applications
    apps_res = client.get("/api/applications", headers=headers)
    assert apps_res.status_code == 200, f"Apps failed: {apps_res.text}"
    apps_data = apps_res.json()
    print(f"✓ /api/applications passed ({apps_data['total']} items)")

    # 8. Create new application
    new_app_res = client.post("/api/applications", json={
        "company_name": "NVIDIA",
        "job_title": "AI Infrastructure Intern",
        "location": "Santa Clara, CA",
        "work_mode": "Hybrid",
        "employment_type": "Internship",
        "salary": "$65/hr",
        "status": "Applied",
        "notes": "Testing create endpoint"
    }, headers=headers)
    assert new_app_res.status_code == 201, f"Create app failed: {new_app_res.text}"
    created_id = new_app_res.json()["id"]
    print("✓ /api/applications POST passed, created ID:", created_id)

    # 9. Update status
    status_res = client.patch(f"/api/applications/{created_id}/status", json={
        "status": "Interview"
    }, headers=headers)
    assert status_res.status_code == 200, f"Status update failed: {status_res.text}"
    print("✓ /api/applications/{id}/status PATCH passed")

    # 10. Delete test application
    del_res = client.delete(f"/api/applications/{created_id}", headers=headers)
    assert del_res.status_code == 204, f"Delete failed: {del_res.text}"
    print("✓ /api/applications/{id} DELETE passed")

    # 11. GET /api/interviews
    invs_res = client.get("/api/interviews", headers=headers)
    assert invs_res.status_code == 200, f"Interviews failed: {invs_res.text}"
    print(f"✓ /api/interviews passed ({len(invs_res.json())} items)")

    # 12. GET /api/reminders
    rems_res = client.get("/api/reminders", headers=headers)
    assert rems_res.status_code == 200, f"Reminders failed: {rems_res.text}"
    print(f"✓ /api/reminders passed ({len(rems_res.json())} items)")

    # 13. GET /api/notes
    notes_res = client.get("/api/notes", headers=headers)
    assert notes_res.status_code == 200, f"Notes failed: {notes_res.text}"
    print(f"✓ /api/notes passed ({len(notes_res.json())} items)")

    # 14. GET & PUT /api/profile
    prof_res = client.get("/api/profile", headers=headers)
    assert prof_res.status_code == 200, f"Profile get failed: {prof_res.text}"
    up_prof_res = client.put("/api/profile", json={
        "target_role": "Senior Full Stack Intern"
    }, headers=headers)
    assert up_prof_res.status_code == 200, f"Profile put failed: {up_prof_res.text}"
    print("✓ /api/profile GET & PUT passed")

    print("\n🎉 ALL 14 BACKEND API ENDPOINTS VERIFIED & WORKING PERFECTLY!")

if __name__ == "__main__":
    test_full_flow()

def test_user_isolation():
    # Register user B
    reg_res = client.post("/api/auth/register", json={
        "email": "user.b@college.edu",
        "password": "Password123!",
        "full_name": "User B",
        "target_role": "Data Analyst"
    })
    assert reg_res.status_code == 201
    token_b = reg_res.json()["access_token"]
    headers_b = {"Authorization": f"Bearer {token_b}"}

    # User B should see 0 applications initially
    apps_b = client.get("/api/applications", headers=headers_b)
    assert apps_b.status_code == 200
    assert apps_b.json()["total"] == 0, f"Expected 0, got {apps_b.json()['total']}"

    # User B should see 0 summary stats
    sum_b = client.get("/api/dashboard/summary", headers=headers_b)
    assert sum_b.status_code == 200
    assert sum_b.json()["total"] == 0

    # User B trying to access User A's application ID 1 should get 404
    forbidden_app = client.get("/api/applications/1", headers=headers_b)
    assert forbidden_app.status_code == 404

    # User B trying to delete User A's application ID 1 should get 404
    forbidden_del = client.delete("/api/applications/1", headers=headers_b)
    assert forbidden_del.status_code == 404

    print("✓ USER DATA ISOLATION VERIFIED: User B cannot view or modify User A's records!")

test_user_isolation()
