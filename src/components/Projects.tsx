import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_PROJECTS, GET_PROJECT_CATEGORIES } from '../graphql/queries';
import { CREATE_PROJECT } from '../graphql/mutations';
import { Loader2, FolderKanban, LayoutGrid, List, Plus, X, Github, ExternalLink } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';

export const Projects = () => {
  const [viewType, setViewType] = useState<'grid' | 'list'>(() => {
    return (localStorage.getItem('projects_view_type') as 'grid' | 'list') || 'grid';
  });
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Create Form State
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [techStacks, setTechStacks] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [liveLink, setLiveLink] = useState('');
  const [errorText, setErrorText] = useState('');

  const { data, loading, error } = useQuery(GET_PROJECTS, {
    variables: { limit: 50 },
  });

  const { data: catData } = useQuery(GET_PROJECT_CATEGORIES, { variables: { limit: 100 } });

  const [createProject, { loading: creating }] = useMutation(CREATE_PROJECT, {
    refetchQueries: [{ query: GET_PROJECTS, variables: { limit: 50 } }],
    onCompleted: () => {
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error: any) => setErrorText(error.message),
  });

  const resetForm = () => {
    setName('');
    setCategoryId('');
    setDescription('');
    setTechStacks([]);
    setTechInput('');
    setGithubLink('');
    setLiveLink('');
    setErrorText('');
  };

  const handleAddTech = () => {
    if (techInput.trim() && !techStacks.includes(techInput.trim())) {
      setTechStacks([...techStacks, techInput.trim()]);
      setTechInput('');
    }
  };

  const removeTech = (tech: string) => {
    setTechStacks(techStacks.filter(t => t !== tech));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      setErrorText('Please select a category');
      return;
    }
    createProject({
      variables: {
        input: {
          name,
          project_category_id: parseInt(categoryId),
          description,
          tech_stacks: techStacks,
          github_link: githubLink,
          live_link: liveLink,
          test_link: "" // Legacy field
        }
      }
    });
  };

  const toggleView = (type: 'grid' | 'list') => {
    setViewType(type);
    localStorage.setItem('projects_view_type', type);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-blue-500" /></div>;
  if (error) {
    const isUnauthorized = error.message.includes('401') || error.message.toLowerCase().includes('unauthorized');
    return (
      <ErrorState
        title={isUnauthorized ? 'Access Denied' : 'Error Loading Projects'}
        message={error.message}
        variant={isUnauthorized ? 'unauthorized' : 'error'}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-6 relative min-h-screen">
      <div className="flex justify-between items-center bg-neutral-900/40 p-4 rounded-2xl border border-neutral-800">
        <h2 className="text-3xl font-bold">Projects</h2>
        
        <div className="flex items-center space-x-4">
          <div className="flex bg-neutral-950 p-1 rounded-xl border border-neutral-800">
            <button 
              onClick={() => toggleView('grid')}
              className={`p-2 rounded-lg transition-all ${viewType === 'grid' ? 'bg-neutral-800 text-blue-400 shadow-lg' : 'text-neutral-500 hover:text-white'}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={() => toggleView('list')}
              className={`p-2 rounded-lg transition-all ${viewType === 'list' ? 'bg-neutral-800 text-blue-400 shadow-lg' : 'text-neutral-500 hover:text-white'}`}
            >
              <List size={20} />
            </button>
          </div>

          <button 
            onClick={() => setIsCreateOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-bold flex items-center space-x-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Plus size={18} />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Slide-over Form */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsCreateOpen(false)} />
          <div className="relative w-full max-w-md bg-neutral-900 border-l border-neutral-800 h-full overflow-y-auto animate-in slide-in-from-right duration-300 shadow-2xl">
            <div className="p-8 space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">Create Project</h3>
                <button onClick={() => setIsCreateOpen(false)} className="text-neutral-500 hover:text-white p-2">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {errorText && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    {errorText}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-500 uppercase">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
                  >
                    <option value="">Select Category</option>
                    {(catData as any)?.getProjectCategories?.data?.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-500 uppercase">Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="Project Name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-500 uppercase">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                    placeholder="Describe it..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-500 uppercase">Tech Stack</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                     {techStacks.map(tech => (
                       <span key={tech} className="flex items-center space-x-1 px-3 py-1 bg-neutral-800 text-neutral-300 text-[10px] rounded-full border border-neutral-700">
                         <span>{tech}</span>
                         <button type="button" onClick={() => removeTech(tech)} className="hover:text-red-400"><X size={10} /></button>
                       </span>
                     ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                      className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                      placeholder="Add tech..."
                    />
                    <button type="button" onClick={handleAddTech} className="p-2 bg-neutral-800 rounded-lg hover:border-neutral-700 transition-all">
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-neutral-500 uppercase">GitHub Link</label>
                    <input
                      type="url"
                      value={githubLink}
                      onChange={(e) => setGithubLink(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-neutral-500 uppercase">Live Link</label>
                    <input
                      type="url"
                      value={liveLink}
                      onChange={(e) => setLiveLink(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={creating}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {creating ? <Loader2 className="animate-spin" /> : <span>Create Project</span>}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {!(data as any)?.getProjects?.data?.length ? (
        <EmptyState 
          title="No Projects Yet"
          message="Your portfolio is waiting for its first masterpiece. Time to showcase your best work!"
          icon={FolderKanban}
          action={
            <button 
              onClick={() => setIsCreateOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20"
            >
              Initialize First Project
            </button>
          }
        />
      ) : (
        <div className={viewType === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500" 
          : "space-y-4 animate-in fade-in duration-500"
        }>
          {(data as any)?.getProjects?.data?.map((project: any) => (
            <div 
              key={project.id} 
              className={`group relative bg-neutral-900/40 backdrop-blur-xl border border-neutral-800/80 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all duration-500 shadow-xl ${viewType === 'list' ? 'flex items-center justify-between p-6' : 'p-8 flex flex-col h-full'}`}
            >
              <div className={viewType === 'list' ? "flex items-center gap-6" : "space-y-6 flex-1"}>
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-emerald-500/30 transition-all duration-500">
                  <FolderKanban size={28} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                    {project.name}
                  </h3>
                  <p className="text-neutral-400 text-sm line-clamp-2 mt-1 antialiased">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {(Array.isArray(project.tech_stacks) ? project.tech_stacks : project.tech_stacks?.split(',') || []).slice(0, 4).map((tech: string) => (
                      <span key={tech} className="px-2 py-0.5 bg-neutral-800 text-neutral-400 text-[9px] font-black uppercase tracking-wider rounded border border-neutral-700">
                        {tech.trim()}
                      </span>
                    ))}
                    {(Array.isArray(project.tech_stacks) ? project.tech_stacks.length : project.tech_stacks?.split(',').length || 0) > 4 && (
                      <span className="text-[9px] text-neutral-600 font-bold">
                        +{(Array.isArray(project.tech_stacks) ? project.tech_stacks.length : project.tech_stacks?.split(',').length || 0) - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className={`${viewType === 'list' ? 'flex items-center gap-4 ml-6' : 'mt-8 flex items-center gap-3 border-t border-neutral-800/50 pt-6'}`}>
                {project.github_link && (
                  <a 
                    href={project.github_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded-xl transition-all"
                    title="GitHub Repository"
                  >
                    <Github size={18} />
                  </a>
                )}
                {project.live_link && (
                  <a 
                    href={project.live_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-blue-400 rounded-xl transition-all"
                    title="Live Demo"
                  >
                    <ExternalLink size={18} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

