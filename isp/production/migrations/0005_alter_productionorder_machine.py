# Generated by Django 4.2 on 2023-05-30 21:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('machine', '0005_machinequeue'),
        ('production', '0004_productionorderqueue'),
    ]

    operations = [
        migrations.AlterField(
            model_name='productionorder',
            name='machine',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='machine.machine'),
        ),
    ]