"use client";

import React, { useState } from "react";
import {
  Server,
  ShieldCheck,
  Settings,
  ArrowRight,
  Cloud,
  Clock,
  Key,
  ShieldAlert,
  Coins
} from "lucide-react";

export default function Home() {
  // Pricing Simulator State
  const [storage, setStorage] = useState<number>(10); // in TB
  const [egress, setEgress] = useState<number>(2); // in TB

  // Cost calculations based on standard AWS S3 rates vs DriveShare custom economics:
  // AWS standard storage cost: ~₹1,950 per TB per month
  // AWS egress fee: ~₹7,400 per TB transferred
  const awsStorageCost = storage * 1950;
  const awsEgressCost = egress * 7400;
  const totalAwsCost = awsStorageCost + awsEgressCost;

  // DriveShare:
  // - Storage: ₹450 per TB / month (We pay node providers ₹125/TB)
  // - Egress: ₹550 per TB downloaded (We pay node providers ₹165/TB)
  const driveShareStorageCost = storage * 450;
  const driveShareEgressCost = egress * 550;
  const totalDriveShareCost = driveShareStorageCost + driveShareEgressCost;

  const totalSavings = totalAwsCost - totalDriveShareCost;
  const savingsPercent = Math.round((totalSavings / totalAwsCost) * 100) || 0;

  return (
    <div className="relative min-h-screen">
      {/* Mesh Grid Background Fabric */}
      <div className="grid-overlay"></div>

      {/* Ambient Neon Glows */}
      <div className="glow-radial" style={{ top: "10%", left: "5%" }}></div>
      <div className="glow-radial" style={{ top: "45%", right: "5%" }}></div>
      <div className="glow-radial" style={{ bottom: "5%", left: "15%" }}></div>

      {/* Sticky, Blurred Header Navigation */}
      <header className="header-nav" style={{ position: "sticky", top: 0, zIndex: 1000, backdropFilter: "blur(16px)" }}>
        <div className="container nav-container">
          <a href="#" className="logo">
            <div className="logo-icon">DS</div>
            DriveShare<span>.in</span>
            <span className="nav-badge">v1.0.2</span>
          </a>

          <nav className="nav-links">
            <a href="#about" className="nav-link">About Core</a>
            <a href="#metrics" className="nav-link">Metrics</a>
            <a href="#pricing" className="nav-link">Pricing &amp; Economics</a>
            <a href="#simulator" className="nav-link">Simulator</a>
            <a href="#supply-chain" className="nav-link">Supply Side</a>
            <a href="http://localhost:3001" className="nav-link" style={{ color: "var(--accent-cyan)", display: "flex", alignItems: "center", gap: "4px" }}>
              Dev Docs <ArrowRight size={12} />
            </a>
          </nav>

          <div style={{ display: "flex", gap: "12px" }}>
            <a href="http://localhost:3001" className="btn btn-secondary" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
              API Reference
            </a>
            <a href="http://localhost:3002" className="btn btn-primary" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
              Gateway Console
            </a>
          </div>
        </div>
      </header>

      {/* Hero Hook Section */}
      <section className="hero-sec">
        <div className="container hero-grid">
          <div>
            <div className="hero-tag">
              <span className="inline-block" style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-green)", marginRight: "6px" }}></span>
              Keep Your Data In Your Country &amp; Compliant With Your Laws
            </div>

            <h1 className="hero-title">
              S3-Compatible Storage.<br />
              <span>70% Cheaper than AWS.</span><br />
              100% Geo-Fenced inside Your Country.
            </h1>

            <p className="hero-subtitle">
              Stop overpaying for cold data buckets, debugging application logs, and daily database archives.
              DriveShare shards your data across a secure, distributed network of hyper-local consumer hardware loops—idle student campus laptops and broadband links.
              Enjoy uncompromised low latency, flat-rate pricing, and complete national legal compliance.
            </p>

            <div className="hero-ctas">
              <a href="http://localhost:3002" className="btn btn-primary">
                Deploy Now via S3 API
                <ArrowRight size={18} />
              </a>
              <a href="http://localhost:3001" className="btn btn-secondary">
                View Integration Docs
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="matrix-terminal">
              <div className="terminal-header">
                <div className="terminal-dots">
                  <div className="terminal-dot red"></div>
                  <div className="terminal-dot yellow"></div>
                  <div className="terminal-dot green"></div>
                </div>
                <div className="terminal-title">driveshare-daemon.sh</div>
                <Settings size={14} className="text-muted" />
              </div>
              <div className="terminal-body">
                <div className="terminal-line">
                  <span className="text-muted">[system]</span> Initializing DriveShare control plane...
                </div>
                <div className="terminal-line">
                  <span className="text-muted">[system]</span> Connected to ABV-IIITM campus loop node
                </div>
                <div className="terminal-line">
                  <span className="text-cyan">[gateway]</span> Listening on HTTP API port 443 (ap-south-1)
                </div>
                <div className="terminal-line">
                  <span className="text-green">[sharding]</span> S3 Stream Passthrough active. Buffer size: 256MB
                </div>
                <div className="terminal-line">
                  <span className="text-muted">[storage]</span> Shard matrix status: <span className="text-green">ONLINE</span> (2,492 nodes active)
                </div>
                <div className="terminal-line" style={{ marginTop: "16px", borderTop: "1px solid var(--border-grid)", paddingTop: "12px" }}>
                  <span className="text-cyan">rclone sync</span> /var/log/nginx driveshare:logs-vault
                </div>
                <div className="terminal-line">
                  Transferring: <span className="text-green">94.2 MB/s</span> | Shards: <span className="text-cyan">12/12 encrypted</span>
                </div>
                <div className="terminal-line">
                  [] 100% | Success
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: About the Core Product Features */}
      <section id="about" className="section">
        <div className="container">
          <div className="sec-title-wrap">
            <span className="sec-subtitle">Product Foundations</span>
            <h2 className="sec-title">The Core Product Features</h2>
            <p className="sec-desc">
              Your developers simply swap their configuration links, and our high-performance background matrix handles the rest seamlessly.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }} className="doc-card-grid">
            <div className="doc-card" style={{ background: "var(--bg-carbon)" }}>
              <div className="doc-card-icon" style={{ width: "48px", height: "48px", background: "rgba(0, 255, 204, 0.05)", border: "1px solid rgba(0, 255, 204, 0.15)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-cyan)", marginBottom: "20px" }}>
                <Server size={22} />
              </div>
              <h4 style={{ fontFamily: "var(--font-outfit)", fontSize: "1.2rem", fontWeight: "600", marginBottom: "12px", color: "#ffffff" }}>
                1. Zero Server Bandwidth Costs
              </h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.6" }}>
                Stream or store 100 Petabytes of data through DriveShare, and your server egress billing remains exactly $0. Bandwidth is distributed entirely client-to-peer.
              </p>
              <div style={{ marginTop: "16px", background: "var(--bg-obsidian)", border: "1px solid var(--border-grid)", padding: "12px", borderRadius: "4px", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
                <span className="text-muted"># Direct Peer Stream</span><br />
                Egress Bandwidth Bill = $0.00
              </div>
            </div>

            <div className="doc-card" style={{ background: "var(--bg-carbon)" }}>
              <div className="doc-card-icon" style={{ width: "48px", height: "48px", background: "rgba(0, 255, 204, 0.05)", border: "1px solid rgba(0, 255, 204, 0.15)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-cyan)", marginBottom: "20px" }}>
                <Cloud size={22} />
              </div>
              <h4 style={{ fontFamily: "var(--font-outfit)", fontSize: "1.2rem", fontWeight: "600", marginBottom: "12px", color: "#ffffff" }}>
                2. Zero Server CPU Load
              </h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.6" }}>
                Our server performs zero expensive compression or cryptographic sharding calculations. The client's own laptop browser handles this via WebAssembly, scaling infinitely.
              </p>
              <div style={{ marginTop: "16px", background: "var(--bg-obsidian)", border: "1px solid var(--border-grid)", padding: "12px", borderRadius: "4px", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
                <span className="text-cyan">local_wasm</span> compress &amp; encrypt shards
              </div>
            </div>

            <div className="doc-card" style={{ background: "var(--bg-carbon)" }}>
              <div className="doc-card-icon" style={{ width: "48px", height: "48px", background: "rgba(0, 255, 204, 0.05)", border: "1px solid rgba(0, 255, 204, 0.15)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-cyan)", marginBottom: "20px" }}>
                <Key size={22} />
              </div>
              <h4 style={{ fontFamily: "var(--font-outfit)", fontSize: "1.2rem", fontWeight: "600", marginBottom: "12px", color: "#ffffff" }}>
                3. Ultimate Zero-Knowledge Privacy
              </h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.6" }}>
                The unencrypted file never touches our server. Payloads are encrypted locally in the user's browser before transit. Absolute mathematical privacy is guaranteed.
              </p>
              <div style={{ marginTop: "16px", background: "var(--bg-obsidian)", border: "1px solid var(--border-grid)", padding: "12px", borderRadius: "4px", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
                <span className="text-green">Zero-Knowledge</span> &rarr; Server cannot view files
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section II: Core Performance Metrics */}
      <section id="metrics" className="section">
        <div className="container">
          <div className="sec-title-wrap">
            <span className="sec-subtitle">Infrastructure Analysis</span>
            <h2 className="sec-title">Core Performance Metrics &amp; Trust Realities</h2>
            <p className="sec-desc">
              Startup CTOs and CCTV agencies upgrade to DriveShare to bypass hyperscaler fees and achieve compliant, domestic speeds.
            </p>
          </div>

          <div className="table-wrapper">
            <table className="trust-table">
              <thead>
                <tr>
                  <th>Core Evaluation Metric</th>
                  <th>Centralized Hyperscalers (AWS S3)</th>
                  <th className="driveshare-cell" style={{ borderBottom: "1px solid var(--border-grid)" }}>DriveShare Cloud Network</th>
                  <th>The Structural Advantage</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="metric-name">Standard Storage Cost</td>
                  <td className="hyperscaler-cell">~₹19,500 per Month <span style={{ opacity: 0.6, fontSize: "0.85rem" }}>(per 10 TB)</span></td>
                  <td className="driveshare-cell">₹4,500 per Month <span style={{ opacity: 0.8, fontSize: "0.85rem" }}>(Flat Rate)</span></td>
                  <td className="advantage-cell">More than 70% Instant Operational Savings</td>
                </tr>
                <tr>
                  <td className="metric-name">Data Egress Fee (Downloads)</td>
                  <td className="hyperscaler-cell">~₹7,400 per 1 Terabyte transferred</td>
                  <td className="driveshare-cell">₹550 per 1 Terabyte transferred</td>
                  <td className="advantage-cell">90% Operational Savings on Egress Charges</td>
                </tr>
                <tr>
                  <td className="metric-name">API Cold Start Latency</td>
                  <td className="hyperscaler-cell">Variable across overseas server loops</td>
                  <td className="driveshare-cell">5 ms - 20 ms <span style={{ opacity: 0.8, fontSize: "0.85rem" }}>(domestic country routing)</span></td>
                  <td className="advantage-cell">Snappy responses on local ISP loops</td>
                </tr>
                <tr>
                  <td className="metric-name">Legal Compliance Status</td>
                  <td className="hyperscaler-cell">Data shards pooled globally overseas</td>
                  <td className="driveshare-cell">100% Geo-Fenced to Your Country</td>
                  <td className="advantage-cell">Built-in Compliance with Local Laws</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section: Pricing & Economics */}
      <section id="pricing" className="section">
        <div className="container">
          <div className="sec-title-wrap">
            <span className="sec-subtitle">Network Economics</span>
            <h2 className="sec-title">How We Are Pricing (The DePIN Supply Physics)</h2>
            <p className="sec-desc">
              Everyday Indian gaming systems, broadband links (JioFiber/Airtel Xstream), and student laptops hold unutilized disk space. We pass the savings to startups while maintaining robust gross profit margins.
            </p>
          </div>

          <div className="pricing-grid" style={{ marginBottom: "50px" }}>
            <div className="pricing-controls" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <h3 style={{ fontFamily: "var(--font-outfit)", fontSize: "1.5rem", marginBottom: "16px" }}>
                The Node Provider Payout Pipeline
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: "1.7", marginBottom: "20px" }}>
                We convert standard cloud operations to match Indian DePIN economics. Laptop and gaming PC owners earn stable cash by hosting encrypted shards silently in the background. Unlike cryptocurrency mining, this burns virtually zero graphics capacity or electricity, and works quietly while they sleep.
              </p>
              <div style={{ background: "rgba(0, 255, 204, 0.03)", borderLeft: "3px solid var(--accent-cyan)", padding: "16px", borderRadius: "0 6px 6px 0" }}>
                <span style={{ fontSize: "0.85rem", color: "#ffffff", fontWeight: "600", display: "block" }}>
                  100% Fiat settled (Indian Rupees)
                </span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  No volatile crypto tokens or digital wallet configurations. We pay out directly to local banks via UPI on the 10th of every month.
                </span>
              </div>
            </div>

            <div className="pricing-display">
              <span className="pricing-badge">Sovereign Flat-Rate Pricing</span>
              <table style={{ width: "100%", borderCollapse: "collapse", color: "#ffffff", fontSize: "0.95rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-grid)" }}>
                    <th style={{ padding: "12px 8px", textAlign: "left" }}>Metric</th>
                    <th style={{ padding: "12px 8px", textAlign: "right" }}>Flat Price (Surveillance Grade)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid var(--border-grid)" }}>
                    <td style={{ padding: "16px 8px" }}><strong>Storage</strong> (per TB/month)</td>
                    <td style={{ padding: "16px 8px", textAlign: "right", color: "var(--accent-cyan)", fontWeight: "bold" }}>₹450 ($5.50)</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "16px 8px" }}><strong>Bandwidth</strong> (per TB egress)</td>
                    <td style={{ padding: "16px 8px", textAlign: "right", color: "var(--accent-cyan)", fontWeight: "bold" }}>₹550 ($6.50)</td>
                  </tr>
                </tbody>
              </table>
              <div style={{ marginTop: "24px", background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.25)", padding: "12px", borderRadius: "4px", fontSize: "0.75rem", color: "var(--accent-green)", textAlign: "center" }}>
                <strong>Sovereign Cloud Target</strong>: Keeping files geographically close saves transit hops and provides premium performance.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section III: Interactive Pricing Simulator */}
      <section id="simulator" className="section">
        <div className="container">
          <div className="sec-title-wrap">
            <span className="sec-subtitle">Financial Calculator</span>
            <h2 className="sec-title">Compute Your Operational Savings</h2>
            <p className="sec-desc">
              Benchmark operational storage costs with DriveShare flat-rate pricing against standard AWS S3 rates.
            </p>
          </div>

          <div className="pricing-grid">
            <div className="pricing-controls">
              <div className="control-group">
                <div className="control-label">
                  <span>Storage Scale</span>
                  <span className="control-val">{storage} TB</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="500"
                  value={storage}
                  onChange={(e) => setStorage(Number(e.target.value))}
                  className="slider-input"
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "8px" }}>
                  <span>1 TB</span>
                  <span>250 TB</span>
                  <span>500 TB</span>
                </div>
              </div>

              <div className="control-group">
                <div className="control-label">
                  <span>Estimated Monthly Egress (Downloads)</span>
                  <span className="control-val">{egress} TB</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={egress}
                  onChange={(e) => setEgress(Number(e.target.value))}
                  className="slider-input"
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "8px" }}>
                  <span>0 TB (Cold Storage)</span>
                  <span>25 TB</span>
                  <span>50 TB</span>
                </div>
              </div>

              <div className="control-group" style={{ borderTop: "1px solid var(--border-grid)", paddingTop: "24px" }}>
                <div className="toggle-wrap">
                  <div className="toggle-info">
                    <span style={{ fontSize: "0.95rem", fontWeight: "600", fontFamily: "var(--font-outfit)" }}>CCTV / Surveillance Mode</span>
                    <span className="toggle-desc">Auto-locks storage inputs to standard continuous Surveillance backups (50 TB storage, 5 TB egress).</span>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setStorage(50);
                          setEgress(5);
                        } else {
                          setStorage(10);
                          setEgress(2);
                        }
                      }}
                    />
                    <span className="slider-toggle"></span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pricing-display">
              <span className="pricing-badge">UPI Auto-Mandate Flat-Rate Savings</span>

              <div className="compare-card-grid">
                <div className="comparison-row">
                  <span className="comp-label">AWS S3 Monthly Cost:</span>
                  <span className="comp-val cross">
                    ₹{totalAwsCost.toLocaleString("en-IN")}
                    <span style={{ fontSize: "0.75rem", display: "block", textAlign: "right", color: "var(--text-muted)", fontWeight: "normal" }}>
                      (Storage: ₹{awsStorageCost.toLocaleString("en-IN")} + Egress: ₹{awsEgressCost.toLocaleString("en-IN")})
                    </span>
                  </span>
                </div>

                <div className="comparison-row">
                  <span className="comp-label" style={{ color: "var(--accent-cyan)" }}>DriveShare Monthly Flat:</span>
                  <span className="comp-val text-cyan">
                    ₹{totalDriveShareCost.toLocaleString("en-IN")}
                    <span style={{ fontSize: "0.75rem", display: "block", textAlign: "right", color: "var(--accent-cyan)", fontWeight: "normal", opacity: 0.8 }}>
                      (Storage: ₹{driveShareStorageCost.toLocaleString("en-IN")} + Egress: ₹{driveShareEgressCost.toLocaleString("en-IN")})
                    </span>
                  </span>
                </div>

                <div className="savings-card">
                  <div className="savings-label">Direct Monthly Operational Savings ({savingsPercent}%)</div>
                  <div className="savings-amount">₹{totalSavings.toLocaleString("en-IN")} / mo</div>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "8px" }}>
                    Billed locally in INR via secure UPI Auto-Mandates. Zero overseas transaction overhead.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Supply Side & Preventing Fraud */}
      <section id="supply-side" className="section" style={{ borderBottom: "1px solid var(--border-grid)" }}>
        <div className="container">
          <div className="sec-title-wrap">
            <span className="sec-subtitle">Proof of Integrity</span>
            <h2 className="sec-title">Preventing Fraud: The Vetting &amp; Escrow System</h2>
            <p className="sec-desc">
              We do not blindly trust nodes. DriveShare runs an automated cryptographic system to guarantee your data fragments are securely retrievable 24/7.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "40px" }} className="pricing-grid">
            <div>
              <div style={{ display: "flex", gap: "16px", marginBottom: "28px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(0, 255, 204, 0.05)", border: "1px solid rgba(0, 255, 204, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-cyan)", flexShrink: 0 }}>
                  <Clock size={18} />
                </div>
                <div>
                  <h4 style={{ fontFamily: "var(--font-outfit)", fontSize: "1.1rem", fontWeight: "600", marginBottom: "6px" }}>
                    1. Hourly Heartbeat Challenges
                  </h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
                    Our central gateway routinely tests host laptops. Daemons receive automated checks requiring the unique fingerprint hash of a specific file shard byte position range. Failure to answer hourly checks forfeits payout earnings.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", marginBottom: "28px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(0, 255, 204, 0.05)", border: "1px solid rgba(0, 255, 204, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-cyan)", flexShrink: 0 }}>
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <h4 style={{ fontFamily: "var(--font-outfit)", fontSize: "1.1rem", fontWeight: "600", marginBottom: "6px" }}>
                    2. The Held-Back Security Deposit
                  </h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
                    Node laptops are vetted: Months 1-3 hold 75% earnings in escrow; Months 4-9 hold 50%. A graceful exit spending 24 hours transferring files back to network peers unlocks the deposit. Vanishing unannounced forfeits deposits immediately.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(0, 255, 204, 0.05)", border: "1px solid rgba(0, 255, 204, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-cyan)", flexShrink: 0 }}>
                  <Coins size={18} />
                </div>
                <div>
                  <h4 style={{ fontFamily: "var(--font-outfit)", fontSize: "1.1rem", fontWeight: "600", marginBottom: "6px" }}>
                    3. Localized monthly UPI bank Payouts
                  </h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
                    No speculative crypto wallets. Providers are paid direct to their bank accounts on the 10th of every month using Indian Rupees (₹) UPI Auto-Transfers, IMPS bank routes, or Amazon Pay vouchers.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ background: "var(--bg-carbon)", border: "1px solid var(--border-grid)", borderRadius: "8px", padding: "32px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--accent-cyan)", marginBottom: "8px" }}>
                $ driveshare-challenge --node-id=abv_iiitm_gp12
              </div>
              <div style={{ background: "var(--bg-obsidian)", border: "1px solid var(--border-grid)", padding: "20px", borderRadius: "6px", fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "#c9d1d9", lineHeight: "1.6" }}>
                <span className="text-muted">[03:00 AM]</span> Sending hourly challenge...<br />
                <span className="text-cyan">Target Shard:</span> ds_shard_bf812c9a<br />
                <span className="text-cyan">Byte Positions:</span> [4000:4500]<br />
                <span className="text-green">Challenge Answer:</span> SHA256(ds_shard_bf812c9a[4000:4500])<br />
                <span className="text-green">&rarr; SHA256 Match! Payout Escrow Updated. Node Vetted.</span>
              </div>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "16px", textAlign: "center" }}>
                Continuous programmatic Proof of Retrievability secures data block durability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section V: Cryptographic Guarantee */}
      <section id="security" className="section" style={{ borderBottom: "1px solid var(--border-grid)" }}>
        <div className="container">
          <div className="security-card">
            <div className="security-icon-wrap">
              <ShieldCheck size={48} />
            </div>
            <div className="security-content">
              <h3>Cryptographic Data Security Guarantee</h3>
              <p>
                All files passing through the DriveShare client engine are strictly encrypted <strong>client-side</strong> using secure, military-grade <strong>AES-256 GCM</strong> cipher keys.
                Your team retains absolute control of primary key rings—neither our API gateway plane nor hosting endpoints ever touch unencrypted payloads.
                Files are split into discrete data shards distributed across individual consumer laptops and campus loops.
                Even in cases of direct host intrusion or complete system image dumps by node providers, your corporate logs and video recordings remain mathematically unreadable and perfectly isolated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-content">
          <div>
            <div className="footer-logo">DriveShare<span>.in</span></div>
            <p style={{ marginTop: "8px", fontSize: "0.8rem" }}>
              Bharat&apos;s Decentralized Storage Infrastructure.
            </p>
          </div>

          <div className="footer-meta">
            <span>&copy; {new Date().getFullYear()} DriveShare Technologies Private Limited.</span>
            <a href="http://localhost:3001" className="nav-link" style={{ fontSize: "0.8rem" }}>Documentation</a>
            <a href="http://localhost:3001#downloads" className="nav-link" style={{ fontSize: "0.8rem" }}>CLI Core Downloads</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
