# Generated by Django 4.2 on 2023-05-18 15:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='materialinventory',
            name='quantity',
            field=models.PositiveBigIntegerField(default=0),
        ),
    ]
