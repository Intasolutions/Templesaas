from rest_framework import permissions

class ModulePermission(permissions.BasePermission):
    """
    Highly granular permission check for SaaS Modules.
    Checks user.profile.module_permissions for 'view', 'edit', 'delete'.
    """
    
    # Map app labels/URL prefixes to module IDs if they differ
    MODULE_MAP = {
        'shipments': 'shipments',
        'shipping': 'shipments',
        'pooja': 'pooja',
        'bookings': 'bookings',
        'donations': 'donations',
        'hundi': 'hundi',
        'inventory': 'inventory',
        'finance': 'finance',
        'events': 'events',
        'staff': 'staff',
        'users': 'users',
        'devotees': 'devotees',
        'assets': 'assets',
        'integrations': 'integrations',
        'tv': 'tv',
    }

    # Paths that should always be accessible to authenticated users
    WHITELISTED_PATHS = [
        'users/me',
        'users/profile',
        'core/tenant',
        'shipping',
        'shipments',
    ]

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False

        # 1. Superusers and Temple Admins have full access
        profile = getattr(user, 'profile', None)
        if user.is_superuser or (profile and profile.role == 'temple_admin') or (profile and profile.module_permissions.get('all')):
            return True

        if not profile:
            return False

        # 2. Extract module name from URL
        path = request.path.strip('/')
        
        # Check whitelist first
        for white_path in self.WHITELISTED_PATHS:
            if white_path in path:
                return True

        path_parts = path.split('/')
        module_id = None
        
        # Detect module from /api/<module>/...
        if len(path_parts) > 1 and path_parts[0] == 'api':
            app_name = path_parts[1]
            module_id = self.MODULE_MAP.get(app_name)
        
        # If we can't identify a specific module, we allow SAFE methods (View only)
        # but block destructive ones just in case.
        if not module_id:
            return request.method in permissions.SAFE_METHODS
        
        perms = profile.module_permissions.get(module_id, [])

        # 3. Method-based Check
        if request.method in permissions.SAFE_METHODS:
            return 'view' in perms
        
        if request.method in ['POST', 'PUT', 'PATCH']:
            # For creation/update, we check 'edit'
            return 'edit' in perms
            
        if request.method == 'DELETE':
            # For deletion, we check 'delete'
            return 'delete' in perms

        return False
