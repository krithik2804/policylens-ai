"""
Generates the 3 official mock insurance policy PDFs for PolicyLens AI:
- Policy A: SecureCare Essential Health Plan (Complete, 30 days waiting period on Page 2)
- Policy B: HealthShield Student Plus (Complete, 15 days waiting period on Page 2)
- Policy C: MediSure Basic Care (NO waiting period clause -> Strictly UNCLEAR)
"""
import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors


def create_policy_pdf(filename: str, title: str, subtitle: str, policy_data: dict, output_dir: str):
    os.makedirs(output_dir, exist_ok=True)
    filepath = os.path.join(output_dir, filename)

    doc = SimpleDocTemplate(
        filepath,
        pagesize=letter,
        rightMargin=44,
        leftMargin=44,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()

    header_style = ParagraphStyle(
        'DocHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=3
    )

    sub_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#475569'),
        spaceAfter=10
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#1E3A8A'),
        spaceBefore=10,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor('#1E293B'),
        spaceAfter=5
    )

    bullet_style = ParagraphStyle(
        'BulletItem',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#334155'),
        leftIndent=14,
        spaceAfter=3
    )

    meta_table_style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F8FAFC')),
        ('BOX', (0, 0), (-1, -1), 0.75, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
        ('PADDING', (0, 0), (-1, -1), 5),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8.5),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#0F172A')),
    ])

    story = []

    # Title & Metadata
    story.append(Paragraph(title, header_style))
    story.append(Paragraph(f"{subtitle} | Official Policy Contract Document", sub_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#1E3A8A'), spaceBefore=2, spaceAfter=8))

    meta_data = [
        [Paragraph("<b>Policy Name:</b>", body_style), Paragraph(policy_data["name"], body_style),
         Paragraph("<b>Underwritten By:</b>", body_style), Paragraph(policy_data["insurer"], body_style)],
        [Paragraph("<b>Policy Category:</b>", body_style), Paragraph(policy_data["type"], body_style),
         Paragraph("<b>Annual Premium:</b>", body_style), Paragraph(policy_data["premium_text"], body_style)],
        [Paragraph("<b>Sum Insured:</b>", body_style), Paragraph(policy_data["coverage_text"], body_style),
         Paragraph("<b>Compulsory Deductible:</b>", body_style), Paragraph(policy_data["deductible_text"], body_style)]
    ]
    t = Table(meta_data, colWidths=[108, 152, 118, 146])
    t.setStyle(meta_table_style)
    story.append(t)
    story.append(Spacer(1, 10))

    # Page 1 Sections
    for sec in policy_data["page_1_sections"]:
        story.append(Paragraph(sec["title"], h1_style))
        for p in sec["paragraphs"]:
            story.append(Paragraph(p, body_style))
        if "bullets" in sec:
            for b in sec["bullets"]:
                story.append(Paragraph(f"• {b}", bullet_style))
        story.append(Spacer(1, 4))

    # Explicit page break
    story.append(PageBreak())

    # Page 2 Sections
    story.append(Paragraph(f"{title} (Continued) — Specific Terms & Exclusions", header_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#94A3B8'), spaceBefore=2, spaceAfter=8))

    for sec in policy_data["page_2_sections"]:
        story.append(Paragraph(sec["title"], h1_style))
        for p in sec["paragraphs"]:
            story.append(Paragraph(p, body_style))
        if "bullets" in sec:
            for b in sec["bullets"]:
                story.append(Paragraph(f"• {b}", bullet_style))
        story.append(Spacer(1, 4))

    doc.build(story)
    return filepath


def generate_all_mock_policies(output_dir: str):
    # Policy A: SecureCare Essential Health Plan
    policy_a_data = {
        "name": "SecureCare Essential Health Plan",
        "insurer": "StarCare General Insurance Ltd.",
        "type": "Comprehensive Health Insurance",
        "premium_text": "Rs. 8,500 per annum (exclusive of applicable taxes)",
        "coverage_text": "Rs. 5,00,000 (Five Lakh Rupees)",
        "deductible_text": "Rs. 5,000 per policy year",
        "page_1_sections": [
            {
                "title": "SECTION 1. SCOPE OF COVERAGE AND SUM INSURED",
                "paragraphs": [
                    "This policy provides comprehensive in-patient hospitalization coverage with a total sum insured of Rs. 5,00,000 per policy year.",
                    "The company agrees to indemnify the insured person for reasonable and customary medical expenses incurred during hospitalization for an illness or accidental injury occurring within the policy period.",
                    "Room rent is covered up to 1% of the sum insured per day for normal hospital rooms, and intensive care unit (ICU) charges are covered up to 2% of the sum insured per day."
                ]
            },
            {
                "title": "SECTION 2. PREMIUM PAYMENT AND RENEWAL TERMS",
                "paragraphs": [
                    "The annual premium payable for this policy is Rs. 8,500 per annum, payable in advance on an annual basis prior to policy commencement.",
                    "A grace period of thirty calendar days is provided for renewal payment without loss of continuity benefits."
                ]
            }
        ],
        "page_2_sections": [
            {
                "title": "SECTION 3. WAITING PERIOD",
                "paragraphs": [
                    "A waiting period of 30 days applies to illnesses from policy inception, except in cases of emergency hospitalization resulting directly from an accidental injury.",
                    "Pre-existing diseases and medical conditions declared at the time of proposal shall be covered only after an initial waiting period of 36 continuous months of uninterrupted coverage under this policy."
                ]
            },
            {
                "title": "SECTION 4. DEDUCTIBLE AND COST SHARING",
                "paragraphs": [
                    "A mandatory aggregate deductible of Rs. 5,00,0 applies before any claim is eligible for disbursement by the insurer.",
                    "No co-payment is mandated for treatment taken across network hospitals located in Tier 1 or Tier 2 cities."
                ]
            },
            {
                "title": "SECTION 5. MAJOR POLICY EXCLUSIONS",
                "paragraphs": [
                    "The company shall not be liable to make any claim payment under this policy in respect of any expenses incurred by the insured for:",
                ],
                "bullets": [
                    "Cosmetic procedures: Cosmetic, aesthetic or plastic surgery treatments, including procedures aimed at improving appearance or gender affirmation.",
                    "Infertility treatment: Infertility, sub-fertility, assisted reproductive technology (ART), IVF procedures, or gestational surrogacy.",
                    "Non-medical expenses: Non-medical expenses, personal comfort items, dietary supplements, and vitamins without a medical prescription.",
                    "Hazardous activities: Treatment arising from intentional self-inflicted injuries, suicide attempts, or participation in hazardous and extreme sporting activities."
                ]
            },
            {
                "title": "SECTION 6. CLAIM CONDITIONS AND NOTICE PROCEDURE",
                "paragraphs": [
                    "For planned hospitalization, written intimation must be submitted to the insurer at least 48 hours prior to hospital admission.",
                    "For emergency admissions, notice must be provided within 24 hours of hospital admission to qualify for cashless processing.",
                    "All original bills, receipts, discharge summaries, and diagnostic reports must be lodged within 15 days following hospital discharge."
                ]
            },
            {
                "title": "SECTION 7. IMPORTANT LIMITATIONS",
                "paragraphs": [
                    "Cataract surgery claims are subject to a sub-limit of Rs. 25,000 per eye.",
                    "Domiciliary treatment is permitted only when hospital beds are strictly unavailable, up to a maximum limit of Rs. 50,000."
                ]
            }
        ]
    }

    # Policy B: HealthShield Student Plus
    policy_b_data = {
        "name": "HealthShield Student Plus",
        "insurer": "Apex Health & Allied Assurance Co.",
        "type": "Student Dedicated Medical Protection Plan",
        "premium_text": "Rs. 10,200 per annum (inclusive of student welfare discount)",
        "coverage_text": "Rs. 10,00,000 (Ten Lakh Rupees)",
        "deductible_text": "Rs. 2,500 per policy year",
        "page_1_sections": [
            {
                "title": "SECTION 1. SUMMARY OF COVERAGE BENEFITS",
                "paragraphs": [
                    "HealthShield Student Plus provides a high-tier maximum sum insured of Rs. 10,00,000 for verified enrolled undergraduate and graduate students.",
                    "Hospitalization charges, ambulance fees, surgeon fees, and medical equipment expenses incurred within the national student health network are covered up to the full sum insured with no capping on single private air-conditioned rooms.",
                    "Outpatient consultations and campus medical health clinic referrals are covered up to Rs. 15,000 per academic calendar term."
                ]
            },
            {
                "title": "SECTION 2. PREMIUM SCHEDULE",
                "paragraphs": [
                    "The annual premium for this student policy is Rs. 10,200 per annum, reflecting an institutional student rate.",
                    "Premiums may be paid annually or split on a semester payment plan with nominal convenience fees."
                ]
            }
        ],
        "page_2_sections": [
            {
                "title": "SECTION 3. WAITING PERIOD",
                "paragraphs": [
                    "A preferential waiting period of 15 days applies for student healthcare admissions from the effective start date of coverage.",
                    "Specified ailments including tonsillectomy, hernia repairs, and sinusitis are subject to a specified 12-month waiting period."
                ]
            },
            {
                "title": "SECTION 4. DEDUCTIBLES AND CO-PAYMENT",
                "paragraphs": [
                    "A student-friendly annual deductible of Rs. 2,500 per policy year applies across all non-network claims.",
                    "All emergency treatments rendered within university-affiliated campus health hospitals have zero deductible."
                ]
            },
            {
                "title": "SECTION 5. MAJOR POLICY EXCLUSIONS",
                "paragraphs": [
                    "The insurer expressly disclaims indemnification for expenses relating to:",
                ],
                "bullets": [
                    "Cosmetic dental: Cosmetic dental treatments, veneers, orthodontics, or cosmetic surgery unless necessitated by accidental trauma.",
                    "Alternative treatments: Alternative medical treatments including untested holistic therapies, naturopathy, and experimental unapproved medication.",
                    "Substance abuse: Substance abuse rehabilitation, alcoholism treatments, or injuries sustained while operating a motorized vehicle under toxicological influence.",
                    "Weight reduction: Weight reduction treatments, bariatric surgical procedures, and obesity management programs."
                ]
            },
            {
                "title": "SECTION 6. CLAIM SETTLEMENT PROCEDURES",
                "paragraphs": [
                    "Cashless hospitalization approval requests must be transmitted through the digital student claims portal within 12 hours of emergency intake.",
                    "Reimbursement claims must be accompanied by hospital discharge vouchers and submitted within 30 days of discharge.",
                    "A valid university student identification card must accompany all claims submissions."
                ]
            },
            {
                "title": "SECTION 7. IMPORTANT LIMITATIONS",
                "paragraphs": [
                    "Psychological counseling sessions are limited to 10 consultation sessions per calendar year.",
                    "Worldwide emergency assistance coverage is restricted to 60 days of overseas study-abroad travel."
                ]
            }
        ]
    }

    # Policy C: MediSure Basic Care
    # INTENTIONALLY HAS NO WAITING PERIOD SECTION OR CLAUSE!
    policy_c_data = {
        "name": "MediSure Basic Care",
        "insurer": "National Care Indemnity Ltd.",
        "type": "Standard Individual Basic Medical Cover",
        "premium_text": "Rs. 7,500 per annum",
        "coverage_text": "Rs. 7,50,000 (Seven Lakh Fifty Thousand Rupees)",
        "deductible_text": "Rs. 10,000 per claim",
        "page_1_sections": [
            {
                "title": "SECTION 1. INDEMNITY COVERAGE AND BENEFITS",
                "paragraphs": [
                    "MediSure Basic Care indemnifies the policyholder up to an overall sum insured of Rs. 7,50,000 for covered medical hospitalization events.",
                    "Inpatient care expenses including bed charges, nursing expenses, and attending doctor fees are reimbursed at standard economy ward rates.",
                    "Day-care procedures requiring less than 24 hours of hospitalization due to technological advancements are covered up to Rs. 1,00,000."
                ]
            },
            {
                "title": "SECTION 2. ANNUAL PREMIUM SCHEDULE",
                "paragraphs": [
                    "The stipulated annual premium for MediSure Basic Care is Rs. 7,500 per annum payable strictly before policy dispatch.",
                    "Taxes and statutory insurance levies are applicable over and above the base annual premium."
                ]
            }
        ],
        "page_2_sections": [
            {
                "title": "SECTION 3. BASIC IN-HOSPITAL ENTITLEMENTS",
                "paragraphs": [
                    "Insured members are eligible for pre-hospitalization medical consultations for up to 30 days prior to hospital admission.",
                    "Post-hospitalization diagnostic testing and prescribed medication are covered for up to 60 days subsequent to discharge."
                ]
            },
            {
                "title": "SECTION 4. POLICY DEDUCTIBLE RULES",
                "paragraphs": [
                    "A mandatory deductible of Rs. 10,000 per claim must be borne by the insured policyholder before liability attaches to the insurer.",
                    "The deductible applies individually to each separate hospitalization event during the policy term."
                ]
            },
            {
                "title": "SECTION 5. MAJOR POLICY EXCLUSIONS",
                "paragraphs": [
                    "The policy shall not indemnify the policyholder for expenses relating to:",
                ],
                "bullets": [
                    "Cosmetic procedures: Cosmetic or aesthetic procedures and elective treatments not medically required for life preservation.",
                    "Vision treatments: Refractive error eye surgeries and laser corrective vision treatments under minus 7.5 dioptres.",
                    "Self-medication: Self-medication purchases, over-the-counter wellness tonics, and unauthorized health supplements.",
                    "Experimental procedures: Experimental and unproven medical procedures that lack regulatory accreditation."
                ]
            },
            {
                "title": "SECTION 6. CLAIM SUBMISSION AND VERIFICATION",
                "paragraphs": [
                    "The insured must inform the claims administration desk in writing within 24 hours of any hospital admission.",
                    "Original itemized pharmacy bills and pathology reports must be submitted within 20 days following discharge.",
                    "Failure to furnish complete itemized medical reports within the stipulated timeline may result in repudiation of the claim."
                ]
            },
            {
                "title": "SECTION 7. IMPORTANT RESTRICTIONS",
                "paragraphs": [
                    "Room rent is capped at a maximum of Rs. 4,000 per day irrespective of the hospital tier.",
                    "Robotic surgery claims are restricted to an absolute ceiling of Rs. 1,50,000."
                ]
            }
        ]
    }

    pA = create_policy_pdf("Policy_A_SecureCare_Essential.pdf", "SecureCare Essential Health Plan", "StarCare General Insurance Ltd.", policy_a_data, output_dir)
    pB = create_policy_pdf("Policy_B_HealthShield_Student_Plus.pdf", "HealthShield Student Plus", "Apex Health & Allied Assurance Co.", policy_b_data, output_dir)
    pC = create_policy_pdf("Policy_C_MediSure_Basic_Care.pdf", "MediSure Basic Care", "National Care Indemnity Ltd.", policy_c_data, output_dir)

    return {
        "policy_a": pA,
        "policy_b": pB,
        "policy_c": pC
    }


if __name__ == "__main__":
    out = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "policies")
    res = generate_all_mock_policies(out)
    print("Regenerated mock PDFs:", res)
