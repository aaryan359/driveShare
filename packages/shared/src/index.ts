/**
 * Shared Type Definitions for the Sovereign DriveShare Network
 */

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: 'FOUNDER' | 'CCTV_OPERATOR' | 'ENTERPRISE_CLIENT';
  createdAt: string;
  walletBalanceINR: number;
}

export interface CustomerProject {
  id: string;
  userId: string;
  name: string;
  accessKeyId: string;
  secretAccessKeyHash: string; // Hashed secret
  isActive: boolean;
  createdAt: string;
  currentStorageBytes: string; // string representation of BigInt
  totalEgressBytes: string; // string representation of BigInt
}

export interface BillingInvoice {
  id: string;
  userId: string;
  amountINR: number;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  razorpayOrderId: string | null;
  billingPeriod: string;
  createdAt: string;
}

export type UploadPhase = 
  | 'IDLE'
  | 'TOKEN_HANDSHAKE'
  | 'NAT_PUNCHING'
  | 'WASM_SHATTERING'
  | 'P2P_STREAMING'
  | 'CONFIRM_REGISTRY'
  | 'COMPLETED'
  | 'FAILED';

export interface FileShardInfo {
  nodeId: string;
  nodeIp: string;
  nodeUpi: string;
  shardIndex: number;
  progress: number;
  status: 'CONNECTING' | 'STREAMING' | 'VERIFYING' | 'SUCCESS' | 'FAILED';
}

export interface WasmUploadState {
  phase: UploadPhase;
  progress: number; // 0 to 100
  activeNodesCount: number;
  shardsCount: number;
  shards: FileShardInfo[];
  fileName: string;
  fileSize: number;
  erasureXorTimeMs: number;
  activeNodeIps: string[];
}
