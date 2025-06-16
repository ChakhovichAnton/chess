from datetime import timedelta

def timedelta_to_ms(time_delta: timedelta):
    return int(time_delta.total_seconds() * 1000)
