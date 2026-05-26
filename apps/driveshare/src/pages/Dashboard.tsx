import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/store.js';
import { startUpload, setPhase, setProgress, updateShard } from '../redux/slices/uploadSlice.js';
import {
  Database,
  ArrowUpRight,
  Cpu,
  Activity,
  File,
  Terminal as TermIcon,
  Share2,
  Network,
  HardDrive,
  Server
} from 'lucide-react';
import { formatBytes } from '../utils/formatters.js';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const upload = useAppSelector(state => state.upload);
  const projects = useAppSelector(state => state.projects.items);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  // Compute overall dynamic aggregates
  const totalStorageBytes = projects.reduce((acc, p) => acc + BigInt(p.currentStorageBytes), BigInt(0));
  const totalEgressBytes = projects.reduce((acc, p) => acc + BigInt(p.totalEgressBytes), BigInt(0));

  // Rented/Owned Storage Configuration
  const rentedStorageGB = 500; // The client has rented/leased 500 GB from India's P2P Grid
  const usedStorageGB = Math.max(
    144.6, // base seed storage for CCTV feeds and metadata
    Number(totalStorageBytes) / (1024 * 1024 * 1024)
  );
  const freeStorageGB = Math.max(0, rentedStorageGB - usedStorageGB);
  const usedPercentage = Math.min(100, Math.round((usedStorageGB / rentedStorageGB) * 100));

  // Dynamic breakdown sectors
  const cctvUsageGB = Math.round(usedStorageGB * 0.65);
  const databaseUsageGB = Math.round(usedStorageGB * 0.20);
  const redundancyUsageGB = Math.round(usedStorageGB * 0.15);

  // Simulated AWS billing vs DriveShare billing
  const storageGB = Number(totalStorageBytes) / (1024 * 1024 * 1024);
  const egressGB = Number(totalEgressBytes) / (1024 * 1024 * 1024);
  const awsCostEstimated = (storageGB * 1.9) + (egressGB * 7.5);
  const driveShareCostEstimated = (storageGB * 0.45);
  const totalSavings = awsCostEstimated - driveShareCostEstimated;

  const addLog = (msg: string) => {
    setTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      addLog(`File queued: "${file.name}" (${formatBytes(file.size)})`);
    }
  };

  const handleLaunchUpload = async () => {
    if (!selectedFile || isSimulating) return;

    setIsSimulating(true);
    setTerminalLogs([]);
    dispatch(startUpload({
      fileName: selectedFile.name,
      fileSize: selectedFile.size
    }));

    // PHASE 1: TOKEN HANDSHAKE
    addLog(`Initiating Sovereign Token Handshake...`);
    addLog(`Resolving active Indian node routes via DriveShare Relational Registry...`);

    await new Promise(r => setTimeout(r, 1200));
    addLog(`Handshake resolved. Found 8 active volunteer node laptops in the Bharat cloud matrix.`);

    // PHASE 2: NAT PUNCHING
    dispatch(setPhase('NAT_PUNCHING'));
    dispatch(setProgress(20));
    addLog(`Starting WebRTC NAT Punching tunnel pathways...`);
    addLog(`Swapping SDP offer/answer candidates with Indian Nodes...`);

    for (let i = 0; i < 8; i++) {
      await new Promise(r => setTimeout(r, 200));
      dispatch(updateShard({ index: i, progress: 10, status: 'CONNECTING' }));
      addLog(`WebRTC Channel opened to Node #${i + 1} [IP: ${upload.activeNodeIps[i] || '103.45.201.12'}]`);
    }

    // PHASE 3: WASM SHATTERING
    await new Promise(r => setTimeout(r, 600));
    dispatch(setPhase('WASM_SHATTERING'));
    dispatch(setProgress(40));
    addLog(`Executing local Rust-compiled WebAssembly Erasure Coding container...`);
    addLog(`Applying Reed-Solomon XOR formula: splitting file into 8 cryptographic shards.`);

    await new Promise(r => setTimeout(r, 1000));
    addLog(`Erasure coding completed in 72ms. Generated shards ready for direct peer streams.`);

    // PHASE 4: P2P STREAMING
    dispatch(setPhase('P2P_STREAMING'));
    addLog(`Broadcasting direct parallel WebRTC P2P streams...`);

    const streamDuration = 3500;
    const intervalTime = 100;
    const steps = streamDuration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progressPercent = 40 + Math.min((currentStep / steps) * 45, 45);
      dispatch(setProgress(Math.round(progressPercent)));

      // Update individual shard progress
      for (let i = 0; i < 8; i++) {
        const shardProgress = Math.min((currentStep / steps) * 100 + (Math.random() * 8), 100);
        const status = shardProgress >= 100 ? 'VERIFYING' : 'STREAMING';
        dispatch(updateShard({
          index: i,
          progress: Math.round(shardProgress),
          status: status as any
        }));
      }

      if (currentStep >= steps) {
        clearInterval(timer);
        completePhase5();
      }
    }, intervalTime);

    const completePhase5 = async () => {
      // PHASE 5: CONFIRM REGISTRY
      dispatch(setPhase('CONFIRM_REGISTRY'));
      dispatch(setProgress(90));
      addLog(`Tunnels closed. Initiating cryptographic shard audit checks...`);
      addLog(`Broadcasting metadata schema registry confirmation to postgres API...`);

      for (let i = 0; i < 8; i++) {
        dispatch(updateShard({ index: i, progress: 100, status: 'SUCCESS' }));
      }

      await new Promise(r => setTimeout(r, 1500));
      dispatch(setPhase('COMPLETED'));
      dispatch(setProgress(100));
      addLog(`File successfully distributed inside Bharat P2P storage mesh. Registry status: VERIFIED.`);
      setIsSimulating(false);
    };
  };

  return (
    <div className="flex flex-col gap-6" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '12px' }}>

      {/* Top Welcome Title Banner */}
      <div className="flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="liquid-glow-text" style={{ fontSize: '32px', fontWeight: 800, marginBottom: '6px' }}>Network Telemetry</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Real-time decentralized grid analytics & client sharding control
          </p>
        </div>
        <div className="neon-badge neon-badge-cyan animate-pulse">
          <Activity size={14} className="pulse-glow" style={{ color: '#c084fc' }} />
          BHARAT GRID ONLINE
        </div>
      </div>

      {/* Rented Capacity Allocation visual section */}
      <div className="liquid-glass-card p-6" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(167, 139, 250, 0.08)', color: '#c084fc', border: '1px solid rgba(167, 139, 250, 0.2)' }}>
              <HardDrive size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Storage Capacity Allocation</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Decentralized rented space leased from volunteer nodes ({usedPercentage}% utilized)</p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#c084fc' }}>{usedStorageGB.toFixed(1)} GB</span>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}> / {rentedStorageGB} GB Rented</span>
          </div>
        </div>

        {/* Multi-Segment Custom Progress Track */}
        <div style={{ height: '14px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden', display: 'flex', marginBottom: '20px' }}>
          <div style={{ width: `${(cctvUsageGB / rentedStorageGB) * 100}%`, background: 'linear-gradient(90deg, #c084fc 0%, #8b5cf6 100%)' }} title={`CCTV Storage: ${cctvUsageGB} GB`} />
          <div style={{ width: `${(databaseUsageGB / rentedStorageGB) * 100}%`, background: '#6366f1' }} title={`Log Database: ${databaseUsageGB} GB`} />
          <div style={{ width: `${(redundancyUsageGB / rentedStorageGB) * 100}%`, background: '#818cf8' }} title={`Reed-Solomon Parity: ${redundancyUsageGB} GB`} />
          <div style={{ flex: 1, background: 'transparent' }} />
        </div>

        {/* Legend metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#c084fc' }}></span>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>CCTV Feeds: </span>
              <strong style={{ color: 'var(--text-primary)' }}>{cctvUsageGB} GB</strong>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#6366f1' }}></span>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Log Database: </span>
              <strong style={{ color: 'var(--text-primary)' }}>{databaseUsageGB} GB</strong>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#818cf8' }}></span>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>RS Parity/Redundancy: </span>
              <strong style={{ color: 'var(--text-primary)' }}>{redundancyUsageGB} GB</strong>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }}></span>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Unused Rented Capacity: </span>
              <strong style={{ color: 'var(--text-secondary)' }}>{freeStorageGB.toFixed(1)} GB</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Matrix Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>

        {/* Rented Leases Compliant */}
        <div className="liquid-glass-card p-6" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>
              Geo-Fenced Integrity
            </span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(167, 139, 250, 0.08)', color: '#c084fc', border: '1px solid rgba(167, 139, 250, 0.2)' }}>
              <Database size={18} />
            </div>
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>DPDP Compliant</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#34d399' }}>
            <ArrowUpRight size={14} />
            <span>100% Indian Shard Sovereignty</span>
          </div>
        </div>

        {/* Egress savings */}
        <div className="liquid-glass-card p-6" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>
              Financial Egress Savings
            </span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.08)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <Cpu size={18} />
            </div>
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>₹{totalSavings.toFixed(2)} INR</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#c084fc' }}>
            <span>70% cheaper than AWS S3</span>
          </div>
        </div>

        {/* Active Grid Nodes */}
        <div className="liquid-glass-card p-6" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>
              Volunteer Nodes Online
            </span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.08)', color: '#a78bfa', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
              <Network size={18} />
            </div>
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>8 Active / 12 Total</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#a78bfa' }}>
            <span>Dynamic WebRTC Tunneling</span>
          </div>
        </div>

      </div>

      {/* Rented Space Breakdown / P2P Leases details */}
      <div className="liquid-glass-card p-6" style={{ padding: '24px' }}>
        <h3 className="liquid-glow-text" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Server size={20} style={{ color: '#c084fc' }} />
          Active Sovereign Storage Leases & Node Contracts
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px', lineHeight: '1.6' }}>
          You have leased and rented this storage from verified local node pools in India. Shards are automatically replicated across these nodes with a Reed-Solomon 6+2 erasure-code tolerance:
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px' }}>LEASE CONTRACT ID</th>
                <th style={{ padding: '12px' }}>NODE CLUSTER / STATE</th>
                <th style={{ padding: '12px' }}>RENTED CAPACITY</th>
                <th style={{ padding: '12px' }}>P2P LEASE TYPE</th>
                <th style={{ padding: '12px' }}>COST RATE (GB/M)</th>
                <th style={{ padding: '12px' }}>INTEGRITY STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', color: 'var(--text-primary)' }}>
                <td style={{ padding: '12px', color: '#c084fc' }}>ds-lease-delhi-09a</td>
                <td style={{ padding: '12px' }}>Delhi NCR Hub (Volunteer Cluster)</td>
                <td style={{ padding: '12px', fontWeight: 700 }}>150 GB</td>
                <td style={{ padding: '12px' }}>Pre-paid P2P Space</td>
                <td style={{ padding: '12px' }}>₹0.40 / GB</td>
                <td style={{ padding: '12px', color: '#34d399' }}>✓ VERIFIED</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', color: 'var(--text-primary)' }}>
                <td style={{ padding: '12px', color: '#c084fc' }}>ds-lease-mumb-24b</td>
                <td style={{ padding: '12px' }}>Mumbai High-Density nodes</td>
                <td style={{ padding: '12px', fontWeight: 700 }}>150 GB</td>
                <td style={{ padding: '12px' }}>Pre-paid P2P Space</td>
                <td style={{ padding: '12px' }}>₹0.45 / GB</td>
                <td style={{ padding: '12px', color: '#34d399' }}>✓ VERIFIED</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', color: 'var(--text-primary)' }}>
                <td style={{ padding: '12px', color: '#c084fc' }}>ds-lease-blore-12d</td>
                <td style={{ padding: '12px' }}>Bengaluru Innovation Edge nodes</td>
                <td style={{ padding: '12px', fontWeight: 700 }}>100 GB</td>
                <td style={{ padding: '12px' }}>Pre-paid P2P Space</td>
                <td style={{ padding: '12px' }}>₹0.45 / GB</td>
                <td style={{ padding: '12px', color: '#34d399' }}>✓ VERIFIED</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', color: 'var(--text-primary)' }}>
                <td style={{ padding: '12px', color: '#c084fc' }}>ds-lease-pune-88k</td>
                <td style={{ padding: '12px' }}>Pune P2P Volunteer pool</td>
                <td style={{ padding: '12px', fontWeight: 700 }}>100 GB</td>
                <td style={{ padding: '12px' }}>Pre-paid P2P Space</td>
                <td style={{ padding: '12px' }}>₹0.40 / GB</td>
                <td style={{ padding: '12px', color: '#34d399' }}>✓ VERIFIED</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Interactive Sharding Upload Simulator */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>

        {/* Sharding Engine Panel */}
        <div className="liquid-glass-card p-6" style={{ padding: '24px' }}>
          <h3 className="liquid-glow-text" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Cpu size={20} className="text-cyan" style={{ color: '#c084fc' }} />
            WASM & WebRTC Sharding Engine
          </h3>

          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', lineHeight: '1.6' }}>
            Select any media file, CCTV video block, or package dataset to simulate real-time Rust-based client sharding and concurrent P2P transfers directly to decentralized nodes.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* File upload trigger */}
            <div style={{
              border: '2px dashed rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '32px 16px',
              textAlign: 'center',
              cursor: 'pointer',
              background: 'rgba(0,0,0,0.2)',
              position: 'relative'
            }}>
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0"
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0, cursor: 'pointer' }}
              />
              <File size={36} style={{ color: selectedFile ? '#c084fc' : 'var(--text-muted)', marginBottom: '12px' }} />
              {selectedFile ? (
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{selectedFile.name}</h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{formatBytes(selectedFile.size)}</span>
                </div>
              ) : (
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>Choose a Local Dataset</h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>CCTV feeds, backups or standard binary files</span>
                </div>
              )}
            </div>

            {/* Launch Action */}
            <button
              onClick={handleLaunchUpload}
              disabled={!selectedFile || isSimulating}
              className="liquid-glass-btn liquid-glass-btn-primary w-full"
              style={{ width: '100%', padding: '14px' }}
            >
              {isSimulating ? 'Distributing Shards in Parallel...' : 'Simulate Sovereign Sharding Upload'}
            </button>

            {/* Progress bar info */}
            {upload.phase !== 'IDLE' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: '#c084fc', fontWeight: 600 }}>{upload.phase.replace('_', ' ')}</span>
                  <span style={{ color: 'var(--text-primary)' }}>{upload.progress}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${upload.progress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #c084fc 0%, #8b5cf6 100%)',
                    borderRadius: '999px',
                    transition: 'width 0.3s ease-out'
                  }}></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Terminal logs panel */}
        <div className="liquid-glass-card p-6" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 className="liquid-glow-text" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TermIcon size={20} style={{ color: '#a78bfa' }} />
            Telemetry Console Logs
          </h3>

          <div style={{
            flex: 1,
            background: 'rgba(0,0,0,0.45)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '16px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: '#c084fc',
            overflowY: 'auto',
            minHeight: '260px',
            maxHeight: '340px',
            boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.5)'
          }}>
            {terminalLogs.length === 0 ? (
              <span style={{ color: 'var(--text-muted)' }}>Waiting to deploy S3 upload conveyor...</span>
            ) : (
              terminalLogs.map((log, i) => (
                <div key={i} style={{ marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '4px' }}>{log}</div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Nodes Map & Transfer Conveyor Grid */}
      {upload.phase !== 'IDLE' && (
        <div className="liquid-glass-card p-6 animate-fade-in" style={{ padding: '24px' }}>
          <h3 className="liquid-glow-text" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Share2 size={20} style={{ color: '#c084fc' }} />
            Active Peer Nodes Transfer Pipeline (India Network Topology)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {upload.shards.map((shard, index) => {
              const isActive = upload.phase === 'P2P_STREAMING' && shard.status !== 'SUCCESS';
              return (
                <div key={shard.nodeId}
                  className={isActive ? 'pulse-glow' : ''}
                  style={{
                    background: 'rgba(10, 5, 24, 0.6)',
                    border: shard.status === 'SUCCESS'
                      ? '1px solid rgba(16,185,129,0.3)'
                      : isActive
                        ? '1px solid rgba(167, 139, 250, 0.4)'
                        : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '16px',
                    padding: '16px',
                    transition: 'all 0.3s ease'
                  }}>

                  {/* Node Header info */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Node #{index + 1}</span>
                    <span className={`neon-badge ${shard.status === 'SUCCESS' ? 'neon-badge-emerald' : 'neon-badge-cyan'}`} style={{ fontSize: '9px', padding: '3px 8px' }}>
                      {shard.status}
                    </span>
                  </div>

                  {/* Node Details */}
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div>IP: {shard.nodeIp}</div>
                    <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>UPI: {shard.nodeUpi}</div>
                  </div>

                  {/* Speed progress meter */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Shard #{index + 1} Transfer</span>
                      <span style={{ color: shard.status === 'SUCCESS' ? '#34d399' : '#c084fc' }}>{shard.progress}%</span>
                    </div>
                    <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.04)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${shard.progress}%`,
                        height: '100%',
                        background: shard.status === 'SUCCESS'
                          ? 'linear-gradient(90deg, #10B981 0%, #059669 100%)'
                          : 'linear-gradient(90deg, #c084fc 0%, #7c3aed 100%)',
                        borderRadius: '999px',
                        transition: 'width 0.1s ease-out'
                      }}></div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
