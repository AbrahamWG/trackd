# This file defines the URL routes for my actions app
# It maps URLs like 'actions/' to specific views

from django.urls import path
from .views import ActionListView

urlpatterns = [
    path('actions/', ActionListView.as_view(), name='action-list'),
]
