# Generated by Django 4.2 on 2023-05-18 12:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('material', '0009_material_max_amount_material_min_amount'),
    ]

    operations = [
        migrations.CreateModel(
            name='Supplier',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=70)),
                ('pib', models.CharField(max_length=9)),
                ('address', models.CharField(max_length=50)),
            ],
        ),
    ]
