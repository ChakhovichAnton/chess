from datetime import timedelta

def timedelta_to_ms(time_delta: timedelta):
    return int(time_delta.total_seconds() * 1000)

def minutes_to_ms(minutes: int):
    return minutes * 60_000

def seconds_to_ms(seconds: int):
    return seconds * 1_000
