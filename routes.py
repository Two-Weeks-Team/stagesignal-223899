from fastapi import APIRouter

from ai_service import build_insights, build_plan
from models import InsightRequest, PlanRequest

router = APIRouter()


@router.get("/health")
async def health():
    return {"ok": True}


@router.post("/plan")
async def create_plan(payload: PlanRequest):
    return build_plan(payload.query, payload.preferences)


@router.post("/insights")
async def create_insights(payload: InsightRequest):
    return build_insights(payload.selection, payload.context)
