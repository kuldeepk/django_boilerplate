# Generated by Django 3.0.6 on 2020-05-19 18:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_invite_waitlist'),
    ]

    operations = [
        migrations.AddField(
            model_name='waitlist',
            name='confirmed',
            field=models.BooleanField(default=True),
        ),
    ]
