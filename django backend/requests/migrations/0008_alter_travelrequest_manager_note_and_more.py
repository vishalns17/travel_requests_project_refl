# Generated by Django 4.2.17 on 2025-03-10 03:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('requests', '0007_alter_travelrequest_manager_note'),
    ]

    operations = [
        migrations.AlterField(
            model_name='travelrequest',
            name='manager_note',
            field=models.CharField(max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='travelrequest',
            name='status',
            field=models.CharField(choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected'), ('update', 'Update Requested'), ('closed', 'Closed')], default='pending', max_length=20, null=True),
        ),
    ]
