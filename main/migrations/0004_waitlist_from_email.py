# Generated by Django 3.0.6 on 2020-05-19 18:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0003_waitlist_confirmed'),
    ]

    operations = [
        migrations.AddField(
            model_name='waitlist',
            name='from_email',
            field=models.EmailField(blank=True, max_length=254, null=True),
        ),
    ]
