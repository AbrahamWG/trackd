# This file tells Django about my 'actions' app
# It registers the app so Django knows it exists

from django.apps import AppConfig


class ActionsConfig(AppConfig):
    """Configuration for the actions app (sustainability actions API)"""
    name = "actions"
