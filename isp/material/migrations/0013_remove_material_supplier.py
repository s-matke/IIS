# Generated by Django 4.2 on 2023-05-18 12:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('material', '0012_alter_supplier_address_alter_supplier_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='material',
            name='supplier',
        ),
    ]