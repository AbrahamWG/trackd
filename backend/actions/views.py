# This file contains my API endpoints (GET, POST, PUT, DELETE)
# When someone visits a URL like /api/actions/, Django calls a function here
# The function returns JSON data back to the user

# Views handle HTTP requests and return responses
# I'll create my API views here

import json
from pathlib import Path
from rest_framework.views import APIView
from rest_framework.response import Response

class ActionListView(APIView):
    """
    Simple GET endpoint that returns a list of actions
    When someone visits /api/actions/, this view returns JSON data
    """
    
    def get(self, request):
        # Read data from JSON file
        # Get the path to the JSON file (in backend/data/fleet_actions.json)
        base_dir = Path(__file__).resolve().parent.parent
        json_file = base_dir / 'data' / 'fleet_actions.json'
        
        # Read and parse JSON file
        try:
            with open(json_file, 'r') as f:
                actions = json.load(f)
        except FileNotFoundError:
            # If file doesn't exist, return empty list
            actions = []
        
        return Response(actions)
