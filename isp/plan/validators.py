# EndBeforeStartValidator
from gettext import gettext as _
from rest_framework import serializers
from rest_framework.utils.representation import smart_repr
from .helper import before_or_after_workhour
from django.conf import settings
import datetime

class EndBeforeStartValidator:
    message = _('{start_date_field} should be before {end_date_field}.')

    def __init__(self, start_date_field="start_date", end_date_field="end_date", message=None):
        self.start_date_field = start_date_field
        self.end_date_field = end_date_field
        self.message = message
    
    def __call__(self, attrs):
        if attrs[self.start_date_field] >= attrs[self.end_date_field]:
            message = self.message.format(
                start_date_feild=self.start_date_field,
                end_date_field=self.end_date_field,
            )
            raise serializers.ValidationError(message)
    
    def __repr__(self):
        return '<%s(start_date-field=%s, end_date_field=%s)>' % (
            self.__class__.__name__,
            smart_repr(self.start_date_field),
            smart_repr(self.end_date_field)
        )

class WithinWorkingHoursValidator:
    message = _('{start_date_field} and {end_date_field} should be within working hours [{opening_hour} - {closing_hour}]')

    def __init__(self, start_date_field="start_date", end_date_field="end_date", message=None):
        self.start_date_field = start_date_field
        self.end_date_field = end_date_field
        self.message = message
    
    def __call__(self, attrs):
        start_datetime = attrs[self.start_date_field]
        end_datetime = attrs[self.end_date_field]

        start_time = datetime.time(start_datetime.hour, start_datetime.minute, 0, 0)
        end_time = datetime.time(end_datetime.hour, end_datetime.minute, 0, 0)

        if before_or_after_workhour(start_time) or before_or_after_workhour(end_time):
            message = self.message.format(
                start_date_feild=self.start_date_field,
                end_date_field=self.end_date_field,
                opening_hour=settings.PRODUCTION_OPENING_TIME,
                closing_hour=settings.PRODUCTION_CLOSING_TIME,
            )
            raise serializers.ValidationError(message)
    
    def __repr__(self):
        return '<%s(start_date-field=%s, end_date_field=%s)>' % (
            self.__class__.__name__,
            smart_repr(self.start_date_field),
            smart_repr(self.end_date_field)
        )
