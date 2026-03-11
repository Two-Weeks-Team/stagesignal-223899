from pydantic import BaseModel


class PlanRequest(BaseModel):
    query: str = ""
    preferences: str = ""


class InsightRequest(BaseModel):
    selection: str = ""
    context: str = ""
