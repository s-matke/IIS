# Generated by Django 4.2 on 2023-05-31 12:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('machine', '0005_machinequeue'),
    ]

    operations = [
        migrations.DeleteModel(
            name='MachineQueue',
        ),
    ]
