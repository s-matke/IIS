# Generated by Django 4.2 on 2023-05-19 18:24

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('plan', '0003_rename_end_date_plan_end_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='plan',
            old_name='end',
            new_name='end_date',
        ),
        migrations.RenameField(
            model_name='plan',
            old_name='start',
            new_name='start_date',
        ),
    ]
