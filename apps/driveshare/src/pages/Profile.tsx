import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/store.js';
import { updateWalletBalance } from '../redux/slices/authSlice.js';
import { 
  User, 
  Wallet, 
  FileText, 
  TrendingUp,
  Award,
  CreditCard,
  CheckCircle
} from 'lucide-react';
import { formatDate } from '../utils/formatters.js';
import confetti from 'canvas-confetti';

interface InvoiceMock {
  id: string;
  billingPeriod: string;
  amountINR: number;
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
  createdAt: string;
}

const INITIAL_INVOICES_HISTORY: InvoiceMock[] = [
  {
    id: 'inv_10482',
    billingPeriod: 'April 2026',
    amountINR: 1250.00,
    paymentStatus: 'PAID',
    createdAt: new Date('2026-05-01T10:00:00Z').toISOString()
  },
  {
    id: 'inv_10254',
    billingPeriod: 'March 2026',
    amountINR: 980.00,
    paymentStatus: 'PAID',
    createdAt: new Date('2026-04-01T10:00:00Z').toISOString()
  },
  {
    id: 'inv_09841',
    billingPeriod: 'February 2026',
    amountINR: 840.50,
    paymentStatus: 'PAID',
    createdAt: new Date('2026-03-01T10:00:00Z').toISOString()
  }
];

export default function Profile() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  
  const [topUpAmount, setTopUpAmount] = useState('2000');
  const [isProcessingTopUp, setIsProcessingTopUp] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [invoices, setInvoices] = useState<InvoiceMock[]>(INITIAL_INVOICES_HISTORY);

  const [outstandingBill, setOutstandingBill] = useState<{
    id: string;
    billingPeriod: string;
    amountINR: number;
    paymentStatus: 'PENDING';
  } | null>({
    id: 'inv_10799',
    billingPeriod: 'May 2026 (Active decentralized storage leases)',
    amountINR: 1850.00,
    paymentStatus: 'PENDING'
  });

  if (!user) return null;

  // Total money paid historical aggregate
  const totalPaidINR = invoices
    .filter(inv => inv.paymentStatus === 'PAID')
    .reduce((sum, inv) => sum + inv.amountINR, 0);

  const handleTopUpWallet = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(topUpAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    setIsProcessingTopUp(true);
    setSuccessMessage('');
    setErrorMessage('');

    // Simulate Secure Razorpay UPI Instant Payout webhook loop
    setTimeout(() => {
      const newBalance = user.walletBalanceINR + parsedAmount;
      dispatch(updateWalletBalance(newBalance));
      setIsProcessingTopUp(false);
      setSuccessMessage(`Successfully loaded ₹${parsedAmount.toLocaleString('en-IN')} INR via Razorpay UPI!`);
      
      confetti({
        particleCount: 80,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#c084fc', '#8b5cf6']
      });
      
      setTimeout(() => setSuccessMessage(''), 6000);
    }, 1200);
  };

  const handlePayOutstandingBill = () => {
    if (!outstandingBill) return;
    setSuccessMessage('');
    setErrorMessage('');

    if (user.walletBalanceINR < outstandingBill.amountINR) {
      setErrorMessage(`Insufficient pre-paid wallet balance to settle outstanding invoice ${outstandingBill.id} (Outstanding: ₹${outstandingBill.amountINR.toLocaleString('en-IN')} | Wallet: ₹${user.walletBalanceINR.toLocaleString('en-IN')}). Please load your pre-paid wallet first!`);
      return;
    }

    // Deduct from wallet balance
    const newBalance = user.walletBalanceINR - outstandingBill.amountINR;
    dispatch(updateWalletBalance(newBalance));

    // Append paid invoice to ledger history list
    const paidInvoice: InvoiceMock = {
      id: outstandingBill.id,
      billingPeriod: outstandingBill.billingPeriod,
      amountINR: outstandingBill.amountINR,
      paymentStatus: 'PAID',
      createdAt: new Date().toISOString()
    };

    setInvoices(prev => [paidInvoice, ...prev]);
    setOutstandingBill(null); // Cleared!
    setSuccessMessage(`Outstanding bill ${outstandingBill.id} of ₹${outstandingBill.amountINR.toLocaleString('en-IN')} INR successfully settled from pre-paid ledger!`);

    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#a78bfa', '#7c3aed', '#c084fc']
    });
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '12px' }}>
      
      {/* Title */}
      <div>
        <h1 className="liquid-glow-text" style={{ fontSize: '32px', fontWeight: 800, marginBottom: '6px' }}>User Account Profile</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Manage your sovereign industrial parameters, flat INR pricing ledgers, and UPI billing balances
        </p>
      </div>

      {/* Dynamic Alerts feedback */}
      {successMessage && (
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 text-sm animate-fade-in"
             style={{ 
               padding: '14px', 
               borderRadius: '12px', 
               border: '1px solid rgba(52, 211, 153, 0.2)', 
               backgroundColor: 'rgba(52, 211, 153, 0.08)', 
               color: '#34d399', 
               fontSize: '14px',
               fontWeight: 600
             }}>
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 text-sm animate-fade-in"
             style={{ 
               padding: '14px', 
               borderRadius: '12px', 
               border: '1px solid rgba(239, 68, 68, 0.2)', 
               backgroundColor: 'rgba(239, 68, 68, 0.08)', 
               color: '#fca5a5', 
               fontSize: '14px',
               fontWeight: 600
             }}>
          {errorMessage}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        
        {/* Profile details card */}
        <div className="liquid-glass-card p-6" style={{ padding: '24px' }}>
          <h3 className="liquid-glow-text" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User size={20} className="text-cyan" style={{ color: '#c084fc' }} />
            Organization Context
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Logo initials badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, #c084fc 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '20px',
                fontWeight: 800
              }}>
                {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{user.name}</h4>
                <span className="neon-badge neon-badge-cyan" style={{ fontSize: '10px', padding: '2px 8px', marginTop: '4px' }}>
                  {user.role.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Registered Email:</span>
                <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{user.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Provision Date:</span>
                <span style={{ color: 'var(--text-primary)' }}>{formatDate(user.createdAt).split(',')[0]}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Security Level:</span>
                <span style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Award size={14} /> Zero-Knowledge AES-256
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* UPI balance top up wallet */}
        <div className="liquid-glass-card p-6" style={{ padding: '24px' }}>
          <h3 className="liquid-glow-text" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Wallet size={20} style={{ color: '#a78bfa' }} />
            Flat INR Sovereign Wallet
          </h3>

          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px', lineHeight: '1.6' }}>
            DriveShare operates via flat Indian Rupee billing (INR) - completely avoiding credit card dependencies or fluctuating foreign conversions.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)', marginBottom: '24px' }}>
            <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(167, 139, 250, 0.08)', color: '#c084fc' }}>
              <TrendingUp size={24} />
            </div>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Active Pre-Paid Balance
              </span>
              <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#c084fc' }}>₹{user.walletBalanceINR.toLocaleString('en-IN')}.00</h2>
            </div>
          </div>

          {/* Top up Input */}
          <form onSubmit={handleTopUpWallet} style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '16px', color: 'var(--text-muted)', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>₹</span>
              <input
                type="number"
                placeholder="2000"
                className="liquid-glass-input w-full"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                style={{ width: '100%', paddingLeft: '28px' }}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isProcessingTopUp}
              className="liquid-glass-btn liquid-glass-btn-primary"
            >
              {isProcessingTopUp ? 'Connecting Razorpay...' : 'Load Wallet'}
            </button>
          </form>
        </div>

      </div>

      {/* Outstanding Invoice Bill to Pay Section */}
      {outstandingBill ? (
        <div className="liquid-glass-card p-6" 
             style={{ 
               padding: '28px', 
               border: '1px solid rgba(167, 139, 250, 0.3)', 
               background: 'rgba(167, 139, 250, 0.03)',
               borderRadius: '24px' 
             }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c084fc', marginBottom: '8px' }}>
                <CreditCard size={20} />
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Outstanding Storage Bill Due</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '12px' }}>
                Contract ID: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{outstandingBill.id}</span> | Period: <strong>{outstandingBill.billingPeriod}</strong>
              </p>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Billing is compiled automatically in real-time based on India P2P storage lease leases and egress parameters.
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: '180px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Amount Due</span>
              <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#fca5a5', marginBottom: '12px' }}>₹{outstandingBill.amountINR.toLocaleString('en-IN')}.00</h2>
              
              <button 
                onClick={handlePayOutstandingBill}
                className="liquid-glass-btn liquid-glass-btn-primary"
                style={{ background: 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)', border: '1px solid rgba(248,113,113,0.3)', color: '#ffffff' }}
              >
                Pay Outstanding Bill Now
              </button>
            </div>
          </div>

        </div>
      ) : (
        <div className="liquid-glass-card p-6" 
             style={{ 
               padding: '24px', 
               border: '1px solid rgba(52, 211, 153, 0.2)', 
               background: 'rgba(52, 211, 153, 0.02)',
               borderRadius: '20px',
               display: 'flex',
               alignItems: 'center',
               gap: '12px'
             }}>
          <CheckCircle size={24} style={{ color: '#34d399' }} />
          <div>
            <h4 style={{ color: '#34d399', fontWeight: 700 }}>Decentralized Ledger Fully Settled</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No outstanding active storage bills are due at this moment.</p>
          </div>
        </div>
      )}

      {/* Invoice list History */}
      <div className="liquid-glass-card p-6" style={{ padding: '24px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <h3 className="liquid-glow-text" style={{ fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={20} style={{ color: '#c084fc' }} />
            Flat INR Billing Invoices & Receipts Ledger
          </h3>
          <div style={{ fontSize: '13px', background: 'rgba(255,255,255,0.03)', padding: '6px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)', fontFamily: 'var(--font-mono)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Historical Paid Aggregate: </span>
            <strong style={{ color: '#34d399' }}>₹{totalPaidINR.toLocaleString('en-IN')}.00</strong>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>INVOICE ID</th>
                <th style={{ padding: '12px' }}>BILLING PERIOD</th>
                <th style={{ padding: '12px' }}>INVOICED AMOUNT</th>
                <th style={{ padding: '12px' }}>PAYMENT STATUS</th>
                <th style={{ padding: '12px' }}>SETTLEMENT DATE</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', color: 'var(--text-primary)' }}>
                  <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{invoice.id}</td>
                  <td style={{ padding: '12px' }}>{invoice.billingPeriod}</td>
                  <td style={{ padding: '12px', fontWeight: 700 }}>₹{invoice.amountINR.toLocaleString('en-IN')}.00</td>
                  <td style={{ padding: '12px' }}>
                    <span className="neon-badge neon-badge-emerald" style={{ fontSize: '10px', padding: '2px 8px' }}>
                      {invoice.paymentStatus}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{formatDate(invoice.createdAt).split(',')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
