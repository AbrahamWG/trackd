"""
This file maps URLs to my views (like a routing table)
- When someone visits /api/actions/, Django looks here to find which function to call
- I'll add routes here to connect URLs to my API endpoints in views.py

Example: path('api/actions/', views.get_actions) means:
  "When someone visits /api/actions/, run the get_actions function"
"""

"""
URL configuration for trackd_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path

urlpatterns = [
    path("admin/", admin.site.urls),
]
