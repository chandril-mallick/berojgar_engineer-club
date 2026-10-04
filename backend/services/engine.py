import math

from backend.models.schemas import (
    AssessmentPayload,
    AssessmentResponse,
    ResumeRoastPayload,
    ResumeRoastResponse,
)


def _clamp(value: float, minimum: int = 0, maximum: int = 100) -> int:
    # Match JavaScript's Math.round used by the resilient Next.js scorer.
    return max(minimum, min(math.floor(value + 0.5), maximum))


def score_assessment(payload: AssessmentPayload) -> AssessmentResponse:
    raw_score = (
        payload.cgpa * 6
        + payload.projects * 7
        + payload.internships * 9
        + payload.dsa * 5
        + payload.communication * 5
        + (6 if payload.github == "yes" else 0)
        + (5 if payload.linkedin == "yes" else 0)
        - (8 if payload.year == "1" else 0)
    )
    score = _clamp(raw_score / 4.2)
    risk_level = "HIGH" if score < 45 else "MEDIUM" if score < 70 else "LOW"
    roast = {
        "HIGH": "You are currently more prepared for watching placement reels than cracking interviews.",
        "MEDIUM": "You are one focused sprint away from becoming HR's favorite candidate.",
        "LOW": "Dangerously employable. Your relatives might stop asking job kab.",
    }[risk_level]
    return AssessmentResponse(
        score=score,
        risk_level=risk_level,
        roast=roast,
        placement_probability=_clamp(score + 8),
        salary_prediction_lpa=round(3 + score / 12, 1),
    )


def roast_resume(payload: ResumeRoastPayload) -> ResumeRoastResponse:
    base_score = 55 if "resume" in payload.file_name.lower() else 45
    ats_score = _clamp(base_score)
    return ResumeRoastResponse(
        ats_score=ats_score,
        roast_line="Your resume has survived four years without learning formatting."
        if ats_score < 60
        else "Your resume is decent, but HR still wants receipts, not vibes.",
        improvements=[
            "Add measurable outcomes for each project.",
            "Bring technical skills section above education.",
            "Keep formatting consistent across bullets and spacing.",
            "Include GitHub and deployed project links.",
        ],
    )
