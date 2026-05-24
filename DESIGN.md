# DriveShare Design System Spec (Bharat's Decentralized Cloud Fabric)

This document establishes the dark, data-dense, minimalist design tokens and layout structure for DriveShare (driveshare.in), drawing inspiration from developer-centric tools like Terraform and Bifrost.

## Core Design System Tokens

### 1. Colors & Theme (Midnight Matrix)
*   **Background (Primary)**: `#090D16` (Deep Midnight Obsidian)
*   **Background (Secondary)**: `#111827` (Dark Charcoal Carbon)
*   **Background (Muted/Elevated)**: `#1F2937` (Tech Slate Grey)
*   **Accent Color (Primary)**: `#00FFCC` (Matrix Neon Cyan - HSL 170, 100%, 50%)
*   **Accent Color (Secondary)**: `#10B981` (Emerald Green - HSL 160, 84%, 39%)
*   **Text (Primary)**: `#F3F4F6` (Near White)
*   **Text (Secondary/Muted)**: `#9CA3AF` (Sleek Muted Grey)
*   **Border Color**: `#374151` / `#1F2937` (Discrete Grid Lines)

### 2. Typography
*   **Heading Font**: `Outfit` (Modern, geometric, premium tech feel)
*   **Body Font**: `Inter` / `Plus Jakarta Sans` (Clean, highly readable technical copy)
*   **Monospace Font**: `Fira Code` / `JetBrains Mono` (Terminal blocks, configs, CLI details)

### 3. Corners & Spacing (Sleek Developer Borders)
*   **Card Roundness**: `6px` / `8px` (Sleek, sharp angles that convey industrial structural integrity)
*   **Borders**: `1px` solid, using semi-transparent colors or glowing cyan gradients on focus.
*   **Grid Layouts**: Clean geometric lines reminiscent of network topologies.

---

## Screen & Section Architecture

### 1. Hero Block (The Hook)
*   **Headline**: "S3-Compatible Storage. 70% Cheaper than AWS. 100% Geo-Fenced inside India."
*   **Copy**: Detailed paragraph highlighting the peer-to-peer virtual cloud matrix, low latency, flat INR UPI billing, and full DPDP Act compliance.
*   **CTA Action Elements**: 
    *   `[ Deploy Now via S3 API ]` - Primary high-contrast neon cyan button.
    *   `[ View Integration Docs ]` - Secondary outline tech button.

### 2. Live Performance Metric & Trust Realities Grid
*   Comparative tabular layout showcasing **AWS S3** vs **DriveShare Cloud Network** vs **The Structural Advantage** (Storage cost, download egress, latency, compliance).
*   Visual indicators (cyan ticks vs red crosses).

### 3. Interactive S3 Pricing & Node Capacity Simulator
*   Dynamic interactive slider letting startups or CCTV operators scale their data footprint (from 1 TB to 500 TB) and see immediate monthly flat INR savings and zero-egress benefits.

### 4. Developer API & CCTV Module Documentation
*   Dual-tab workspace switcher showing **Terraform S3 Integration Code** and **CCTV Rclone Night-Owl sync instructions**.
*   A stylized dark terminal panel with syntax-highlighted code snippets.
*   Interactive CLI download options (Go-compiled CLI, batch configuration files).

### 5. Cryptographic Data Security Shield
*   Visual lock badge detailing the client-side AES-256 zero-knowledge guarantee.
