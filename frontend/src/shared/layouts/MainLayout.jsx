import { Outlet, Link, useLocation } from 'react-router-dom';

const SidebarItem = ({ to, icon, label, active }) => (
    <Link
        to={to}
        style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.75rem 1rem',
            color: active ? '#fff' : '#AAB7B8',
            backgroundColor: active ? 'rgba(255,255,255,0.1)' : 'transparent',
            borderRadius: '8px',
            marginBottom: '0.25rem',
            transition: 'all 0.2s'
        }}
    >
        <span style={{ marginRight: '0.75rem' }}>{icon}</span>
        <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{label}</span>
    </Link>
);

const MainLayout = () => {
    const location = useLocation();
    const path = location.pathname;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-body)' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                backgroundColor: 'var(--color-bg-sidebar)',
                color: 'white',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center' }}>
                    <div style={{
                        width: '40px', height: '40px',
                        borderRadius: '50%', background: 'var(--color-primary)',
                        marginRight: '0.75rem'
                    }}></div>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', color: '#fff', margin: 0 }}>TempleSoft</h2>
                        <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>Premium Admin</span>
                    </div>
                </div>

                <nav style={{ flex: 1 }}>
                    <SidebarItem to="/dashboard" label="Dashboard" icon="📊" active={path === '/dashboard'} />
                    <SidebarItem to="/devotees" label="Devotees" icon="👥" active={path.includes('devotee')} />
                    <SidebarItem to="/pooja" label="Pooja & Booking" icon="🙏" active={path.includes('pooja')} />
                    <SidebarItem to="/bookings" label="Bookings History" icon="�" active={path.includes('booking')} />
                    <SidebarItem to="/hundi" label="Hundi Collection" icon="🏺" active={path.includes('hundi')} />
                    <SidebarItem to="/donations" label="Donations" icon="💰" active={path.includes('donation')} />
                    <SidebarItem to="/inventory" label="Inventory" icon="📦" active={path.includes('inventory')} />
                    <SidebarItem to="/events" label="Events" icon="🎪" active={path.includes('event')} />
                    <SidebarItem to="/staff" label="Staff & Duty" icon="👮" active={path.includes('staff')} />
                    <SidebarItem to="/finance" label="Financial Reports" icon="📈" active={path.includes('finance')} />
                </nav>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                    <SidebarItem to="/settings" label="Settings" icon="⚙️" />
                    <SidebarItem to="/logout" label="Logout" icon="🚪" />
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                <header style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginBottom: '2rem'
                }}>
                    <h1 style={{ fontSize: '1.75rem', margin: 0 }}>
                        {path === '/' ? 'Overview' : path.substring(1).charAt(0).toUpperCase() + path.slice(2).split('/')[0]}
                    </h1>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button className="btn" style={{ background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>🔔</button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Admin User</div>
                                <div style={{ fontSize: '0.8rem', color: '#666' }}>Temple Manager</div>
                            </div>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '50%', background: '#2C3E50',
                                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>A</div>
                        </div>
                    </div>
                </header>

                <div className="fade-in">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
