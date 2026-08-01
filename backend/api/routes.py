from fastapi import APIRouter

from backend.models.schemas import (
    AssessmentPayload,
    AssessmentResponse,
    ResumeRoastPayload,
    ResumeRoastResponse,
)
from backend.services.engine import score_assessment, roast_resume

router = APIRouter()


@router.post("/assessment/score", response_model=AssessmentResponse)
def generate_score(payload: AssessmentPayload) -> AssessmentResponse:
    return score_assessment(payload)


@router.post("/resume/roast", response_model=ResumeRoastResponse)
def generate_roast(payload: ResumeRoastPayload) -> ResumeRoastResponse:
    return roast_resume(payload)
