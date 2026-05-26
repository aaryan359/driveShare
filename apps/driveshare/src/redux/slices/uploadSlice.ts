import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { WasmUploadState, UploadPhase, FileShardInfo } from '@repo/shared';

const initialState: WasmUploadState = {
  phase: 'IDLE',
  progress: 0,
  activeNodesCount: 0,
  shardsCount: 8,
  shards: [],
  fileName: '',
  fileSize: 0,
  erasureXorTimeMs: 0,
  activeNodeIps: [],
};

const INDIAN_UPI_IDS = [
  'delhi.node1@okaxis',
  'mumbai.volun3@okicici',
  'bangalore.speed@oksbi',
  'chennai.cctv@okhdfc',
  'kolkata.p2p@okaxis',
  'hyderabad.store@okicici',
  'pune.volunteer@oksbi',
  'ahmedabad.cloud@okhdfc'
];

const NODE_IPS = [
  '103.45.201.12',
  '122.160.40.89',
  '49.207.112.5',
  '117.200.56.241',
  '157.48.90.133',
  '103.88.22.46',
  '223.230.15.77',
  '182.75.122.9'
];

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    startUpload(state, action: PayloadAction<{ fileName: string; fileSize: number }>) {
      state.phase = 'TOKEN_HANDSHAKE';
      state.progress = 0;
      state.fileName = action.payload.fileName;
      state.fileSize = action.payload.fileSize;
      state.activeNodesCount = 8;
      state.erasureXorTimeMs = 0;
      state.activeNodeIps = NODE_IPS;
      state.shards = Array.from({ length: 8 }).map((_, index) => ({
        nodeId: `node_${index + 1}`,
        nodeIp: NODE_IPS[index],
        nodeUpi: INDIAN_UPI_IDS[index],
        shardIndex: index,
        progress: 0,
        status: 'CONNECTING',
      }));
    },
    setPhase(state, action: PayloadAction<UploadPhase>) {
      state.phase = action.payload;
      if (action.payload === 'WASM_SHATTERING') {
        state.erasureXorTimeMs = Math.round(50 + Math.random() * 80); // XOR formula computations time
      }
    },
    setProgress(state, action: PayloadAction<number>) {
      state.progress = action.payload;
    },
    updateShard(state, action: PayloadAction<{ index: number; progress: number; status: FileShardInfo['status'] }>) {
      const shard = state.shards[action.payload.index];
      if (shard) {
        shard.progress = action.payload.progress;
        shard.status = action.payload.status;
      }
    },
    resetUpload() {
      return initialState;
    }
  },
});

export const { startUpload, setPhase, setProgress, updateShard, resetUpload } = uploadSlice.actions;
export default uploadSlice.reducer;
