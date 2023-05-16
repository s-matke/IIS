# Generated by Django 4.2 on 2023-05-10 13:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('material', '0008_alter_billofmaterial_quantity'),
    ]

    operations = [
        migrations.AddField(
            model_name='material',
            name='max_amount',
            field=models.PositiveIntegerField(default=1),
        ),
        migrations.AddField(
            model_name='material',
            name='min_amount',
            field=models.PositiveIntegerField(default=0),
        ),
    ]