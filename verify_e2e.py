"""
End-to-end verification script for PolicyLens AI live services.
"""
import urllib.request
import json
import time

def verify():
    # 1. Test Backend Health
    with urllib.request.urlopen("http://localhost:8000/api/health") as res:
        health = json.loads(res.read().decode())
        print("[OK] Backend Health Check:", health)
        assert health["status"] == "healthy"

    # 2. Test Demo Endpoint
    with urllib.request.urlopen("http://localhost:8000/api/demo") as res:
        demo = json.loads(res.read().decode())
        policies = demo["policies"]
        print(f"[OK] Demo Policies Count: {len(policies)}")
        assert len(policies) == 3

        pA = next(p for p in policies if p["id"] == "policy_a")
        pB = next(p for p in policies if p["id"] == "policy_b")
        pC = next(p for p in policies if p["id"] == "policy_c")

        print(f"[OK] Policy A Waiting Period: {pA['waiting_period']} (Page {pA['evidence_map']['waiting_period']['page']})")
        assert pA["waiting_period"] == "30 days"
        assert pA["evidence_map"]["waiting_period"]["page"] == 2

        print(f"[OK] Policy B Waiting Period: {pB['waiting_period']} (Page {pB['evidence_map']['waiting_period']['page']})")
        assert pB["waiting_period"] == "15 days"
        assert pB["evidence_map"]["waiting_period"]["page"] == 2

        print(f"[OK] Policy C Waiting Period: {pC['waiting_period']}")
        assert pC["waiting_period"] == "UNCLEAR"
        assert pC["evidence_map"]["waiting_period"]["quote"] is None
        assert pC["evidence_map"]["waiting_period"]["page"] is None
        assert pC["evidence_map"]["waiting_period"]["reason"] == "No explicit clause was found in the provided policy document."
        print(f"     Reason: {pC['evidence_map']['waiting_period']['reason']}")

    # 3. Test Frontend Next.js Server
    with urllib.request.urlopen("http://localhost:3000") as res:
        html = res.read().decode()
        assert "PolicyLens AI" in html
        assert "Understand your insurance policy" in html
        print("[OK] Frontend Serving Next.js Application on http://localhost:3000")

    # 4. Test Multi-policy compare endpoint
    compare_req = urllib.request.Request(
        "http://localhost:8000/api/compare",
        data=json.dumps({"policy_ids": ["policy_a", "policy_c"]}).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(compare_req) as res:
        comp_res = json.loads(res.read().decode())
        print(f"[OK] 2-Policy Comparison Tested Successfully (Returned {len(comp_res['policies'])} policies)")
        assert len(comp_res["policies"]) == 2

    # 5. Test 3-policy compare endpoint
    compare_req_3 = urllib.request.Request(
        "http://localhost:8000/api/compare",
        data=json.dumps({"policy_ids": ["policy_a", "policy_b", "policy_c"]}).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(compare_req_3) as res:
        comp_res_3 = json.loads(res.read().decode())
        print(f"[OK] 3-Policy Comparison Tested Successfully (Returned {len(comp_res_3['policies'])} policies)")
        assert len(comp_res_3["policies"]) == 3

    print("\n=======================================================")
    print("ALL 13 FINAL VERIFICATION CHECKS PASSED PERFECTLY!")
    print("=======================================================")

if __name__ == "__main__":
    verify()
