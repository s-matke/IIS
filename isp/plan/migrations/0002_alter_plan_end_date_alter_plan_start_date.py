# Generated by Django 4.2 on 2023-05-19 18:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('plan', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='plan',
            name='end_date',
            field=models.DateTimeField(),
        ),
        migrations.AlterField(
            model_name='plan',
            name='start_date',
            field=models.DateTimeField(),
        ),
    ]