"use client";

import React, { useState } from "react";
import { 
  Layers, 
  Server, 
  Key, 
  MapPin, 
  CreditCard, 
  Plus, 
  RefreshCw, 
  Download, 
  Check, 
  Copy, 
  Database, 
  Smartphone, 
  TrendingUp, 
  Wifi, 
  ShieldCheck,
  Trash2
} from "lucide-react";

interface Bucket {
  id: string;
  name: string;
  size: string;
  created: string;
  status: "Active" | "Pending";
  geofence: string;
}

export default function Console() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "s3-creds" | "nodes" | "billing">("dashboard");
  const [buckets, setBuckets] = useState<Bucket[]>([
    { id: "1", name: "startup-app-logs", size: "4.2 TB", created: "2026-05-10", status: "Active", geofence: "Geo-Locked (India)" },
    { id: "2", name: "cctv-cp-plus-vault", size: "12.8 TB", created: "2026-05-12", status: "Active", geofence: "Geo-Locked (India)" },
    { id: "3", name: "mysql-db-archives", size: "2.1 TB", created: "2026-05-20", status: "Active", geofence: "Geo-Locked (India)" }
  ]);
  
  // S3 Credential Rotation State
  const [accessKey, setAccessKey] = useState("ds_access_key_live_793b29c");
  const [secretKey, setSecretKey] = useState("ds_secret_key_live_99ac24e81b674b01");
  const [copiedAccess, setCopiedAccess] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  
  // Bucket Creator Modal State
  const [newBucketName, setNewBucketName] = useState("");
  const [newBucketSize, setNewBucketSize] = useState("10");
  const [isDpdpCompliant, setIsDpdpCompliant] = useState(true);
  const [showNotification, setShowNotification] = useState("");

  const rotateCredentials = () => {
    const chars = "abcdef0123456789";
    let newAccess = "ds_access_key_live_";
    let newSecret = "ds_secret_key_live_";
    for (let i = 0; i < 8; i++) {
      newAccess += chars[Math.floor(Math.random() * chars.length)];
    }
    for (let i = 0; i < 16; i++) {
      newSecret += chars[Math.floor(Math.random() * chars.length)];
    }
    setAccessKey(newAccess);
    setSecretKey(newSecret);
    triggerNotification("S3 API Access keys successfully rotated!");
  };

  const createBucket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBucketName) return;
    
    // Normalize bucket name
    const formattedName = newBucketName.toLowerCase().replace(/[^a-z0-9-]/g, "-");
    const newBucket: Bucket = {
      id: String(buckets.length + 1),
      name: formattedName,
      size: `${newBucketSize} TB`,
      created: new Date().toISOString().split("T")[0] || "",
      status: "Pending",
      geofence: isDpdpCompliant ? "Geo-Locked (India)" : "Global Peer Mesh"
    };

    setBuckets([...buckets, newBucket]);
    setNewBucketName("");
    triggerNotification(`Bucket "${formattedName}" initialized successfully!`);
    
    // Simulate auto-active status after 2 seconds
    setTimeout(() => {
      setBuckets(currentBuckets => 
        currentBuckets.map(b => b.name === formattedName ? { ...b, status: "Active" } : b)
      );
    }, 2000);
  };

  const deleteBucket = (id: string, name: string) => {
    setBuckets(buckets.filter(b => b.id !== id));
    triggerNotification(`Bucket "${name}" purged successfully.`);
  };

  const triggerNotification = (msg: string) => {
    setShowNotification(msg);
    setTimeout(() => {
      setShowNotification("");
    }, 4000);
  };

  const copyToClipboard = (text: string, type: "access" | "secret") => {
    navigator.clipboard.writeText(text);
    if (type === "access") {
      setCopiedAccess(true);
      setTimeout(() => setCopiedAccess(false), 2000);
    } else {
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    }
  };

  // Derived metrics
  const totalStorageTB = buckets.reduce((acc, curr) => acc + parseFloat(curr.size), 0);
  const monthlyCostINR = totalStorageTB * 450;
  const activePeersCount = Math.round(totalStorageTB * 14.5);

  return (
    <div className="relative min-h-screen">
      <div className="grid-overlay"></div>

      {/* Floating Notification */}
      {showNotification && (
        <div style={{
          position: "fixed",
          bottom: "32px",
          right: "32px",
          background: "var(--bg-carbon)",
          border: "1px solid var(--accent-cyan)",
          color: "#ffffff",
          padding: "16px 24px",
          borderRadius: "8px",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: "12px",
          boxShadow: "0 10px 25px rgba(0, 255, 204, 0.15)",
          fontFamily: "var(--font-inter)",
          fontSize: "0.9rem"
        }}>
          <ShieldCheck size={20} style={{ color: "var(--accent-cyan)" }} />
          <span>{showNotification}</span>
        </div>
      )}

      {/* Header Bar */}
      <header className="header-console">
        <div className="console-header-container">
          <a href="#" className="logo-console">
            <div className="logo-icon-console">DS</div>
            DriveShare<span>.gateway</span>
            <span className="badge-console">Tenant Hub</span>
          </a>
          
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <a href="http://localhost:3000" className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
              Back to Portal
            </a>
            <a href="http://localhost:3001" className="btn btn-primary" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
              Dev Manual
            </a>
          </div>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="console-grid">
        {/* Left Sidebar Menu */}
        <aside className="console-sidebar">
          <ul className="sidebar-menu">
            <li>
              <a 
                onClick={() => setActiveTab("dashboard")}
                className={`sidebar-item-link ${activeTab === "dashboard" ? "active" : ""}`}
                style={{ cursor: "pointer" }}
              >
                <Layers size={18} />
                <span>Dashboard Overview</span>
              </a>
            </li>
            <li>
              <a 
                onClick={() => setActiveTab("s3-creds")}
                className={`sidebar-item-link ${activeTab === "s3-creds" ? "active" : ""}`}
                style={{ cursor: "pointer" }}
              >
                <Key size={18} />
                <span>S3 API Credentials</span>
              </a>
            </li>
            <li>
              <a 
                onClick={() => setActiveTab("nodes")}
                className={`sidebar-item-link ${activeTab === "nodes" ? "active" : ""}`}
                style={{ cursor: "pointer" }}
              >
                <MapPin size={18} />
                <span>Node Geo-Fencing</span>
              </a>
            </li>
            <li>
              <a 
                onClick={() => setActiveTab("billing")}
                className={`sidebar-item-link ${activeTab === "billing" ? "active" : ""}`}
                style={{ cursor: "pointer" }}
              >
                <CreditCard size={18} />
                <span>UPI Billing & Invoices</span>
              </a>
            </li>
          </ul>
        </aside>

        {/* Content Pane */}
        <main className="console-content">
          
          {activeTab === "dashboard" && (
            <div>
              <div className="view-header">
                <div>
                  <h1 className="view-title">Object Storage Console</h1>
                  <p className="view-subtitle">Monitor decentralized shards, manage active buckets, and track network metrics.</p>
                </div>
                <div style={{ color: "var(--accent-green)", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", fontWeight: "600" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-green)", display: "inline-block" }}></span>
                  Gateway API Online
                </div>
              </div>

              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-card-title">Storage Allocated</span>
                  <span className="stat-card-value">{totalStorageTB.toFixed(1)} TB</span>
                  <span className="stat-card-meta">
                    <Database size={14} /> Total capacity across Indian meshes
                  </span>
                </div>
                <div className="stat-card">
                  <span className="stat-card-title">Accumulated Monthly Cost</span>
                  <span className="stat-card-value">₹{monthlyCostINR.toLocaleString("en-IN")}</span>
                  <span className="stat-card-meta" style={{ color: "var(--accent-cyan)" }}>
                    <Smartphone size={14} style={{ color: "var(--accent-cyan)" }} /> Standard ₹450 / TB per month rate
                  </span>
                </div>
                <div className="stat-card">
                  <span className="stat-card-title">Distributed Node Peers</span>
                  <span className="stat-card-value">{activePeersCount} Nodes</span>
                  <span className="stat-card-meta">
                    <Wifi size={14} /> Redundant active campus laptops
                  </span>
                </div>
              </div>

              {/* Interactive Bucket Creator & Table Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "32px" }}>
                
                {/* Active Buckets Table */}
                <div className="console-table-card" style={{ marginBottom: 0 }}>
                  <div className="table-card-header">
                    <h3 className="table-title">Active S3 Buckets</h3>
                    <span className="badge-console">{buckets.length} Buckets</span>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table className="console-table">
                      <thead>
                        <tr>
                          <th>Bucket Name</th>
                          <th>Allocated Size</th>
                          <th>Created On</th>
                          <th>Geo-Fencing Status</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {buckets.map(b => (
                          <tr key={b.id}>
                            <td style={{ fontFamily: "var(--font-mono)", fontWeight: "600", color: "#ffffff" }}>{b.name}</td>
                            <td>{b.size}</td>
                            <td>{b.created}</td>
                            <td>
                              <span style={{ fontSize: "0.8rem", color: b.geofence.includes("Geo") ? "var(--accent-cyan)" : "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                                <MapPin size={12} /> {b.geofence}
                              </span>
                            </td>
                            <td>
                              <span className={`status-pill ${b.status === "Active" ? "active" : "pending"}`}>
                                {b.status}
                              </span>
                            </td>
                            <td>
                              <button 
                                onClick={() => deleteBucket(b.id, b.name)}
                                style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer" }}
                                title="Delete Bucket"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Bucket Creator Form */}
                <div style={{ background: "var(--bg-carbon)", border: "1px solid var(--border-grid)", borderRadius: "8px", padding: "24px" }}>
                  <h3 style={{ fontFamily: "var(--font-outfit)", fontSize: "1.2rem", fontWeight: "600", marginBottom: "16px", color: "#ffffff" }}>
                    Create S3 compatible Bucket
                  </h3>
                  <form onSubmit={createBucket}>
                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "8px" }}>BUCKET NAME</label>
                      <input 
                        type="text" 
                        value={newBucketName}
                        onChange={(e) => setNewBucketName(e.target.value)}
                        placeholder="e.g. log-server-archives"
                        style={{
                          width: "100%",
                          background: "var(--bg-obsidian)",
                          border: "1px solid var(--border-grid)",
                          color: "#ffffff",
                          padding: "10px 12px",
                          borderRadius: "4px",
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.85rem"
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "8px" }}>STORAGE CAPACITY LIMIT (TB)</label>
                      <select 
                        value={newBucketSize}
                        onChange={(e) => setNewBucketSize(e.target.value)}
                        style={{
                          width: "100%",
                          background: "var(--bg-obsidian)",
                          border: "1px solid var(--border-grid)",
                          color: "#ffffff",
                          padding: "10px 12px",
                          borderRadius: "4px",
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.85rem"
                        }}
                      >
                        <option value="5">5 TB limit</option>
                        <option value="10">10 TB limit</option>
                        <option value="50">50 TB limit</option>
                        <option value="100">100 TB limit</option>
                      </select>
                    </div>

                    <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
                      <input 
                        type="checkbox" 
                        id="dpdp"
                        checked={isDpdpCompliant}
                        onChange={(e) => setIsDpdpCompliant(e.target.checked)}
                        style={{ cursor: "pointer" }}
                      />
                      <label htmlFor="dpdp" style={{ fontSize: "0.8rem", color: "var(--text-primary)", cursor: "pointer" }}>
                        Enforce DPDP Act Geo-locking (India node boundaries only)
                      </label>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                      <Plus size={16} /> Create Bucket
                    </button>
                  </form>
                </div>

              </div>
            </div>
          )}

          {activeTab === "s3-creds" && (
            <div>
              <div className="view-header">
                <div>
                  <h1 className="view-title">S3 Endpoint Credentials</h1>
                  <p className="view-subtitle">Manage secure API keypairs to connect standard developer log tools, Terraform scripts, or CCTV synchronization systems.</p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                
                {/* Active Key pair details */}
                <div style={{ background: "var(--bg-carbon)", border: "1px solid var(--border-grid)", borderRadius: "8px", padding: "32px" }}>
                  <h3 style={{ fontFamily: "var(--font-outfit)", fontSize: "1.3rem", fontWeight: "600", color: "#ffffff", marginBottom: "16px" }}>
                    Active S3 Credentials Registry
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.6", marginBottom: "24px" }}>
                    These credentials allow continuous stream authorization. Store them securely. In case of developer rotation or compromise, trigger immediate cryptographic rotation.
                  </p>

                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "6px" }}>
                      <span>S3 COMPATIBLE ENDPOINT</span>
                    </div>
                    <div className="cred-box">
                      <span>https://api.driveshare.in</span>
                      <button style={{ background: "transparent", border: "none", color: "var(--accent-cyan)", cursor: "pointer" }} onClick={() => navigator.clipboard.writeText("https://api.driveshare.in")}>
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "6px" }}>
                      <span>ACCESS KEY ID</span>
                      <span style={{ color: "var(--accent-cyan)", fontSize: "0.7rem" }}>Active</span>
                    </div>
                    <div className="cred-box">
                      <span>{accessKey}</span>
                      <button style={{ background: "transparent", border: "none", color: "var(--accent-cyan)", cursor: "pointer" }} onClick={() => copyToClipboard(accessKey, "access")}>
                        {copiedAccess ? <Check size={14} style={{ color: "var(--accent-green)" }} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  <div style={{ marginBottom: "28px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "6px" }}>
                      <span>SECRET ACCESS KEY</span>
                      <span style={{ color: "var(--accent-cyan)", fontSize: "0.7rem" }}>Encrypted (AES-256)</span>
                    </div>
                    <div className="cred-box">
                      <span>{secretKey}</span>
                      <button style={{ background: "transparent", border: "none", color: "var(--accent-cyan)", cursor: "pointer" }} onClick={() => copyToClipboard(secretKey, "secret")}>
                        {copiedSecret ? <Check size={14} style={{ color: "var(--accent-green)" }} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  <button className="btn btn-secondary" onClick={rotateCredentials} style={{ display: "flex", gap: "10px", borderColor: "#e11d48", color: "#f43f5e" }}>
                    <RefreshCw size={16} /> Rotate API Credentials
                  </button>
                </div>

                {/* S3 Quick Setup Guides */}
                <div style={{ background: "var(--bg-carbon)", border: "1px solid var(--border-grid)", borderRadius: "8px", padding: "32px" }}>
                  <h3 style={{ fontFamily: "var(--font-outfit)", fontSize: "1.3rem", fontWeight: "600", color: "#ffffff", marginBottom: "16px" }}>
                    S3 Connection Blueprints
                  </h3>
                  
                  <div style={{ marginBottom: "20px" }}>
                    <h4 style={{ fontSize: "0.9rem", color: "var(--accent-cyan)", marginBottom: "8px", fontWeight: "600" }}>
                      AWS CLI Integration
                    </h4>
                    <div style={{ background: "var(--bg-obsidian)", padding: "12px", border: "1px solid var(--border-grid)", borderRadius: "4px", fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      aws s3 cp my-backup.zip s3://cctv-cp-plus-vault/ --endpoint-url=https://api.driveshare.in
                    </div>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <h4 style={{ fontSize: "0.9rem", color: "var(--accent-cyan)", marginBottom: "8px", fontWeight: "600" }}>
                      Boto3 Python SDK Configuration
                    </h4>
                    <div style={{ background: "var(--bg-obsidian)", padding: "12px", border: "1px solid var(--border-grid)", borderRadius: "4px", fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-muted)", whiteSpace: "pre-wrap" }}>
{`import boto3

s3_client = boto3.client(
    "s3",
    endpoint_url="https://api.driveshare.in",
    aws_access_key_id="${accessKey}",
    aws_secret_access_key="${secretKey.substring(0, 8)}..."
)`}
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: "0.9rem", color: "var(--accent-cyan)", marginBottom: "8px", fontWeight: "600" }}>
                      Rclone CCTV Watching Cron
                    </h4>
                    <div style={{ background: "var(--bg-obsidian)", padding: "12px", border: "1px solid var(--border-grid)", borderRadius: "4px", fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      rclone sync "C:\CCTV" driveshare:cctv-cp-plus-vault --bwlimit "12AM-6AM:50M"
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === "nodes" && (
            <div>
              <div className="view-header">
                <div>
                  <h1 className="view-title">Distributed Node Geo-Fencing (India Matrix)</h1>
                  <p className="view-subtitle">Trace individual consumer broadband laptap nodes hosting encrypted file shards within domestic boundaries.</p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "32px" }}>
                
                {/* Interactive Simulated Node Map */}
                <div style={{ background: "var(--bg-carbon)", border: "1px solid var(--border-grid)", borderRadius: "8px", padding: "32px", display: "flex", flexDirection: "column", justifySelf: "stretch" }}>
                  <h3 style={{ fontFamily: "var(--font-outfit)", fontSize: "1.2rem", fontWeight: "600", color: "#ffffff", marginBottom: "20px" }}>
                    Domestic Active Shard Map (Live WebSockets)
                  </h3>
                  
                  {/* Custom CSS Simulated Map Grid */}
                  <div style={{
                    height: "360px",
                    background: "var(--bg-obsidian)",
                    border: "1px solid var(--border-grid)",
                    borderRadius: "6px",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    {/* India Map Mockup background dots */}
                    <div style={{ position: "absolute", color: "rgba(0, 255, 204, 0.05)", fontSize: "0.8rem", textAlign: "center", pointerEvents: "none" }}>
                      [ DOMESTIC PEER MATRIX OVERLAY ]
                    </div>
                    
                    {/* Glowing nodes representation */}
                    <div style={{ position: "absolute", top: "15%", left: "40%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "var(--accent-green)", boxShadow: "0 0 10px var(--accent-green)", display: "inline-block" }}></span>
                      <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", marginTop: "4px", fontFamily: "var(--font-mono)" }}>Delhi (14 Nodes)</span>
                    </div>

                    <div style={{ position: "absolute", top: "50%", left: "30%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "var(--accent-cyan)", boxShadow: "0 0 10px var(--accent-cyan)", display: "inline-block" }}></span>
                      <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", marginTop: "4px", fontFamily: "var(--font-mono)" }}>Mumbai (28 Nodes)</span>
                    </div>

                    <div style={{ position: "absolute", top: "65%", left: "45%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "var(--accent-cyan)", boxShadow: "0 0 10px var(--accent-cyan)", display: "inline-block" }}></span>
                      <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", marginTop: "4px", fontFamily: "var(--font-mono)" }}>Bengaluru (42 Nodes)</span>
                    </div>

                    <div style={{ position: "absolute", top: "70%", left: "55%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "var(--accent-green)", boxShadow: "0 0 10px var(--accent-green)", display: "inline-block" }}></span>
                      <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", marginTop: "4px", fontFamily: "var(--font-mono)" }}>Chennai (31 Nodes)</span>
                    </div>

                    <div style={{ position: "absolute", top: "45%", left: "70%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "var(--accent-cyan)", boxShadow: "0 0 10px var(--accent-cyan)", display: "inline-block" }}></span>
                      <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", marginTop: "4px", fontFamily: "var(--font-mono)" }}>Kolkata (16 Nodes)</span>
                    </div>
                  </div>
                </div>

                {/* Node compliance block */}
                <div style={{ background: "var(--bg-carbon)", border: "1px solid var(--border-grid)", borderRadius: "8px", padding: "32px" }}>
                  <h3 style={{ fontFamily: "var(--font-outfit)", fontSize: "1.2rem", fontWeight: "600", color: "#ffffff", marginBottom: "16px" }}>
                    DPDP Act Compliance
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.6", marginBottom: "20px" }}>
                    Under Section 6 of India&apos;s **Digital Personal Data Protection (DPDP) Act 2023**, startup patient records, user metadata, and domestic CCTV feeds must legally be geo-fenced.
                  </p>
                  
                  <div style={{ background: "rgba(0, 255, 204, 0.03)", border: "1px solid rgba(0, 255, 204, 0.15)", padding: "16px", borderRadius: "6px", marginBottom: "24px" }}>
                    <h4 style={{ fontSize: "0.9rem", color: "var(--accent-cyan)", fontWeight: "600", marginBottom: "6px" }}>Active Geofencing Protocol</h4>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
                      Your buckets are strictly restricted to Indian Node IPs. We blacklist off-shore student nodes or global VPS endpoints automatically, utilizing ISP coordinates of JioFiber and Airtel broadband routes exclusively.
                    </p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", borderBottom: "1px solid var(--border-grid)", paddingBottom: "8px" }}>
                      <span style={{ color: "var(--text-muted)" }}>Target SLA:</span>
                      <span style={{ color: "#ffffff", fontWeight: "600" }}>99.999% Geo-fidelity</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", borderBottom: "1px solid var(--border-grid)", paddingBottom: "8px" }}>
                      <span style={{ color: "var(--text-muted)" }}>Compliance Standard:</span>
                      <span style={{ color: "var(--accent-green)", fontWeight: "600" }}>DPDP Compliant (India)</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === "billing" && (
            <div>
              <div className="view-header">
                <div>
                  <h1 className="view-title">UPI Billing & Autopay Invoices</h1>
                  <p className="view-subtitle">Standardized transparent Indian Rupee billing settled directly via recurring PhonePe, Google Pay, or Paytm UPI accounts.</p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "32px" }}>
                
                {/* Invoice log */}
                <div className="console-table-card" style={{ marginBottom: 0 }}>
                  <div className="table-card-header">
                    <h3 className="table-title">UPI Mandate Invoices</h3>
                    <span className="badge-console">UPI Autopay Active</span>
                  </div>
                  <table className="console-table">
                    <thead>
                      <tr>
                        <th>Invoice ID</th>
                        <th>Billing Cycle</th>
                        <th>Total Capacity</th>
                        <th>INR Cost Charged</th>
                        <th>Autopay Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ fontFamily: "var(--font-mono)", fontWeight: "600" }}>DS-INV-2026-05</td>
                        <td>May 2026</td>
                        <td>{totalStorageTB.toFixed(1)} TB</td>
                        <td className="accent-td">₹{monthlyCostINR.toLocaleString("en-IN")}</td>
                        <td>
                          <span className="status-pill active">Auto-Paid UPI</span>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ fontFamily: "var(--font-mono)", fontWeight: "600" }}>DS-INV-2026-04</td>
                        <td>April 2026</td>
                        <td>12.8 TB</td>
                        <td className="accent-td">₹5,760</td>
                        <td>
                          <span className="status-pill active">Auto-Paid UPI</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Mandate Details */}
                <div style={{ background: "var(--bg-carbon)", border: "1px solid var(--border-grid)", borderRadius: "8px", padding: "32px" }}>
                  <h3 style={{ fontFamily: "var(--font-outfit)", fontSize: "1.2rem", fontWeight: "600", color: "#ffffff", marginBottom: "16px" }}>
                    UPI Autopay Configuration
                  </h3>
                  
                  <div style={{ marginBottom: "20px" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>LINKED UPI ID</span>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px", background: "var(--bg-obsidian)", padding: "10px 14px", borderRadius: "4px", border: "1px solid var(--border-grid)" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "#ffffff" }}>startupinfra@ybl</span>
                      <span style={{ color: "var(--accent-green)", fontSize: "0.75rem", fontWeight: "600" }}>Verified</span>
                    </div>
                  </div>

                  <div style={{ background: "rgba(16, 185, 129, 0.03)", border: "1px solid rgba(16, 185, 129, 0.15)", padding: "16px", borderRadius: "6px", marginBottom: "20px" }}>
                    <h4 style={{ fontSize: "0.85rem", color: "var(--accent-green)", fontWeight: "600", marginBottom: "6px" }}>Automatic Invoice Settlement</h4>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
                      Invoices are computed on the 1st of every month and automatically processed via UPI Mandates on the 5th. No credit card or international FX currency conversion fees required.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
