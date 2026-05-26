# DriveShare: Sovereign P2P Cloud Storage Portal

DriveShare is a decentralized, high-performance, and secure Peer-to-Peer (P2P) storage ledger mesh specifically built for Indian startups, CCTV surveillance operators, and enterprise customers. 

Traditional storage systems rely on expensive, centralized international hyper-scalers (like AWS S3) which suffer from high egress charges, potential data leaks, and compliance issues with local laws. DriveShare solves this by utilizing client-side volunteer nodes located strictly within India to distribute, store, and reconstruct data on-demand.

This repository implements the production-grade client console of the DriveShare platform.

---

## How DriveShare Works

Instead of uploading a whole, unencrypted file to a single cloud server, DriveShare leverages advanced web technologies to slice, secure, and scatter data across a network:

1. **Local Encryption & Sharding (WASM)**  
   When you upload a file (such as a CCTV video block or database backup), it is never sent in its original form. Locally inside your browser, a high-speed Rust-compiled WebAssembly container splits the file into 8 distinct cryptographic shards (using Reed-Solomon erasure coding formulas).

2. **Decentralized Direct Tunnels (WebRTC)**  
   The application communicates with active volunteer peer nodes across India. Using WebRTC technology, the browser establishes direct, parallel peer-to-peer data channels to 8 active volunteer node laptops and servers. This bypasses intermediary servers entirely, cutting egress fees and middleman latency.

3. **Geofenced Indian Grid Storage**  
   The shards are streamed concurrently to volunteer nodes located in geo-fenced regions of India (Delhi NCR, Mumbai, Pune, Bengaluru). This ensures 100% compliance with local DPDP (Digital Personal Data Protection) laws since your physical shards never leave Indian sovereign borders.

4. **Fault-Tolerant Reconstruction**  
   Because of the Reed-Solomon formula (which includes redundant parity data), even if some volunteer nodes go offline or turn off their laptops, the system can rebuild your original file using only a subset of the remaining active shards instantly in-browser.

---

## Main Features of the DriveShare Portal

The console is broken down into four core, fully functional sections:

### 1. Interactive Telemetry Dashboard
* **Leased Storage Capacity Allocation**: Displays a detailed progress gauge of your organization's rented storage capacity (e.g., 500 GB pre-paid tier) versus active consumed space.
* **Storage Breakdown**: Real-time categorization segmenting storage into raw surveillance CCTV feeds, logs databases, and Reed-Solomon parity shards.
* **Indian Active Node Leases Grid**: Real-time table displaying contract leases from active geolocated volunteer clusters in India, node UPI payout details, lease rates, and DPDP compliance status.

### 2. WASM Sharding Engine Simulator
* Select any dummy file to launch a real-time, step-by-step parallel WebRTC transfer stream simulation.
* Watch the entire lifecycle execute: Sovereign Token Handshake ➜ WebRTC NAT Punching ➜ WASM Erasure Shattering ➜ P2P Streaming ➜ Indian Registry Confirmation.
* Review detailed telemetry console logs stream live in the interactive terminal box.

### 3. Flat INR Billing & Pre-paid UPI Wallet
* **Zero Forex Risk**: DriveShare operates completely in flat Indian Rupees (INR), avoiding fluctuating foreign currency exchange rates and credit card dependencies.
* **Razorpay UPI Wallet Loader**: Top-up your pre-paid wallet balance instantly using simulated Razorpay gateways.
* **Outstanding Invoice Pay Flow**: View and settle current outstanding monthly bills (e.g., active May 2026 storage fees) directly from your pre-paid wallet balance in a single click, complete with live aggregates and confetti.

### 4. Decentralized Buckets Manager (CRUD)
* Register new storage buckets with custom access restrictions.
* Instantly generate S3-compatible security credentials (Access Key, Secret Key, and connection configurations) to integrate DriveShare seamlessly into your existing applications.

---

## Repository Structure & Organization

The codebase is organized as a modular, high-performance monorepo:

* **`apps/driveshare/`**: The core frontend console application built with **React**, **TypeScript**, **Redux Toolkit**, and **Vite**.
* **`packages/ui/`**: Shared design system components.
* **`packages/shared/`**: Common TypeScript models, constants, and utilities.

---

## Getting Started & Local Development

Follow these steps to run the DriveShare sovereign portal locally:

### 1. Prerequisites
Ensure you have **Node.js** (v18 or higher) installed on your system.

### 2. Install Dependencies
Run the following command at the root of the project to install all monorepo dependencies:
```sh
npm install
```

### 3. Start the Local Development Server
Launch the development server for the main DriveShare application:
```sh
npm run dev --workspace=driveshare
```
This runs the console locally at **`http://localhost:3003`**.

### 4. Build for Production
To test production builds and verify complete TypeScript type safety across the monorepo, run:
```sh
npm run build --workspace=driveshare
```
This compiles the application and outputs optimized static assets into the `dist/` directory.

---

## Demo Sandbox Credentials
To easily test the portal inside the developer environment without manual registration, use the sandbox fast-fill options on the login screen, or log in with the following default inputs:
* **Email**: `founder@company.in` or `operator@cctv.in`
* **Passphrase**: Any passphrase (e.g. `secret123`)
