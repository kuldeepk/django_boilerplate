from django.apps import AppConfig
from suit.apps import DjangoSuitConfig
from suit.menu import ParentItem, ChildItem


class MainConfig(AppConfig):
    name = 'main'


class SuitConfig(DjangoSuitConfig):
    layout = 'vertical'
    menu = (
        ParentItem('Users', children=[
            ChildItem(model='auth.user'),
            ChildItem(model='main.invite'),
            ChildItem(model='main.userprofile'),
            ChildItem(model='main.waitlist'),
        ], icon='fa fa-users'),
    )

    def ready(self):
        super(SuitConfig, self).ready()
