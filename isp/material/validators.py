from rest_framework.utils.representation import smart_repr
from rest_framework import serializers
from gettext import gettext as _

class MaxLessThanMinValidator:
    message = _('{min_amount_field} should be less than {max_amount_field}.')

    def __init__(self, min_amount_field="min_amount", max_amount_field="max_amount", message=None):
        self.min_amount_field = min_amount_field
        self.max_amount_field = max_amount_field
        self.message = message or self.message
    
    def __call__(self, attrs):
        if attrs[self.min_amount_field] >= attrs[self.max_amount_field]:
            message = self.message.format(
                min_amount_field=self.min_amount_field,
                max_amount_field=self.max_amount_field,
            )
            raise serializers.ValidationError(message)
    
    def __repr__(self):
        return '<%s(min_amount_field=%s, max_amount_field=%s)>' % (
            self.__class__.__name__,
            smart_repr(self.min_amount_field),
            smart_repr(self.max_amount_field)
        )
    