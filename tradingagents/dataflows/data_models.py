from pydantic import BaseModel
from typing import Optional


class ShareholderEvent(BaseModel):
    headline: str
    source: str
    numbers: Optional[dict[str, float | None]] = None  # e.g. {"stake_pct": 9.8, "usd_value": 1.2e9}

class ShareholderNews(BaseModel):
    ticker: str
    from_date: str
    to_date: str
    items: list[ShareholderEvent]