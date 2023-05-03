from django.contrib.auth.models import Group


def is_group_exists(group):
    return Group.objects.filter(name=group)