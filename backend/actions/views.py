# This file contains my API endpoints (GET, POST, PUT, DELETE)
# When someone visits a URL like /api/actions/, Django calls a function here
# The function returns JSON data back to the user

# Views handle HTTP requests and return responses
# I'll create my API views here

import json
from pathlib import Path
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class ActionListView(APIView):
    """
    GET /api/actions/ - Returns list of all actions
    POST /api/actions/ - Creates a new action
    """
    
    def _get_json_file_path(self):
        """
        Helper method to get the path to the JSON file.
        
        Why use a helper? We need to read/write the JSON file in multiple methods
        (GET, POST, PUT, PATCH, DELETE). Instead of repeating the file path logic
        everywhere, we define it once here. If the file location changes, we only
        need to update it in one place.
        """
        base_dir = Path(__file__).resolve().parent.parent
        return base_dir / 'data' / 'fleet_actions.json'
    
    def _read_actions(self):
        """
        Helper method to read actions from JSON file.
        
        Why use a helper? We read from the JSON file in GET, POST, PUT, PATCH, DELETE.
        This avoids repeating the same file reading code (open, json.load, error handling)
        in every method. Makes code DRY (Don't Repeat Yourself) and easier to maintain.
        
        Returns:
            list: List of action dictionaries, or empty list if file doesn't exist
        """
        json_file = self._get_json_file_path()
        try:
            with open(json_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return []
    
    def _save_actions(self, actions):
        """
        Helper method to save actions to JSON file.
        
        Why use a helper? We save to the JSON file in POST, PUT, PATCH, DELETE.
        This avoids repeating the same file writing code (create directory, open, json.dump)
        in every method. Makes code DRY and easier to maintain.
        
        Why save? Without saving, data only exists in memory and disappears when the server
        restarts. Saving to a file makes data persistent - it survives server restarts and
        can be retrieved later.
        
        Args:
            actions (list): List of action dictionaries to save
        """
        json_file = self._get_json_file_path()
        # Create data directory if it doesn't exist
        json_file.parent.mkdir(parents=True, exist_ok=True)
        with open(json_file, 'w') as f:
            json.dump(actions, f, indent=2)
    
    def get(self, request):
        """GET /api/actions/ - Returns all actions"""
        actions = self._read_actions()
        return Response(actions)
    
    def post(self, request):
        """POST /api/actions/ - Creates a new action"""
        # Get the data from the request
        new_action = request.data
        
        # Read existing actions
        actions = self._read_actions()
        
        # Generate new ID (find the highest ID and add 1)
        if actions:
            max_id = max(action.get('id', 0) for action in actions)
            new_id = max_id + 1
        else:
            new_id = 1
        
        # Add ID to the new action
        new_action['id'] = new_id
        
        # Auto-calculate CO2 if fuel_consumed_liters is provided
        if 'fuel_consumed_liters' in new_action and 'co2_emitted_kg' not in new_action:
            fuel = new_action['fuel_consumed_liters']
            new_action['co2_emitted_kg'] = fuel * 2.64
        
        # Add the new action to the list
        actions.append(new_action)
        
        # Save back to JSON file
        self._save_actions(actions)
        
        # Return the created action with 201 status
        return Response(new_action, status=status.HTTP_201_CREATED)


class ActionDetailView(APIView):
    """
    GET /api/actions/<id>/ - Get single action by ID
    PUT /api/actions/<id>/ - Full update of an action
    PATCH /api/actions/<id>/ - Partial update of an action
    DELETE /api/actions/<id>/ - Delete an action
    """
    
    def _get_json_file_path(self):
        """
        Helper method to get the path to the JSON file.
        
        Why use a helper? We need to read/write the JSON file in multiple methods
        (GET, PUT, PATCH, DELETE). Instead of repeating the file path logic
        everywhere, we define it once here. If the file location changes, we only
        need to update it in one place.
        """
        base_dir = Path(__file__).resolve().parent.parent
        return base_dir / 'data' / 'fleet_actions.json'
    
    def _read_actions(self):
        """
        Helper method to read actions from JSON file.
        
        Why use a helper? We read from the JSON file in GET, PUT, PATCH, DELETE.
        This avoids repeating the same file reading code (open, json.load, error handling)
        in every method. Makes code DRY (Don't Repeat Yourself) and easier to maintain.
        
        Returns:
            list: List of action dictionaries, or empty list if file doesn't exist
        """
        json_file = self._get_json_file_path()
        try:
            with open(json_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return []
    
    def _save_actions(self, actions):
        """
        Helper method to save actions to JSON file.
        
        Why use a helper? We save to the JSON file in PUT, PATCH, DELETE.
        This avoids repeating the same file writing code (create directory, open, json.dump)
        in every method. Makes code DRY and easier to maintain.
        
        Why save? Without saving, data only exists in memory and disappears when the server
        restarts. Saving to a file makes data persistent - it survives server restarts and
        can be retrieved later.
        
        Args:
            actions (list): List of action dictionaries to save
        """
        json_file = self._get_json_file_path()
        # Create data directory if it doesn't exist
        json_file.parent.mkdir(parents=True, exist_ok=True)
        with open(json_file, 'w') as f:
            json.dump(actions, f, indent=2)
    
    def get(self, request, pk):
        """
        GET /api/actions/<id>/ - Returns single action by ID
        
        Args:
            pk: Primary key (ID) of the action to retrieve
            
        Returns:
            Response: The action if found, or 404 if not found
        """
        # Read all actions from file
        actions = self._read_actions()
        
        # Find the action with matching ID
        for action in actions:
            if action.get('id') == pk:
                return Response(action)
        
        # If no action found, return 404
        return Response(
            {'error': 'Action not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    def put(self, request, pk):
        """
        PUT /api/actions/<id>/ - Full update of an action
        
        PUT replaces the entire action with new data. You must send ALL fields.
        This is different from PATCH which only updates provided fields.
        
        Args:
            pk: Primary key (ID) of the action to update
            
        Returns:
            Response: Updated action if found, or 404 if not found
        """
        # Read all actions from file
        actions = self._read_actions()
        
        # Find the action with matching ID
        for i, action in enumerate(actions):
            if action.get('id') == pk:
                # Get new data from request
                updated_action = request.data
                
                # Keep the same ID (don't let user change it)
                updated_action['id'] = pk
                
                # Auto-calculate CO2 if fuel_consumed_liters is provided
                if 'fuel_consumed_liters' in updated_action and 'co2_emitted_kg' not in updated_action:
                    fuel = updated_action['fuel_consumed_liters']
                    updated_action['co2_emitted_kg'] = fuel * 2.64
                
                # Replace the old action with the new one
                actions[i] = updated_action
                
                # Save back to file
                self._save_actions(actions)
                
                # Return updated action
                return Response(updated_action)
        
        # If no action found, return 404
        return Response(
            {'error': 'Action not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    def patch(self, request, pk):
        """
        PATCH /api/actions/<id>/ - Partial update of an action
        
        PATCH only updates the fields you send. All other fields stay unchanged.
        This is different from PUT which requires ALL fields and replaces everything.
        
        Example: To update only the "action" field:
        PATCH /api/actions/1/ with {"action": "New action name"}
        All other fields (date, points, etc.) remain unchanged.
        
        Args:
            pk: Primary key (ID) of the action to update
            
        Returns:
            Response: Updated action if found, or 404 if not found
        """
        # Read all actions from file
        actions = self._read_actions()
        
        # Find the action with matching ID
        for i, action in enumerate(actions):
            if action.get('id') == pk:
                # Get update data from request (only fields user wants to change)
                update_data = request.data
                
                # Start with existing action and update only provided fields
                updated_action = {**action, **update_data}
                
                # Always keep the same ID (don't let user change it)
                updated_action['id'] = pk
                
                # Auto-calculate CO2 if fuel_consumed_liters is being updated
                if 'fuel_consumed_liters' in update_data:
                    fuel = updated_action['fuel_consumed_liters']
                    updated_action['co2_emitted_kg'] = fuel * 2.64
                # If fuel wasn't updated but CO2 was manually changed, keep the manual value
                # (user might want to override the calculation)
                
                # Replace the old action with the updated one
                actions[i] = updated_action
                
                # Save back to file
                self._save_actions(actions)
                
                # Return updated action
                return Response(updated_action)
        
        # If no action found, return 404
        return Response(
            {'error': 'Action not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    def delete(self, request, pk):
        """
        DELETE /api/actions/<id>/ - Delete an action
        
        Removes the action from the JSON file permanently.
        
        Args:
            pk: Primary key (ID) of the action to delete
            
        Returns:
            Response: 204 No Content if deleted successfully, or 404 if not found
        """
        # Read all actions from file
        actions = self._read_actions()
        
        # Find and remove the action with matching ID
        for i, action in enumerate(actions):
            if action.get('id') == pk:
                # Remove the action from the list
                deleted_action = actions.pop(i)
                
                # Save back to file
                self._save_actions(actions)
                
                # Return 204 No Content (standard for successful DELETE)
                return Response(status=status.HTTP_204_NO_CONTENT)
        
        # If no action found, return 404
        return Response(
            {'error': 'Action not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )