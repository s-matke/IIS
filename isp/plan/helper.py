# Pomocne funkcije
from django.conf import settings
import datetime
import math

def before_or_after_workhour(time):
    if time < settings.PRODUCTION_OPENING_TIME or time > settings.PRODUCTION_CLOSING_TIME:
        return True
    return False


def calculate_producable_amount_and_cost(start_date, end_date, product):
    total_minutes = 0.0

    # open and close time for the production company
    opening_hour = settings.PRODUCTION_OPENING_TIME
    closing_hour = settings.PRODUCTION_CLOSING_TIME

    closing_datetime = datetime.datetime(start_date.year, start_date.month, start_date.day, closing_hour.hour, closing_hour.minute, 0)
    opening_datetime = datetime.datetime(end_date.year, end_date.month, end_date.day, opening_hour.hour, opening_hour.minute, 0)

    # Total minutes between opening and closing of production
    minute_between_close_open = (closing_hour.hour - opening_hour.hour) * 60 + (opening_hour.minute + closing_hour.minute)   

    # initial minutes for start_date and end_date
    total_minutes += calculate_minutes(start_date, closing_datetime)
    total_minutes += calculate_minutes(opening_datetime, end_date)

    # number of days between start_date and end_date excluding them    
    if start_date.date() == end_date.date():
        days_between_start_end = 0
    else:
        # days_between_start_end = (end_date - start_date).days
        days_between_start_end = (datetime.date(end_date.year, end_date.month, end_date.day) - datetime.date(start_date.year, start_date.month, start_date.day)).days - 1

    # total minutes between start_date and end_date taking in consideration
    # their time of starting/ending
    total_minutes += minute_between_close_open * days_between_start_end

    # total number of producable products within the timeframe
    total_producable_amount = math.floor(total_minutes / float(product.lead_time))

    # total cost of production
    total_cost = round(total_producable_amount * float(product.price_of_producing), 2)

    return total_producable_amount, total_cost    
    

def calculate_minutes(start, end):
    if start < end:
        return (end - start).total_seconds() / 60.0
    else:
        print("[CALCULATE_MINUTES]: Entered 'else'")
        return (start - end).total_seconds() / 60.0
