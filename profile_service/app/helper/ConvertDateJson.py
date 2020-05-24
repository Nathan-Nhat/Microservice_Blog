import datetime
import json


def default(obj):
    if isinstance(obj, datetime.datetime):
        return obj.isoformat()