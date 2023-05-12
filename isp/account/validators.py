from django.contrib.auth.models import Group


def is_group_exists(group):
    return Group.objects.filter(name=group)
    # try:
    #     print("Hello?")
    #     group = Group.objects.filter(name=group)
    #     print("Found")
    #     return True
    # except Group.DoesNotExist:
    #     print("Group doesnt exist")
    #     return False
