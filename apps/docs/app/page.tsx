"use client";

import React, { useState } from "react";
import { 
  Server, 
  ShieldCheck, 
  Terminal, 
  Settings, 
  ChevronRight, 
  Download, 
  ArrowRight, 
  Check, 
  FileCode, 
  Cloud,
  Layers,
  Zap,
  Shield,
  HelpCircle,
  TrendingUp,
  RotateCcw,
  BookOpen
} from "lucide-react";

export default function Docs() {
  const [activeSection, setActiveSection] = useState("s3-gateway");

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Network Fabric Mesh background */}
      <div className="grid-overlay"></div>

      {/* Sticky Blurred Docs Header */}
      <header className="header-docs">
        <div className="docs-header-container">
          <a href="#" className="logo-docs">
            <div className="logo-icon-docs">DS</div>
            DriveShare<span>.docs</span>
            <span className="badge-docs">Core v1.0.2</span>
          </a>
          
          <div className="header-links-docs">
            <a href="http://localhost:3000" className="header-link-docs">Portal Gateway</a>
            <a href="http://localhost:3000#simulator" className="header-link-docs">Pricing Simulator</a>
            <a href="#downloads" className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem", display: "inline-flex", gap: "6px" }}>
              <Download size={14} /> CLI binaries
            </a>
          </div>
        </div>
      </header>

      {/* Main Docs Interface */}
      <div className="docs-layout-grid">
        {/* Sticky Left Sidebar Navigation */}
        <aside className="docs-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Getting Started</h3>
            <ul className="sidebar-menu">
              <li>
                <a 
                  onClick={() => scrollToSection("architecture")} 
                  className={`sidebar-item-link ${activeSection === "architecture" ? "active" : ""}`}
                  style={{ cursor: "pointer" }}
                >
                  <Layers size={14} /> System Architecture
                </a>
              </li>
            </ul>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Core Product Docs</h3>
            <ul className="sidebar-menu">
              <li>
                <a 
                  onClick={() => scrollToSection("s3-gateway")} 
                  className={`sidebar-item-link ${activeSection === "s3-gateway" ? "active" : ""}`}
                  style={{ cursor: "pointer" }}
                >
                  <Server size={14} /> 1. S3 Storage Gateway
                </a>
              </li>
              <li>
                <a 
                  onClick={() => scrollToSection("cctv-watcher")} 
                  className={`sidebar-item-link ${activeSection === "cctv-watcher" ? "active" : ""}`}
                  style={{ cursor: "pointer" }}
                >
                  <Cloud size={14} /> 2. Micro-Client watcher
                </a>
              </li>
              <li>
                <a 
                  onClick={() => scrollToSection("retention-policies")} 
                  className={`sidebar-item-link ${activeSection === "retention-policies" ? "active" : ""}`}
                  style={{ cursor: "pointer" }}
                >
                  <ShieldCheck size={14} /> 3. Cryptographic Shred
                </a>
              </li>
            </ul>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Supply Physics</h3>
            <ul className="sidebar-menu">
              <li>
                <a 
                  onClick={() => scrollToSection("supply-economics")} 
                  className={`sidebar-item-link ${activeSection === "supply-economics" ? "active" : ""}`}
                  style={{ cursor: "pointer" }}
                >
                  <TrendingUp size={14} /> Passive Income Engine
                </a>
              </li>
              <li>
                <a 
                  onClick={() => scrollToSection("heartbeats")} 
                  className={`sidebar-item-link ${activeSection === "heartbeats" ? "active" : ""}`}
                  style={{ cursor: "pointer" }}
                >
                  <Zap size={14} /> Proof of Retrievability
                </a>
              </li>
              <li>
                <a 
                  onClick={() => scrollToSection("escrows")} 
                  className={`sidebar-item-link ${activeSection === "escrows" ? "active" : ""}`}
                  style={{ cursor: "pointer" }}
                >
                  <Shield size={14} /> Trust-Building Escrows
                </a>
              </li>
              <li>
                <a 
                  onClick={() => scrollToSection("payments")} 
                  className={`sidebar-item-link ${activeSection === "payments" ? "active" : ""}`}
                  style={{ cursor: "pointer" }}
                >
                  <Check size={14} /> Localized UPI Payouts
                </a>
              </li>
            </ul>
          </div>
        </aside>

        {/* Scrollable Right Documentation Feed */}
        <main className="docs-content-container">
          
          {/* Section: System Architecture */}
          <section id="architecture" className="doc-section-block">
            <span className="doc-pre-title">Core Fabric</span>
            <h2 className="doc-main-title">DriveShare Hybrid Control Plane Architecture</h2>
            <p className="doc-para">
              DriveShare aggregates unused, consumer-grade hard drive capacity and high-speed broadband links—such as idle student laptops on campus local area networks (LANs) and gaming setups running on JioFiber or Airtel Xstream—into a production-grade virtual cloud fabric.
            </p>
            <p className="doc-para">
              To provide absolute stability without operational risk on day one, DriveShare operates on a Hybrid Control Plane. Standard enterprise S3 API requests pipe through our Node.js S3 Stream Passthrough Middleware Engine, which divides, encrypts, and shards files in real-time. These chunks are safely sharded globally across Storj/Filebase meshes while the native node loop migrates directly onto allocated Indian campus provider laptops during closed off-peak hours (1:00 AM to 6:00 AM).
            </p>

            <div className="doc-card-grid">
              <div className="doc-card">
                <div className="doc-card-icon"><Server size={18} /></div>
                <h4 className="doc-card-title">Day-One API Gateway</h4>
                <p className="doc-card-desc">S3 Stream Passthrough buffer gateway pipes chunks over enterprise decentralized networks with 99.99999% durability.</p>
              </div>
              <div className="doc-card">
                <div className="doc-card-icon"><Zap size={18} /></div>
                <h4 className="doc-card-title">Native DePIN Node Fabric</h4>
                <p className="doc-card-desc">Outboundsecure WebSockets and WireGuard tunnels bypass campuse NAT firewalls, utilizing off-peak student bandwidth.</p>
              </div>
            </div>
          </section>

          {/* Section 1: S3 Compatible Storage Gateway */}
          <section id="s3-gateway" className="doc-section-block">
            <span className="doc-pre-title">Product Feature 01</span>
            <h2 className="doc-main-title">S3-Compatible Storage Gateway</h2>
            <p className="doc-para">
              Enterprise tech startups do not want to rewrite their underlying data handlers to support peer-to-peer protocols. DriveShare exposes a fully compliant S3-Compatible API endpoint. Startup engineers simply update their configuration environment variables to point directly to our low-latency domestic gateways.
            </p>

            <div className="doc-highlight-box">
              <h4 className="doc-highlight-title">Zero Codebase Modifications</h4>
              <p className="doc-highlight-desc">
                Simply swap your target S3 destination endpoint variable to point to <code>https://api.driveshare.in</code>. Standard integrations like the AWS CLI, Winston, Logstash, Winston/Logstash logging, and boto3 python scripts operate seamlessly.
              </p>
            </div>

            <div className="doc-terminal">
              <div className="doc-terminal-header">
                <div className="doc-terminal-dots">
                  <div className="doc-terminal-dot"></div>
                  <div className="doc-terminal-dot"></div>
                  <div className="doc-terminal-dot"></div>
                </div>
                <span className="doc-terminal-title">.env (Startup Environment File)</span>
              </div>
              <div className="doc-terminal-body">
                <span className="comment"># Swap AWS S3 standard endpoint to point to DriveShare Gateway</span><br />
                <span className="property">AWS_ENDPOINT_URL</span>=<span className="string">&quot;https://api.driveshare.in&quot;</span><br />
                <span className="property">AWS_ACCESS_KEY_ID</span>=<span className="string">&quot;ds_access_key_live_793b2&quot;</span><br />
                <span className="property">AWS_SECRET_ACCESS_KEY</span>=<span className="string">&quot;ds_secret_key_live_99ac24e81b674&quot;</span><br />
                <span className="property">AWS_DEFAULT_REGION</span>=<span className="string">&quot;ap-south-1&quot;</span> <span className="comment"># Domestic Indian Node Routing</span>
              </div>
            </div>

            <div className="doc-terminal">
              <div className="doc-terminal-header">
                <div className="doc-terminal-dots">
                  <div className="doc-terminal-dot"></div>
                  <div className="doc-terminal-dot"></div>
                  <div className="doc-terminal-dot"></div>
                </div>
                <span className="doc-terminal-title">example-config.tf (Terraform)</span>
              </div>
              <div className="doc-terminal-body">
                <span className="comment"># Terraform Object Storage Bucket Setup</span><br />
                <span className="keyword">provider</span> <span className="string">&quot;aws&quot;</span> &#123;<br />
                &nbsp;&nbsp;<span className="property">alias</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= <span className="string">&quot;driveshare&quot;</span><br />
                &nbsp;&nbsp;<span className="property">region</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= <span className="string">&quot;ap-south-1&quot;</span><br />
                &nbsp;&nbsp;<span className="property">access_key</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= <span className="string">&quot;ds_access_key_live_793b2&quot;</span><br />
                &nbsp;&nbsp;<span className="property">secret_key</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= <span className="string">&quot;ds_secret_key_live_99ac24e81b674&quot;</span><br />
                &nbsp;&nbsp;<span className="property">skip_credentials_validation</span> = <span className="number">true</span><br />
                &nbsp;&nbsp;<span className="property">skip_metadata_api_check</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= <span className="number">true</span><br />
                &nbsp;&nbsp;<span className="property">skip_region_validation</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= <span className="number">true</span><br /><br />
                &nbsp;&nbsp;<span className="keyword">endpoints</span> &#123;<br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="property">s3</span> = <span className="string">&quot;https://api.driveshare.in&quot;</span><br />
                &nbsp;&nbsp;&#125;<br />
                &#125;
              </div>
            </div>
          </section>

          {/* Section 2: Micro-Client Watcher */}
          <section id="cctv-watcher" className="doc-section-block">
            <span className="doc-pre-title">Product Feature 02</span>
            <h2 className="doc-main-title">Micro-Client &quot;Folder Watcher&quot; (CCTV/Surveillance)</h2>
            <p className="doc-para">
              CCTV operators, campus security teams, and shop owners are not software engineers. They need a simple, lightweight system utility that sits silently alongside their active recording systems (Milestone, CP Plus, Blue Iris, CP Plus Dahua firmware) and handles synchronization automatically.
            </p>
            <p className="doc-para">
              The DriveShare Client Daemon operates a background folder watcher. When active video capture software writes local split video fragments, our folder watcher compresses, formats, client-side encrypts, and syncs the data blocks overnight (typically 12:00 AM to 5:00 AM) to maintain operational bandwidth throughout the day.
            </p>

            <div className="doc-terminal">
              <div className="doc-terminal-header">
                <div className="doc-terminal-dots">
                  <div className="doc-terminal-dot"></div>
                  <div className="doc-terminal-dot"></div>
                  <div className="doc-terminal-dot"></div>
                </div>
                <span className="doc-terminal-title">Rclone Scheduled Syncing Script (Linux Crontab / Windows Task)</span>
              </div>
              <div className="doc-terminal-body">
                <span className="comment"># Scheduled execution command at 1:00 AM to backup Surveillance captures</span><br />
                <span className="keyword">rclone</span> sync <span className="string">&quot;C:\CCTV_Media\Active_Capture\&quot;</span> <span className="string">&quot;driveshare-remote:cctv-backup-vault&quot;</span> \<br />
                &nbsp;&nbsp;--bwlimit <span className="string">&quot;12 AM-06 AM:50M,06 AM-12 AM:2M&quot;</span> \<br />
                &nbsp;&nbsp;--log-file=<span className="string">&quot;C:\DriveShare_Logs\sync.log&quot;</span>
              </div>
            </div>

            <div className="doc-highlight-box" style={{ borderColor: "var(--accent-green)", background: "rgba(16, 185, 129, 0.03)" }}>
              <h4 className="doc-highlight-title" style={{ color: "var(--accent-green)" }}>Continuous Bandwidth Throttling Mechanics</h4>
              <p className="doc-highlight-desc">
                The <code>--bwlimit</code> throttle restricts DriveShare uploads to a minimal 2MB/s during the active working daylight hours (6:00 AM to midnight) to preserve bandwidth for regular office work, automatically scaling to a high-capacity 50MB/s pipe between midnight and 6:00 AM.
              </p>
            </div>
          </section>

          {/* Section 3: Automated Retention & Cryptographic Shredding */}
          <section id="retention-policies" className="doc-section-block">
            <span className="doc-pre-title">Product Feature 03</span>
            <h2 className="doc-main-title">Automated Retention &amp; &quot;Cryptographic Shredding&quot;</h2>
            <p className="doc-para">
              Tech startups want logs cleared out after 30 or 90 days to control bills, and CCTV archives must legally purge archives after a month. 
            </p>
            <p className="doc-para">
              Because files are sharded into hundreds of fragments hosted across student laptops throughout India, forcing these individual consumer endpoints to delete cached local blocks reliably is physically impossible. DriveShare solves this via an elegant architectural pattern: **Cryptographic Shredding**.
            </p>

            <div className="doc-highlight-box">
              <h4 className="doc-highlight-title">Central Key Registry Registry</h4>
              <p className="doc-highlight-desc">
                All files sharded onto the network are encrypted client-side using unique keys registered inside the central secure registry. When a bucket object reaches its expiration date under the automated retention policy, our gateway permanently deletes the key from the registry. Instantly, all pieces hosted across the consumer loop become permanently unrecoverable, broken digital noise, satisfying data purging compliance perfectly.
              </p>
            </div>
          </section>

          {/* Section: Passive Income Economics */}
          <section id="supply-economics" className="doc-section-block">
            <span className="doc-pre-title">Supply Side Physics 01</span>
            <h2 className="doc-main-title">Passive Income Engine for Indian Node Providers</h2>
            <p className="doc-para">
              An idle student laptop or standard home gaming PC sits on two wasting assets: unutilized hard drive space (typical 200 GB to 1 TB) and active flat-rate broadband subscriptions (JioFiber, Airtel Xstream, campus local loops). DriveShare offers nodes a zero-effort passive income model: **"Turn your empty hard drive space into passive income while you sleep."**
            </p>
            <p className="doc-para">
              Unlike cryptocurrency mining, which pushes graphics cards to 100% capacity, burns massive electricity, degrades silicon, and generates extreme heat, background object storage consumes virtually zero processor resources. The hard drive spins silently in the background, and the network only uses bandwidth when data fragments are uploaded or requested.
            </p>

            <div className="eco-table-wrapper">
              <table className="eco-table">
                <thead>
                  <tr>
                    <th>Storage Parameter</th>
                    <th>Startup/CCTV Cost (Charged)</th>
                    <th>Node Provider Payment (Earned)</th>
                    <th>DriveShare Gross Profit Margin</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Storage Used</strong> (per TB / month)</td>
                    <td className="accent-td">₹450 ($5.50)</td>
                    <td className="green-td">₹125 ($1.50)</td>
                    <td>~72% Gross Margin</td>
                  </tr>
                  <tr>
                    <td><strong>Bandwidth Egress</strong> (per TB downloaded)</td>
                    <td className="accent-td">₹550 ($6.50)</td>
                    <td className="green-td">₹165 ($2.00)</td>
                    <td>~70% Gross Margin</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="doc-highlight-box" style={{ borderColor: "var(--accent-green)", background: "rgba(16, 185, 129, 0.03)" }}>
              <h4 className="doc-highlight-title" style={{ color: "var(--accent-green)" }}>Low Download Egress Profiles</h4>
              <p className="doc-highlight-desc">
                Startups archiving logs or retail CCTV nodes rarely request downloads. The vast majority of operations are flat storage deposits. This dynamic keeps egress bills exceptionally low, ensuring highly predictable earnings for laptop nodes and high-margin, AWS-undercutting rates for DriveShare.
              </p>
            </div>
          </section>

          {/* Section: Heartbeat Challenges */}
          <section id="heartbeats" className="doc-section-block">
            <span className="doc-pre-title">Supply Side Physics 02</span>
            <h2 className="doc-main-title">Automated Cryptographic Heartbeat Challenges</h2>
            <p className="doc-para">
              You cannot simply trust provider nodes when they claim, &quot;Yes, we are totally keeping your customers' data safe!&quot; A gaming node might easily format their drive or delete your encrypted file blocks to install a new high-resource video game while continuing to collect storage payouts.
            </p>
            <p className="doc-para">
              To prevent fraud, DriveShare implements a **Proof of Retrievability (PoR)** system. Our central control plane continuously issues automated hourly cryptographic challenge checks to the system daemons running on node laptops.
            </p>

            <div className="doc-highlight-box">
              <h4 className="doc-highlight-title">Proof of Retrievability Flow</h4>
              <p className="doc-highlight-desc">
                The challenge prompts: <em>&quot;Return the unique SHA-256 fingerprint hash of byte positions 4,000 to 4,500 of the encrypted file shard X.&quot;</em> If the node has deleted the file or turned off their computer permanently, they fail the challenge. If they pass, it proves they actively host the customer's data shard.
              </p>
            </div>
          </section>

          {/* Section: Escrows */}
          <section id="escrows" className="doc-section-block">
            <span className="doc-pre-title">Supply Side Physics 03</span>
            <h2 className="doc-main-title">Trust-Building Escrows &amp; the Withholding System</h2>
            <p className="doc-para">
              To guarantee that node providers do not delete local files or disconnect their laptops without warning—which would damage the redundancy of the distributed mesh—DriveShare deploys a **Held-Back Security Deposit Withholding System**.
            </p>

            <div className="workflow-graph-wrapper">
              <div className="workflow-node-grid">
                <div className="wf-node active">
                  <div className="wf-node-title">1. Node Registration</div>
                  <div className="wf-node-desc">Client daemon connects. Mesh begins allocating encrypted fragments.</div>
                </div>
                <div className="wf-arrow"><ArrowRight size={20} /></div>
                <div className="wf-node active">
                  <div className="wf-node-title">2. Month 1-3 (75% Held)</div>
                  <div className="wf-node-desc">Receives files. 75% of storage earnings locked in network escrow. Heartbeats sent hourly.</div>
                </div>
                <div className="wf-arrow"><ArrowRight size={20} /></div>
                <div className="wf-node">
                  <div className="wf-node-title">3. Month 4-9 (50% Held)</div>
                  <div className="wf-node-desc">Verification advances. Withholding split drops to 50% cash payout, 50% held.</div>
                </div>
              </div>
            </div>

            <p className="doc-para">
              <strong>Graceful Exit Mechanism:</strong> If a node wants to disconnect their laptop permanently and retire from the network, they must click the &quot;Graceful Exit&quot; action button in their client panel. Their app spends 24 hours transferring all their sharded customer blocks back to active network peers. Once successfully complete, 100% of their accumulated security escrow deposit is released directly to their account. If a node vanishes without warning, their escrow is immediately forfeited to cover network repair costs.
            </p>
          </section>

          {/* Section: Payments */}
          <section id="payments" className="doc-section-block">
            <span className="doc-pre-title">Supply Side Physics 04</span>
            <h2 className="doc-main-title">Seamless Rupee Payments via Auto-UPI</h2>
            <p className="doc-para">
              While global DePIN networks fail by paying node providers in highly volatile crypto tokens—which creates extreme UX friction, wallet setup hurdles, and taxation compliance issues—DriveShare completely eliminates this barrier.
            </p>
            <p className="doc-para">
              DriveShare operates a seamless fiat-settled checkout cycle. Startups pay in Indian Rupees (₹) via corporate accounts, and node providers are paid out in **Indian Rupees (₹)** directly via automated monthly UPI transfers, IMPS bank routes, or Amazon Pay vouchers. 
            </p>

            <div className="doc-highlight-box" style={{ borderColor: "var(--accent-green)", background: "rgba(16, 185, 129, 0.03)" }}>
              <h4 className="doc-highlight-title" style={{ color: "var(--accent-green)" }}>Reliable Monthly Payouts</h4>
              <p className="doc-highlight-desc">
                Payouts are settled and deposited directly on the **10th of every month**. By making the payout look like a regular, reliable Cash Payout rather than a speculative crypto trade, DriveShare makes hosting files highly appealing to university students, gamers, and tech-savvy consumers in India.
              </p>
            </div>
          </section>

          {/* Download Core system tooling */}
          <section id="downloads" className="download-sec-docs">
            <h3 className="sidebar-title">Download Compiled Core Binaries</h3>
            <div className="dbtn-grid">
              <a href="#" className="dbtn">
                <span>CLI Daemon v1.0.2 (Linux x64)</span>
                <Download size={14} />
              </a>
              <a href="#" className="dbtn">
                <span>CLI Daemon v1.0.2 (Windows x64)</span>
                <Download size={14} />
              </a>
              <a href="#" className="dbtn" style={{ gridColumn: "span 2" }}>
                <span>Standard DriveShare Setup Bootstrapper (.bat / .sh)</span>
                <Download size={14} />
              </a>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
