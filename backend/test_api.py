"""
Comprehensive test script for PolicyLens AI API backend.
Tests:
1. Health check
2. Demo endpoint
3. Policy A waiting period = 30 days
4. Policy B waiting period = 15 days
5. Policy C waiting period = UNCLEAR
6. Evidence quotes and page numbers
7. Side-by-side comparison matrix
8. Grounded Ask / Q&A
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from starlette.testclient import TestClient
from backend.main import app


def run_tests():
    client = TestClient(app)

    # 1. Health check
    res = client.get("/api/health")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    print("[OK] Health check passed:", res.json())

    # 2. Demo data
    res_demo = client.get("/api/demo")
    assert res_demo.status_code == 200, f"Demo endpoint failed: {res_demo.text}"
    demo_data = res_demo.json()
    policies = demo_data["policies"]
    assert len(policies) == 3, f"Expected 3 demo policies, got {len(policies)}"
    print(f"[OK] Retrieved {len(policies)} demo policies")

    pA = next(p for p in policies if p["id"] == "policy_a")
    pB = next(p for p in policies if p["id"] == "policy_b")
    pC = next(p for p in policies if p["id"] == "policy_c")

    # 3. Policy A verification
    assert pA["waiting_period"] == "30 days", f"Expected 30 days, got {pA['waiting_period']}"
    assert pA["coverage"] == "Rs. 5,00,000", f"Expected Rs. 5,00,000, got {pA['coverage']}"
    assert pA["evidence_map"]["waiting_period"]["page"] == 2
    assert "waiting period of 30 days" in pA["evidence_map"]["waiting_period"]["quote"].lower()
    print("[OK] Policy A verified: 30 days waiting period on Page 2 with exact quote")

    # 4. Policy B verification
    assert pB["waiting_period"] == "15 days", f"Expected 15 days, got {pB['waiting_period']}"
    assert pB["coverage"] == "Rs. 10,00,000", f"Expected Rs. 10,00,000, got {pB['coverage']}"
    assert pB["evidence_map"]["waiting_period"]["page"] == 2
    assert "15 days" in pB["evidence_map"]["waiting_period"]["quote"].lower()
    print("[OK] Policy B verified: 15 days waiting period on Page 2 with exact quote")

    # 5. Policy C verification (HACKATHON DEMO MOMENT: UNCLEAR!)
    assert pC["waiting_period"] == "UNCLEAR", f"Expected UNCLEAR, got {pC['waiting_period']}"
    assert pC["coverage"] == "Rs. 7,50,000", f"Expected Rs. 7,50,000, got {pC['coverage']}"
    wp_ev_c = pC["evidence_map"]["waiting_period"]
    assert wp_ev_c["value"] == "UNCLEAR"
    assert wp_ev_c["quote"] is None
    assert wp_ev_c["page"] is None
    assert wp_ev_c["reason"] == "No explicit clause was found in the provided policy document."
    print("[OK] Policy C verified: STRICTLY UNCLEAR with exact reason and no fake quote")

    # 6. Compare endpoint with 2 policies
    res_comp2 = client.post("/api/compare", json={"policy_ids": ["policy_a", "policy_b"]})
    assert res_comp2.status_code == 200
    comp2_data = res_comp2.json()
    assert len(comp2_data["policies"]) == 2
    print("[OK] Comparison with 2 policies passed")

    # 7. Compare endpoint with 3 policies
    res_comp3 = client.post("/api/compare", json={"policy_ids": ["policy_a", "policy_b", "policy_c"]})
    assert res_comp3.status_code == 200
    comp3_data = res_comp3.json()
    assert len(comp3_data["policies"]) == 3
    print("[OK] Comparison with 3 policies passed")

    # 8. Q&A Ask endpoint
    ask_c = client.post("/api/ask", json={"policy_id": "policy_c", "question": "What is the waiting period?"})
    assert ask_c.status_code == 200
    ask_c_json = ask_c.json()
    assert ask_c_json["found"] is False
    assert "UNCLEAR" in ask_c_json["answer"]
    print("[OK] Ask Policy C waiting period correctly rejected as UNCLEAR")

    ask_a = client.post("/api/ask", json={"policy_id": "policy_a", "question": "What is the waiting period?"})
    assert ask_a.status_code == 200
    ask_a_json = ask_a.json()
    assert ask_a_json["found"] is True
    assert "30 days" in ask_a_json["answer"]
    assert ask_a_json["page"] == 2
    print("[OK] Ask Policy A waiting period correctly answered with 30 days and Page 2 citation")

    # 9. PDF endpoint
    pdf_res = client.get("/api/pdf/policy_a")
    assert pdf_res.status_code == 200
    assert pdf_res.headers["content-type"] == "application/pdf"
    print("[OK] PDF streaming endpoint serving valid PDF")

    print("\nALL BACKEND API TESTS PASSED SUCCESSFULLY!")


if __name__ == "__main__":
    run_tests()
