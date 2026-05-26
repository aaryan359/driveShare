import type { CustomerProject } from '@repo/shared';

// Simulated DB persistence in localStorage for realistic browser reloads!
const LOCAL_STORAGE_KEY = 'driveshare_projects';

const INITIAL_PROJECTS: CustomerProject[] = [
  {
    id: 'proj_1',
    userId: 'user_cctv_123',
    name: 'delhi-surveillance-west-hd',
    accessKeyId: 'ds_access_a8f9c2d1e0b5c47a',
    secretAccessKeyHash: '$2a$10$BypS4Gj98bL2026DriveShareMockHashForS3SecuritySec1',
    isActive: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    currentStorageBytes: (842 * 1024 * 1024 * 1024).toString(), // 842 GB
    totalEgressBytes: (2150 * 1024 * 1024 * 1024).toString(), // 2.1 TB
  },
  {
    id: 'proj_2',
    userId: 'user_cctv_123',
    name: 'mumbai-cctv-night-conveyor',
    accessKeyId: 'ds_access_e4d2a1b9f0c8d76b',
    secretAccessKeyHash: '$2a$10$BypS4Gj98bL2026DriveShareMockHashForS3SecuritySec2',
    isActive: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    currentStorageBytes: (1240 * 1024 * 1024 * 1024).toString(), // 1.2 TB
    totalEgressBytes: (540 * 1024 * 1024 * 1024).toString(), // 540 GB
  }
];

function getStoredProjects(): CustomerProject[] {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS));
    return INITIAL_PROJECTS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_PROJECTS;
  }
}

function saveStoredProjects(projects: CustomerProject[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
}

export async function fetchProjectsSimulated(): Promise<CustomerProject[]> {
  await new Promise(r => setTimeout(r, 600)); // Simulate realistic low network delay
  return getStoredProjects();
}

export async function createProjectSimulated(name: string): Promise<{ 
  project: CustomerProject; 
  rawSecret: string;
}> {
  await new Promise(r => setTimeout(r, 850)); // Simulate crypto hash generation latency
  
  const projects = getStoredProjects();
  const randHex = () => Math.random().toString(16).substring(2, 10);
  
  const rawAccessKey = `ds_access_${randHex()}${randHex()}`;
  const rawSecret = `ds_secret_${randHex()}${randHex()}${randHex()}${randHex()}`;
  const id = `proj_${Date.now()}`;
  
  const newProject: CustomerProject = {
    id,
    userId: 'user_current',
    name: name.toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
    accessKeyId: rawAccessKey,
    secretAccessKeyHash: `$2a$10$DriveShareHashedMockSecretForConsoleUI${randHex()}`,
    isActive: true,
    createdAt: new Date().toISOString(),
    currentStorageBytes: '0',
    totalEgressBytes: '0'
  };
  
  projects.unshift(newProject);
  saveStoredProjects(projects);
  
  return {
    project: newProject,
    rawSecret
  };
}

export async function deleteProjectSimulated(id: string): Promise<boolean> {
  await new Promise(r => setTimeout(r, 500));
  const projects = getStoredProjects();
  const filtered = projects.filter(p => p.id !== id);
  saveStoredProjects(filtered);
  return true;
}
