import { useState } from 'react';
import { useAppSelector, useAppDispatch } from './redux/store.js';
import { logout } from './redux/slices/authSlice.js';
import LoginSignup from './pages/LoginSignup.js';
import Dashboard from './pages/Dashboard.js';
import Projects from './pages/Projects.js';
import Profile from './pages/Profile.js';
import { Shield, LayoutDashboard, Database, User, LogOut, Wallet, Globe } from 'lucide-react';

export default function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'profile'>('dashboard');

  if (!isAuthenticated || !user) {
    return (
      <>
        {/* Apple Liquid Fluid Moving Backgrounds */}
        <div className="liquid-bg-container">
          <div className="liquid-blob liquid-blob-1"></div>
          <div className="liquid-blob liquid-blob-2"></div>
          <div className="liquid-blob liquid-blob-3"></div>
          <div className="liquid-blob liquid-blob-4"></div>
        </div>
        <LoginSignup />
      </>
    );
  }

  return (
    <>
      {/* Apple Liquid Fluid Moving Backgrounds */}
      <div className="liquid-bg-container">
        <div className="liquid-blob liquid-blob-1"></div>
        <div className="liquid-blob liquid-blob-2"></div>
        <div className="liquid-blob liquid-blob-3"></div>
        <div className="liquid-blob liquid-blob-4"></div>
      </div>

      {/* Floating reflective layout wrapper */}
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Premium Header Layout */}
        <header className="liquid-glass-card" 
                style={{ 
                  margin: '16px 24px', 
                  borderRadius: '16px', 
                  padding: '12px 24px', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  zIndex: 40
                }}>
          
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setActiveTab('dashboard')}>
            <div style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '10px', 
              background: 'rgba(0, 255, 204, 0.08)',
              border: '1px solid rgba(0, 255, 204, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Shield size={20} style={{ color: '#00ffcc' }} />
            </div>
            <div>
              <span className="liquid-glow-text" style={{ fontSize: '18px', fontWeight: 800 }}>DriveShare</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>CONSOLE</span>
            </div>
          </div>

          {/* Navigation links */}
          <nav style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`liquid-glass-btn ${activeTab === 'dashboard' ? 'liquid-glass-btn-primary' : 'liquid-glass-btn-secondary'}`}
              style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '10px' }}
            >
              <LayoutDashboard size={16} />
              Dashboard
            </button>
            
            <button
              onClick={() => setActiveTab('projects')}
              className={`liquid-glass-btn ${activeTab === 'projects' ? 'liquid-glass-btn-primary' : 'liquid-glass-btn-secondary'}`}
              style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '10px' }}
            >
              <Database size={16} />
              Buckets CRUD
            </button>
            
            <button
              onClick={() => setActiveTab('profile')}
              className={`liquid-glass-btn ${activeTab === 'profile' ? 'liquid-glass-btn-primary' : 'liquid-glass-btn-secondary'}`}
              style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '10px' }}
            >
              <User size={16} />
              Billing & Profile
            </button>
          </nav>

          {/* Right Action Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            
            {/* Quick Wallet balance */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: 'rgba(0,0,0,0.2)', 
              padding: '6px 14px', 
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.04)',
              fontSize: '13px',
              fontFamily: 'var(--font-mono)'
            }}>
              <Wallet size={14} style={{ color: '#00ffcc' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Balance:</span>
              <span style={{ color: '#00ffcc', fontWeight: 700 }}>₹{user.walletBalanceINR.toLocaleString('en-IN')}</span>
            </div>

            {/* Profile Avatar & Logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div 
                onClick={() => setActiveTab('profile')}
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #a78bfa 0%, #3B82F6 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}>
                {user.name[0].toUpperCase()}
              </div>

              <button 
                onClick={() => dispatch(logout())}
                className="liquid-glass-btn liquid-glass-btn-danger"
                style={{ padding: '8px', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.25)' }}
                title="Disconnect Console"
              >
                <LogOut size={16} />
              </button>
            </div>

          </div>

        </header>

        {/* Master Page Switcher Body Container */}
        <main style={{ flex: 1, padding: '0 24px 24px 24px', zIndex: 10 }}>
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'projects' && <Projects />}
          {activeTab === 'profile' && <Profile />}
        </main>

        {/* Dynamic discrete tech footer */}
        <footer style={{ 
          margin: '0 24px 16px 24px', 
          borderTop: '1px solid rgba(255,255,255,0.04)', 
          paddingTop: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '11px',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Globe size={12} />
            <span>Geo-Routing Engine: ACTIVE (ap-south-1)</span>
          </div>
          <span>DriveShare Console.in v2.1.0 • P2P Storage Ledger Mesh</span>
        </footer>

      </div>
    </>
  );
}
