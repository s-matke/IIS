# Generated by Django 4.2 on 2023-05-25 22:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('machine', '0004_rename_created_machine_purchase_date_machine_price_and_more'),
        ('production', '0003_productionorder_machine_productionorder_state'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProductionOrderQueue',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('machine', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='machine.machine')),
                ('production', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='production.productionorder')),
            ],
        ),
    ]
