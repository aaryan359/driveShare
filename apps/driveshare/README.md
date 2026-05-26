# Sovereign DriveShare Developer Console Portal (`driveshare`)

This directory represents the **complete, self-contained standalone client portal application** for the DriveShare.in network console.

---

## ⚡ Visual Architecture Features:
1. **Premium Dark Mode Theme (Midnight Matrix)**: Fully loaded with glassmorphic cards, discrete Outline styles, neon status indicators, and grid fabric overlays.
2. **Sovereign Authorization (Email + Registration + Google SSO)**:
   * Connected directly to relational credential verification backends.
   * Includes a styled dummy button for **Google Enterprise Single Sign-On (SSO)**, mimicking complete production credential broker pathways.
3. **Workspace Bucket Credentials CRUD Manager**:
   * Create dynamic sovereign workspace buckets (`POST /api/v1/projects`).
   * Displays temporary Access Keys and Secret hashes only once during creation.
   * Revoke/Delete capabilities (`DELETE /api/v1/projects/:id`).
4. **Client-Side WASM & WebRTC P2P upload Visualizer**:
   * Interactive dashboard block where choosing any file lets you launch a live sharding conveyor belt.
   * Visually maps out:
     * **Phase 1: Token Handshake** (gets 8 active node routes).
     * **Phase 2: NAT Punching WebRTC Signal Tunneling** (sdp offer/answer swaps).
     * **Phase 3: WASM Shattering (Erasure Coding XOR formula computations)**.
     * **Phase 4: Concurrent Direct P2P Streams** (carrying shards directly from the user's laptop to 8 rotating node laptops).
     * **Phase 5: Confirm Registry**.

---

## 🚀 How to Run Standalone:
To start the developer console on its dedicated port `3003` in parallel with your gateway server (port `3002`) and landing page (port `3000`), run:

```bash
cd apps/driveshare
npm run dev
```

Then open your browser and navigate to **`http://localhost:3003`**!
