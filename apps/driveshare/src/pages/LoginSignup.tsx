import React, { useState } from 'react';
import { useAppDispatch } from '../redux/store.js';
import { loginSuccess } from '../redux/slices/authSlice.js';
import { Shield, Key, Mail, User, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LoginSignup() {
  const dispatch = useAppDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'CCTV_OPERATOR' | 'FOUNDER' | 'ENTERPRISE_CLIENT'>('CCTV_OPERATOR');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fillCredentials = (demoEmail: string, demoRole?: 'CCTV_OPERATOR' | 'FOUNDER' | 'ENTERPRISE_CLIENT') => {
    setEmail(demoEmail);
    setPassword('demopass123');
    if (!isLogin) {
      setName(demoEmail.startsWith('founder') ? 'Founder Executive' : 'CCTV Operator Principal');
      if (demoRole) setRole(demoRole);
    }
    setErrorMessage('');
  };

  const handleGoogleSSO = () => {
    setIsSubmitting(true);
    setErrorMessage('');
    
    setTimeout(() => {
      const dummyUser = {
        id: 'user_sso_99',
        email: 'sso.executive@foundergrid.in',
        name: 'Bharat CCTV Operations Hub',
        role: 'ENTERPRISE_CLIENT' as const,
        createdAt: new Date().toISOString(),
        walletBalanceINR: 15500
      };
      
      dispatch(loginSuccess({
        user: dummyUser,
        token: 'sso_dummy_jwt_token_2026_driveshare'
      }));
      setIsSubmitting(false);
      
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#a78bfa', '#7c3aed', '#c084fc', '#6366f1']
      });
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Make name and other fields extremely robust and fallback-safe so registration never fails!
    if (!email || !password) {
      setErrorMessage('Please enter both your email address and passphrase.');
      return;
    }

    if (!email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      // If name is left blank during registration, fall back dynamically to the email prefix!
      const resolvedName = isLogin 
        ? (email.startsWith('founder') ? 'Founder Executive' : 'CCTV Operator Principal')
        : (name.trim() || email.split('@')[0] || 'Sovereign Cloud Principal');
      
      const resolvedRole = isLogin
        ? (email.startsWith('founder') ? ('FOUNDER' as const) : ('CCTV_OPERATOR' as const))
        : role;

      const dummyUser = {
        id: `user_${Date.now()}`,
        email,
        name: resolvedName,
        role: resolvedRole,
        createdAt: new Date().toISOString(),
        walletBalanceINR: resolvedRole === 'FOUNDER' ? 50000 : 5500
      };

      dispatch(loginSuccess({
        user: dummyUser,
        token: 'mock_jwt_auth_token_for_standalone_console'
      }));
      
      setIsSubmitting(false);
      
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#a78bfa', '#7c3aed', '#c084fc']
      });
    }, 1000);
  };

  return (
    <div className="min-height-100vh flex items-center justify-center p-6 relative" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Spacious, luxurious glass container card */}
      <div className="liquid-glass-card w-full max-w-lg p-10 relative animate-fade-in z-10" style={{ maxWidth: '520px', width: '100%', padding: '48px' }}>
        
        {/* Floating Reflective Header Logo */}
        <div className="flex flex-col items-center mb-8 text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '36px', textAlign: 'center' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 pulse-glow" 
               style={{ 
                 width: '56px', 
                 height: '56px', 
                 borderRadius: '18px', 
                 background: 'rgba(167, 139, 250, 0.08)',
                 border: '1px solid rgba(167, 139, 250, 0.25)',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 marginBottom: '16px'
               }}>
            <Shield size={28} style={{ color: '#c084fc' }} />
          </div>
          <h2 className="liquid-glow-text" style={{ fontSize: '32px', fontWeight: 800, marginBottom: '6px' }}>DriveShare</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
            Sovereign Indian Cloud Portal
          </p>
        </div>

        {/* Demo Credentials Fast-Access Bar */}
        <div className="mb-6 p-4 rounded-xl border border-purple-500/15 bg-purple-950/20" 
             style={{ 
               marginBottom: '28px', 
               padding: '16px', 
               borderRadius: '14px', 
               border: '1px solid rgba(167, 139, 250, 0.15)', 
               backgroundColor: 'rgba(124, 58, 237, 0.04)',
               fontSize: '13px'
             }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c084fc', fontWeight: 700, marginBottom: '10px' }}>
            <AlertCircle size={15} />
            <span>Developer Sandbox Credentials</span>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '12px', fontSize: '12px', lineHeight: '1.5' }}>
            Click an identity context below to auto-populate production sandbox credentials:
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => fillCredentials('founder@company.in', 'FOUNDER')}
              className="liquid-glass-btn"
              style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              Founder Login
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('operator@cctv.in', 'CCTV_OPERATOR')}
              className="liquid-glass-btn"
              style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              Surveillance Operator
            </button>
          </div>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 text-sm animate-fade-in"
               style={{ 
                 marginBottom: '24px', 
                 padding: '14px', 
                 borderRadius: '12px', 
                 border: '1px solid rgba(239, 68, 68, 0.2)', 
                 backgroundColor: 'rgba(239, 68, 68, 0.08)', 
                 color: '#fca5a5', 
                 fontSize: '13px' 
               }}>
            {errorMessage}
          </div>
        )}

        {/* Auth form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {!isLogin && (
            <div>
              <label className="liquid-glass-label">Full Name</label>
              <div className="relative" style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '18px', color: 'var(--text-muted)' }}>
                  <User size={18} />
                </span>
                <input
                  type="text"
                  placeholder="e.g. Adarsh Sharma (Optional)"
                  className="liquid-glass-input w-full"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', paddingLeft: '48px' }}
                />
              </div>
            </div>
          )}

          <div>
            <label className="liquid-glass-label">Email Address</label>
            <div className="relative" style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '16px', top: '18px', color: 'var(--text-muted)' }}>
                <Mail size={18} />
              </span>
              <input
                type="email"
                placeholder={isLogin ? "operator@cctv.in or founder@company.in" : "you@company.in"}
                className="liquid-glass-input w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', paddingLeft: '48px' }}
                required
              />
            </div>
          </div>

          <div>
            <label className="liquid-glass-label">Secret Passphrase</label>
            <div className="relative" style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '16px', top: '18px', color: 'var(--text-muted)' }}>
                <Key size={18} />
              </span>
              <input
                type="password"
                placeholder="••••••••••••"
                className="liquid-glass-input w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', paddingLeft: '48px' }}
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="liquid-glass-label">Industry Profile</label>
              <select
                className="liquid-glass-input w-full"
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                style={{ width: '100%', color: 'var(--text-primary)', cursor: 'pointer' }}
              >
                <option value="CCTV_OPERATOR" style={{ background: '#0e0821' }}>CCTV & Hardware Surveillance Provider</option>
                <option value="FOUNDER" style={{ background: '#0e0821' }}>Founder & Emerging Startup</option>
                <option value="ENTERPRISE_CLIENT" style={{ background: '#0e0821' }}>Sovereign Enterprise / Government Agency</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="liquid-glass-btn liquid-glass-btn-primary w-full mt-2"
            style={{ width: '100%', marginTop: '8px' }}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="pulse-glow" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ffffff' }}></span>
                Verifying Credentials Ledger...
              </span>
            ) : (
              <span className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isLogin ? 'Establish Handshake' : 'Provision Sovereign Account'}
                <Sparkles size={16} />
              </span>
            )}
          </button>
        </form>

        {/* Divider Grid */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '28px 0', gap: '14px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }}></div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>FEDERATED SSO Broker</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }}></div>
        </div>

        {/* Google SSO Button */}
        <button
          type="button"
          onClick={handleGoogleSSO}
          disabled={isSubmitting}
          className="liquid-glass-btn liquid-glass-btn-secondary w-full"
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
            <path
              fill="#A78BFA"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#8B5CF6"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#C084FC"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#6366F1"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google Enterprise IAM Single Sign-On
        </button>

        {/* Switch mode */}
        <div className="mt-8 text-center" style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            {isLogin ? "New to Sovereign Cloud? " : "Already registered? "}
          </span>
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="liquid-glow-cyan"
            style={{ 
              background: 'none', 
              border: 'none', 
              fontWeight: '700', 
              cursor: 'pointer',
              marginLeft: '4px',
              fontFamily: 'var(--font-heading)'
            }}
          >
            {isLogin ? 'Register Organization' : 'Authenticate Console'}
          </button>
        </div>

      </div>
    </div>
  );
}
