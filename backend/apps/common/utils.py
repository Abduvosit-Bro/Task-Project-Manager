from datetime import datetime


def scheduled_bucket(dt: datetime) -> datetime:
    return dt.replace(minute=0, second=0, microsecond=0)
