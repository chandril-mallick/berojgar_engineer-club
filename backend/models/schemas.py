from pydantic import BaseModel, Field


class AssessmentPayload(BaseModel):
    college: str
    branch: str
    year: str
    cgpa: float = Field(ge=0, le=10)
    projects: int = Field(ge=0, le=10)
    internships: int = Field(ge=0, le=10)
    github: str
    linkedin: str
    dsa: int = Field(ge=0, le=10)
    communication: int = Field(ge=0, le=10)
    target_company: str


class AssessmentResponse(BaseModel):
    score: int
    risk_level: str
    roast: str
    placement_probability: int
    salary_prediction_lpa: float


class ResumeRoastPayload(BaseModel):
    file_name: str


class ResumeRoastResponse(BaseModel):
    ats_score: int
    roast_line: str
    improvements: list[str]
