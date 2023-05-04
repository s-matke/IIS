# Generated by Django 4.2 on 2023-05-04 12:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0002_product_planner'),
        ('material', '0005_delete_billofmaterial'),
    ]

    operations = [
        migrations.CreateModel(
            name='BillOfMaterial',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.PositiveIntegerField()),
                ('material', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='material.material')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='product.product')),
            ],
            options={
                'unique_together': {('product', 'material')},
            },
        ),
    ]