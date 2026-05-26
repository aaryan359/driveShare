import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CustomerProject } from '@repo/shared';

interface ProjectState {
  items: CustomerProject[];
  activeProjectId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  items: [],
  activeProjectId: null,
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    fetchProjectsSuccess(state, action: PayloadAction<CustomerProject[]>) {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
      if (action.payload.length > 0 && !state.activeProjectId) {
        state.activeProjectId = action.payload[0].id;
      }
    },
    addProject(state, action: PayloadAction<CustomerProject>) {
      state.items.unshift(action.payload);
      state.activeProjectId = action.payload.id;
      state.loading = false;
    },
    removeProject(state, action: PayloadAction<string>) {
      state.items = state.items.filter(p => p.id !== action.payload);
      state.loading = false;
      if (state.activeProjectId === action.payload) {
        state.activeProjectId = state.items.length > 0 ? state.items[0].id : null;
      }
    },
    setActiveProjectId(state, action: PayloadAction<string>) {
      state.activeProjectId = action.payload;
    },
    projectFailed(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    }
  },
});

export const { 
  setLoading, 
  fetchProjectsSuccess, 
  addProject, 
  removeProject, 
  setActiveProjectId, 
  projectFailed 
} = projectSlice.actions;

export default projectSlice.reducer;
