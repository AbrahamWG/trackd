# This file contains my API endpoints (GET, POST, PUT, DELETE)
# When someone visits a URL like /api/actions/, Django calls a function here
# The function returns JSON data back to the user

# Views handle HTTP requests and return responses
# I'll create my API views here

from rest_framework.views import APIView
from rest_framework.response import Response

class ActionListView(APIView):
    """
    Simple GET endpoint that returns a list of actions
    When someone visits /api/actions/, this view returns JSON data
    """
    
    def get(self, request):
        # Hardcoded data for now - we'll read from JSON file later
        actions = [
            {
                "id": 1,
                "action": "Jakarta to Bandung taxi ride",
                "date": "2025-01-15",
                "vehicle_id": "TAXI-001",
                "origin": "Jakarta",
                "destination": "Bandung",
                "distance_km": 150.0,
                "co2_emitted_kg": 33.0
            }
        ]
        return Response(actions)
