import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdminContext } from './AdminContext';
import { 
  LayoutGrid, ShoppingBag, ShoppingCart, Box, 
  BarChart3, Tag, BotMessageSquare, LogOut, User, Coffee 
} from 'lucide-react';

const AdminLayout = () => {
  const { admin, loading, logout } = useAdminContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.style.zoom = "90%"; 
    document.body.style.backgroundColor = "var(--admin-bg)";
    document.documentElement.style.backgroundColor = "var(--admin-bg)";

    if (!loading && !admin && location.pathname.startsWith('/admin')) {
      navigate('/admin/login', { replace: true });
    }
  }, [admin, loading, location.pathname, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (loading) return null;
  if (!admin && location.pathname.startsWith('/admin')) return null;

  const menuItems = [
    { path: '/admin/dashboard', name: 'Dashboard', icon: <LayoutGrid size={18} /> },
    { path: '/admin/orders', name: 'Orders', icon: <ShoppingCart size={18} /> },
    { path: '/admin/products', name: 'Products', icon: <ShoppingBag size={18} /> },
    { path: '/admin/inventory', name: 'Inventory', icon: <Box size={18} /> },
    { path: '/admin/analytics', name: 'Analytics', icon: <BarChart3 size={18} /> },
    { path: '/admin/offers', name: 'Offers', icon: <Tag size={18} /> },
    { path: '/admin/ai-assistant', name: 'AI Assistant', icon: <BotMessageSquare size={18} /> },
  ];

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      width: '100%',
      backgroundColor: 'var(--admin-bg)', 
      fontFamily: "'Inter', sans-serif",
      margin: 0, padding: 0
    }}>
      <div style={{ 
        width: '260px', backgroundColor: 'var(--admin-card)', position: 'fixed', 
        height: '100vh', borderRight: '1px solid var(--admin-border)', zIndex: 1000, 
        display: 'flex', flexDirection: 'column', boxShadow: '4px 0 15px rgba(0,0,0,0.4)'
      }}>
        <div style={{ padding: '30px 20px', textAlign: 'center' }}>
          <div style={{ color: 'var(--admin-accent)', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
            <Coffee size={36} />
          </div>
          <h1 style={{ 
            margin: 0, fontSize: '1.1rem', color: '#fff', fontWeight: '900', 
            letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'DM Serif Display', serif"
          }}>
            Faculty <span style={{ color: 'var(--admin-accent)' }}>Coffee</span>
          </h1>
        </div>
        
        <nav style={{ marginTop: '20px', flexGrow: 1 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} style={{ 
                display: 'flex', alignItems: 'center', gap: '14px', padding: '15px 25px', 
                color: isActive ? '#fff' : 'var(--admin-text)', 
                textDecoration: 'none',
                backgroundColor: isActive ? 'rgba(196, 164, 132, 0.12)' : 'transparent',
                borderLeft: isActive ? '4px solid var(--admin-accent)' : '4px solid transparent',
                fontSize: '0.9rem',
                fontWeight: isActive ? '700' : '500',
                margin: '2px 0',
                transition: 'all 0.3s ease'
              }}>
                {item.icon} {item.name}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '25px', borderTop: '1px solid var(--admin-border)' }}>
          <button onClick={handleLogout} style={{ 
            display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--admin-accent)', 
            cursor: 'pointer', border: 'none', backgroundColor: 'transparent', 
            fontSize: '0.9rem', fontWeight: '700', width: '100%', transition: '0.3s'
          }}>
            <LogOut size={18} /> Logout Session
          </button>
        </div>
      </div>

      <div style={{ 
        marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column', 
        minHeight: '100vh', backgroundColor: 'var(--admin-bg)' 
      }}>
        <header style={{ 
          height: '80px', backgroundColor: 'var(--admin-card)', borderBottom: '1px solid var(--admin-border)', 
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', 
          padding: '0 40px', position: 'sticky', top: 0, zIndex: 999 
        }}>
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: '15px', 
            backgroundColor: 'var(--admin-bg)', padding: '8px 20px', borderRadius: '12px',
            border: '1px solid var(--admin-border)'
          }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, color: '#fff', fontSize: '0.9rem', fontWeight: '700' }}>{admin?.name}</p>
              <p style={{ margin: 0, color: 'var(--admin-accent)', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' }}>
                {admin?.role || 'Administrator'}
              </p>
            </div>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '10px', 
              backgroundColor: 'var(--admin-accent)', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', color: 'var(--admin-bg)'
            }}>
              <User size={22} strokeWidth={2.5} />
            </div>
          </div>
        </header>

        <main style={{ padding: '40px', flex: 1, backgroundColor: 'var(--admin-bg)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
