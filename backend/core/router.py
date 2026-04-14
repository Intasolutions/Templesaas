from core.tenant_context import get_current_tenant_db

class TenantRouter:
    """
    Routes database operations to 'default' (shared) or tenant-specific DBs.
    """
    SHARED_APPS = ['core', 'contenttypes', 'sessions', 'admin'] # core contains Tenant and Plan

    def db_for_read(self, model, **hints):
        if model._meta.app_label in self.SHARED_APPS:
            return 'default'
        return get_current_tenant_db() or 'default'

    def db_for_write(self, model, **hints):
        if model._meta.app_label in self.SHARED_APPS:
            return 'default'
        return get_current_tenant_db() or 'default'

    def allow_relation(self, obj1, obj2, **hints):
        # Allow relations if they are in the same DB or one is shared
        return True

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label in self.SHARED_APPS:
            return db == 'default'
        # Tenant apps should only migrate into tenant DBs
        # BUT 'default' shouldn't receive tenant tables.
        if db == 'default':
            return False
        return True
