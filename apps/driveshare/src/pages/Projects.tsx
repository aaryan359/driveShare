import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/store.js';
import { fetchProjectsSuccess, addProject, removeProject, setActiveProjectId } from '../redux/slices/projectSlice.js';
import { fetchProjectsSimulated, createProjectSimulated, deleteProjectSimulated } from '../apis/projects.js';
import { 
  FolderPlus, 
  Trash2, 
  Terminal, 
  Layers, 
  Check, 
  Copy, 
  AlertTriangle,
  Loader
} from 'lucide-react';
import { formatBytes, formatDate, generateTerraformConfig, generateRcloneConfig, generateAwsCliConfig } from '../utils/formatters.js';

export default function Projects() {
  const dispatch = useAppDispatch();
  const { items: projects, activeProjectId, loading } = useAppSelector(state => state.projects);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bucketNameInput, setBucketNameInput] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  // Credentials Reveal State (Show raw secret only ONCE upon creation)
  const [revealedCredentials, setRevealedCredentials] = useState<{
    bucketName: string;
    accessKey: string;
    secretKey: string;
  } | null>(null);

  // Active Doc/Snippet Switcher Tab
  const [activeDocsTab, setActiveDocsTab] = useState<'terraform' | 'rclone' | 'awscli'>('terraform');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Load projects from simulated api on mount
  useEffect(() => {
    async function loadData() {
      dispatch(fetchProjectsSuccess(await fetchProjectsSimulated()));
    }
    if (projects.length === 0) {
      loadData();
    }
  }, [dispatch]);

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0] || null;

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleCreateBucket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bucketNameInput.trim()) return;

    setIsCreating(true);
    try {
      const response = await createProjectSimulated(bucketNameInput.trim());
      dispatch(addProject(response.project));
      
      // Store credentials to show the ONE-TIME reveal dialog
      setRevealedCredentials({
        bucketName: response.project.name,
        accessKey: response.project.accessKeyId,
        secretKey: response.rawSecret
      });
      
      setBucketNameInput('');
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleRevokeProject = async (id: string) => {
    if (window.confirm('WARNING: Are you sure you want to delete/revoke this storage bucket? All sharded file mappings will be permanently unlinked!')) {
      dispatch(removeProject(id));
      await deleteProjectSimulated(id);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '12px' }}>
      
      {/* Header section */}
      <div className="flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="liquid-glow-text" style={{ fontSize: '32px', fontWeight: 800, marginBottom: '6px' }}>Sovereign Workspace Buckets</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Provision buckets, generate S3 credentials, and deploy S3 code integrations
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="liquid-glass-btn liquid-glass-btn-primary"
        >
          <FolderPlus size={18} />
          Create New Bucket
        </button>
      </div>

      {/* ONE-TIME Credentials Reveal Banner */}
      {revealedCredentials && (
        <div className="liquid-glass-card p-6" 
             style={{ 
               padding: '24px', 
               border: '1px solid rgba(0, 255, 204, 0.4)', 
               background: 'rgba(0, 255, 204, 0.04)',
               borderRadius: '20px'
             }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#00ffcc', marginBottom: '16px' }}>
            <AlertTriangle size={24} className="pulse-glow" style={{ color: '#00ffcc' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>
              Sovereign S3 Access Credentials Generated (One-Time Warning!)
            </h3>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px', lineHeight: '1.6' }}>
            Copy your keys now. For cryptographic and zero-knowledge security, the raw Secret Access Key is hashed instantly. **It will NEVER be shown to you again.**
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
            
            {/* Bucket Name */}
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '10px', justifyContent: 'space-between' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', marginRight: '8px' }}>BUCKET_NAME:</span>
                <span style={{ color: 'var(--text-primary)' }}>{revealedCredentials.bucketName}</span>
              </div>
              <button 
                onClick={() => handleCopyCode(revealedCredentials.bucketName, 'rev_bucket')}
                style={{ background: 'none', border: 'none', color: '#00ffcc', cursor: 'pointer' }}
              >
                {copiedText === 'rev_bucket' ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>

            {/* Access Key */}
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '10px', justifyContent: 'space-between' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', marginRight: '8px' }}>ACCESS_KEY_ID:</span>
                <span style={{ color: 'var(--text-primary)' }}>{revealedCredentials.accessKey}</span>
              </div>
              <button 
                onClick={() => handleCopyCode(revealedCredentials.accessKey, 'rev_access')}
                style={{ background: 'none', border: 'none', color: '#00ffcc', cursor: 'pointer' }}
              >
                {copiedText === 'rev_access' ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>

            {/* Secret Key */}
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '10px', justifyContent: 'space-between' }}>
              <div>
                <span style={{ color: 'rgba(239, 68, 68, 0.8)', marginRight: '8px', fontWeight: 700 }}>SECRET_ACCESS_KEY:</span>
                <span style={{ color: '#00ffcc', fontWeight: 700 }}>{revealedCredentials.secretKey}</span>
              </div>
              <button 
                onClick={() => handleCopyCode(revealedCredentials.secretKey, 'rev_secret')}
                style={{ background: 'none', border: 'none', color: '#00ffcc', cursor: 'pointer' }}
              >
                {copiedText === 'rev_secret' ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>

          </div>

          <button 
            onClick={() => setRevealedCredentials(null)}
            className="liquid-glass-btn liquid-glass-btn-primary"
            style={{ marginTop: '20px', padding: '10px 20px', fontSize: '13px' }}
          >
            I Have Saved My Keys Securely
          </button>
        </div>
      )}

      {/* Workspace split columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        
        {/* Bucket List Column */}
        <div className="liquid-glass-card p-6" style={{ padding: '24px' }}>
          <h3 className="liquid-glow-text" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Layers size={20} className="text-cyan" style={{ color: '#00ffcc' }} />
            Active Organization Buckets
          </h3>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
              <Loader size={28} className="animate-spin text-cyan" style={{ color: '#00ffcc' }} />
            </div>
          ) : projects.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No buckets provisioned. Create your first bucket to begin.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {projects.map((project) => {
                const isActive = project.id === activeProjectId;
                return (
                  <div key={project.id}
                       onClick={() => dispatch(setActiveProjectId(project.id))}
                       style={{ 
                         background: isActive ? 'rgba(0, 255, 204, 0.04)' : 'rgba(0,0,0,0.2)', 
                         border: `1px solid ${isActive ? 'rgba(0, 255, 204, 0.3)' : 'rgba(255,255,255,0.06)'}`,
                         borderRadius: '16px', 
                         padding: '16px',
                         cursor: 'pointer',
                         transition: 'all 0.3s ease',
                         display: 'flex',
                         justifyContent: 'space-between',
                         alignItems: 'center'
                       }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <h4 style={{ fontSize: '15px', fontWeight: 700, color: isActive ? '#00ffcc' : 'var(--text-primary)' }}>
                        {project.name}
                      </h4>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        Capacity: {formatBytes(project.currentStorageBytes)} | Created: {formatDate(project.createdAt).split(',')[0]}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                        ID: {project.accessKeyId}
                      </div>
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRevokeProject(project.id);
                      }}
                      className="liquid-glass-btn liquid-glass-btn-danger"
                      style={{ padding: '8px', borderRadius: '8px' }}
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Connection Code Helper Docs Column */}
        <div className="liquid-glass-card p-6" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 className="liquid-glow-text" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Terminal size={20} style={{ color: '#a78bfa' }} />
            Integration & S3 Connection Helper
          </h3>

          {activeProject ? (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              
              {/* Tab Switchers */}
              <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', marginBottom: '16px' }}>
                <button
                  onClick={() => setActiveDocsTab('terraform')}
                  className="liquid-glow-cyan"
                  style={{ 
                    background: 'none', border: 'none', 
                    color: activeDocsTab === 'terraform' ? '#00ffcc' : 'var(--text-muted)',
                    fontWeight: activeDocsTab === 'terraform' ? '700' : '500',
                    fontSize: '13px', fontFamily: 'var(--font-heading)', cursor: 'pointer',
                    paddingBottom: '4px',
                    borderBottom: activeDocsTab === 'terraform' ? '2px solid #00ffcc' : 'none'
                  }}
                >
                  Terraform HCL
                </button>
                <button
                  onClick={() => setActiveDocsTab('rclone')}
                  className="liquid-glow-cyan"
                  style={{ 
                    background: 'none', border: 'none', 
                    color: activeDocsTab === 'rclone' ? '#00ffcc' : 'var(--text-muted)',
                    fontWeight: activeDocsTab === 'rclone' ? '700' : '500',
                    fontSize: '13px', fontFamily: 'var(--font-heading)', cursor: 'pointer',
                    paddingBottom: '4px',
                    borderBottom: activeDocsTab === 'rclone' ? '2px solid #00ffcc' : 'none'
                  }}
                >
                  Rclone CCTV Config
                </button>
                <button
                  onClick={() => setActiveDocsTab('awscli')}
                  className="liquid-glow-cyan"
                  style={{ 
                    background: 'none', border: 'none', 
                    color: activeDocsTab === 'awscli' ? '#00ffcc' : 'var(--text-muted)',
                    fontWeight: activeDocsTab === 'awscli' ? '700' : '500',
                    fontSize: '13px', fontFamily: 'var(--font-heading)', cursor: 'pointer',
                    paddingBottom: '4px',
                    borderBottom: activeDocsTab === 'awscli' ? '2px solid #00ffcc' : 'none'
                  }}
                >
                  AWS CLI
                </button>
              </div>

              {/* Dynamic Snippet content based on selected active project bucket */}
              {(() => {
                const bName = activeProject.name;
                const aKey = activeProject.accessKeyId;
                const sHash = 'ds_secret_••••••••••••••••••••••••••••••••'; // Raw secrets are masked post creation
                let codeSnippet = '';
                
                if (activeDocsTab === 'terraform') {
                  codeSnippet = generateTerraformConfig(bName, aKey, sHash);
                } else if (activeDocsTab === 'rclone') {
                  codeSnippet = generateRcloneConfig(bName, aKey, sHash);
                } else {
                  codeSnippet = generateAwsCliConfig(bName, aKey, sHash);
                }

                return (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        TARGET BUCKET: {bName}
                      </span>
                      <button 
                        onClick={() => handleCopyCode(codeSnippet, 'code_snippet')}
                        className="liquid-glass-btn liquid-glass-btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '11px' }}
                      >
                        {copiedText === 'code_snippet' ? (
                          <>
                            <Check size={12} /> Copied
                          </>
                        ) : (
                          <>
                            <Copy size={12} /> Copy Code
                          </>
                        )}
                      </button>
                    </div>

                    <pre style={{ 
                      flex: 1, 
                      background: 'rgba(0,0,0,0.5)', 
                      border: '1px solid rgba(255,255,255,0.06)', 
                      borderRadius: '12px', 
                      padding: '16px', 
                      fontFamily: 'var(--font-mono)', 
                      fontSize: '12px', 
                      color: '#c7d2fe', 
                      overflow: 'auto',
                      maxHeight: '380px'
                    }}>
                      <code>{codeSnippet}</code>
                    </pre>
                  </div>
                );
              })()}

            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>
              Select or provision a bucket to view code integration snippets.
            </div>
          )}

        </div>

      </div>

      {/* CREATE BUCKET MODAL */}
      {isModalOpen && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 
        }}>
          
          <div className="liquid-glass-card p-6 animate-fade-in" style={{ width: '90%', maxWidth: '480px', padding: '28px' }}>
            <h3 className="liquid-glow-text" style={{ fontSize: '22px', fontWeight: 800, marginBottom: '16px' }}>
              Provision Sovereign Bucket
            </h3>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', lineHeight: '1.6' }}>
              Provide a globally unique bucket identifier. All contents are automatically distributed and encrypted across Indian node architectures.
            </p>

            <form onSubmit={handleCreateBucket} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label className="liquid-glass-label">Bucket Identifier Name</label>
                <input
                  type="text"
                  placeholder="e.g. cctv-nightowl-delhi-office"
                  className="liquid-glass-input w-full"
                  value={bucketNameInput}
                  onChange={(e) => setBucketNameInput(e.target.value)}
                  style={{ width: '100%' }}
                  required
                />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                  Only alphanumeric characters, dashes, and underscores.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="liquid-glass-btn liquid-glass-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="liquid-glass-btn liquid-glass-btn-primary"
                >
                  {isCreating ? 'Provisioning Ledger...' : 'Generate Sovereign Keys'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
