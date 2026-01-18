"""
WSGI config for trackd_project project.

This file is needed for Django's development server to run.
Even though we're not deploying to production yet, Django needs this.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "trackd_project.settings")

application = get_wsgi_application()
