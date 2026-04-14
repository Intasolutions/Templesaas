import threading

_thread_local = threading.local()

def set_current_tenant_db(db_name):
    _thread_local.tenant_db = db_name

def get_current_tenant_db():
    return getattr(_thread_local, "tenant_db", None)

def clear_current_tenant_db():
    if hasattr(_thread_local, "tenant_db"):
        del _thread_local.tenant_db
