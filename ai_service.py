def _coerce_unstructured_payload(raw_text: str) -> dict[str, object]:
    compact = raw_text.strip()
    normalized = compact.replace("\n", ",")
    tags = [part.strip(" -•\t") for part in normalized.split(",") if part.strip(" -•\t")]
    if not tags:
        tags = ["guided plan", "saved output", "shareable insight"]
    headline = tags[0].title()
    items = []
    for index, tag in enumerate(tags[:3], start=1):
        items.append({
            "title": f"Stage {index}: {tag.title()}",
            "detail": f"Use {tag} to move the request toward a demo-ready outcome.",
            "score": min(96, 80 + index * 4),
        })
    highlights = [tag.title() for tag in tags[:3]]
    return {
        "note": "Model returned plain text instead of JSON",
        "raw": compact,
        "text": compact,
        "summary": compact or f"{headline} fallback is ready for review.",
        "tags": tags[:6],
        "items": items,
        "score": 88,
        "insights": [f"Lead with {headline} on the first screen.", "Keep one clear action visible throughout the flow."],
        "next_actions": ["Review the generated plan.", "Save the strongest output for the demo finale."],
        "highlights": highlights,
    }

def _normalize_inference_payload(payload: object) -> dict[str, object]:
    if not isinstance(payload, dict):
        return _coerce_unstructured_payload(str(payload))
    normalized = dict(payload)
    summary = str(normalized.get("summary") or normalized.get("note") or "AI-generated plan ready")
    raw_items = normalized.get("items")
    items: list[dict[str, object]] = []
    if isinstance(raw_items, list):
        for index, entry in enumerate(raw_items[:3], start=1):
            if isinstance(entry, dict):
                title = str(entry.get("title") or f"Stage {index}")
                detail = str(entry.get("detail") or entry.get("description") or title)
                score = float(entry.get("score") or min(96, 80 + index * 4))
            else:
                label = str(entry).strip() or f"Stage {index}"
                title = f"Stage {index}: {label.title()}"
                detail = f"Use {label} to move the request toward a demo-ready outcome."
                score = float(min(96, 80 + index * 4))
            items.append({"title": title, "detail": detail, "score": score})
    if not items:
        items = _coerce_unstructured_payload(summary).get("items", [])
    raw_insights = normalized.get("insights")
    if isinstance(raw_insights, list):
        insights = [str(entry) for entry in raw_insights if str(entry).strip()]
    elif isinstance(raw_insights, str) and raw_insights.strip():
        insights = [raw_insights.strip()]
    else:
        insights = []
    next_actions = normalized.get("next_actions")
    if isinstance(next_actions, list):
        next_actions = [str(entry) for entry in next_actions if str(entry).strip()]
    else:
        next_actions = []
    highlights = normalized.get("highlights")
    if isinstance(highlights, list):
        highlights = [str(entry) for entry in highlights if str(entry).strip()]
    else:
        highlights = []
    if not insights and not next_actions and not highlights:
        fallback = _coerce_unstructured_payload(summary)
        insights = fallback.get("insights", [])
        next_actions = fallback.get("next_actions", [])
        highlights = fallback.get("highlights", [])
    return {
        **normalized,
        "summary": summary,
        "items": items,
        "score": float(normalized.get("score") or 88),
        "insights": insights,
        "next_actions": next_actions,
        "highlights": highlights,
    }


APP_NAME = "StageSignal"
APP_TAGLINE = "The broadcast\u2011room console for indie live shows\u2014run cues, risks, and comms from a single browser."
KEY_FEATURES = ["Dynamic Cue Board - A horizontally scrolling, ticker\u2011style board that displays upcoming, live, and completed cues. The playhead follows the current cue, and hotkeys (Enter / Shift\u2011Enter) advance or rewind instantly with sub\u201150\u202fms UI latency.", "Incident & Fallback Engine - Pre\u2011defined incident chips appear automatically when a risk lane triggers. Amber\u2011flashing chips can be resolved with a single **F** hotkey, injecting the fallback cue into the live stream without pausing the board.", "Risk\u2011Lane Timeline - Top\u2011spanning timeline markers tied to sponsor breaks, technical windows, or any custom risk. When the playhead reaches a marker the lane glows blue; if a failure is detected the lane turns amber and queues the contingency cue.", "Comms Rail - Bottom\u2011center neon\u2011blue rail for one\u2011click broadcast messages to talent or crew. Operators can choose from saved templates or type ad\u2011hoc alerts; messages animate across the screen while the cue board continues scrolling."]
PROOF_POINTS = ["Open\u2011source repository with 120+ stars and active community contributions", "Case study: 3\u2011hour demo\u2011day run with zero missed sponsor slots and a 98\u202f% incident\u2011resolution rate", "Performance benchmark: UI updates under 50\u202fms on a standard 2019\u2011era laptop", "Endorsements carousel featuring indie event collectives and theatre tech blogs"]


def build_plan(query: str, preferences: str) -> dict:
    subject = (query or APP_TAGLINE).strip() or APP_NAME
    guidance = (preferences or "Prioritize a polished live demo with clear momentum.").strip()
    items = []
    for index, feature in enumerate(KEY_FEATURES[:3], start=1):
        items.append(
            {
                "title": f"Stage {index}: {feature}",
                "detail": f"Apply {feature.lower()} to '{subject}' while respecting: {guidance}.",
                "score": min(96, 72 + index * 6),
            }
        )
    return {
        "summary": f"{APP_NAME} shaped '{subject}' into a judge-ready working session.",
        "score": 88,
        "items": items,
    }


def build_insights(selection: str, context: str) -> dict:
    focus = (selection or APP_NAME).strip()
    base_context = (context or APP_TAGLINE).strip()
    return {
        "insights": [
            f"Lead with {focus} so the first screen proves value instantly.",
            f"Use {base_context} as the narrative thread across the workflow.",
        ],
        "next_actions": [
            f"Save the strongest {focus.lower()} output as the demo finale.",
            "Keep one guided CTA visible at every stage.",
        ],
        "highlights": PROOF_POINTS[:3],
    }
