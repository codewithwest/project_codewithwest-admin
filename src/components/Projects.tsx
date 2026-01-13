import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_PROJECTS, GET_PROJECT_CATEGORIES } from '../graphql/queries';
import { CREATE_PROJECT } from '../graphql/mutations';
import { Loader2, FolderKanban, ExternalLink, Github, Sparkles, LayoutGrid, List, Plus, X, Tag, Link } from 'lucide-react';
import { EmptyState } from './EmptyState';

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
  if (error) return <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">{error.message}</div>;

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
            <button onClick={() => setIsCreateOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold transition-all">
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
            viewType === 'grid' ? (
              <ProjectCard key={project.id} project={project} />
            ) : (
              <ProjectListRow key={project.id} project={project} />
            )
          ))}
        </div>
      )}
    </div>
  );
};

const ProjectCard = ({ project }: { project: any }) => (
  <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl hover:border-neutral-700 transition-all group relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
       <Sparkles className="text-blue-500 animate-pulse" size={16} />
    </div>
    <div className="flex justify-between items-start mb-4">
      <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
        <FolderKanban size={24} />
      </div>
      <div className="flex items-center space-x-2">
        {project.github_link && (
          <a href={project.github_link} target="_blank" className="p-2 bg-neutral-950 rounded-lg text-neutral-500 hover:text-white border border-neutral-800 hover:border-neutral-700 transition-all">
            <Github size={16} />
          </a>
        )}
        {project.live_link && (
          <a href={project.live_link} target="_blank" className="p-2 bg-neutral-950 rounded-lg text-neutral-500 hover:text-blue-400 border border-neutral-800 hover:border-neutral-700 transition-all">
            <ExternalLink size={16} />
          </a>
        )}
      </div>
    </div>
    
    <div>
      <h3 className="font-bold text-xl text-white mb-2 group-hover:text-blue-400 transition-colors">{project.name}</h3>
      <p className="text-neutral-400 text-sm line-clamp-2 mb-4 h-10">{project.description}</p>
    </div>
    
    <div className="flex flex-wrap gap-2 pt-4 border-t border-neutral-800/50">
       {(Array.isArray(project.tech_stacks) ? project.tech_stacks : project.tech_stacks?.split(',') || []).map((tech: string) => (
         <span key={tech} className="px-2 py-1 bg-neutral-950 text-neutral-500 text-[10px] rounded border border-neutral-800 uppercase tracking-wider">
           {tech.trim()}
         </span>
       ))}
    </div>
  </div>
);

const ProjectListRow = ({ project }: { project: any }) => (
  <div className="bg-neutral-900/30 border border-neutral-800/50 p-4 rounded-xl hover:bg-neutral-900/50 hover:border-neutral-700 transition-all flex items-center justify-between group">
    <div className="flex items-center space-x-4">
      <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500 group-hover:bg-blue-500/20 transition-colors">
        <FolderKanban size={20} />
      </div>
      <div>
        <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">{project.name}</h3>
        <p className="text-neutral-500 text-xs hidden md:block truncate max-w-sm">{project.description}</p>
      </div>
    </div>

    <div className="flex items-center space-x-6">
      <div className="hidden lg:flex items-center space-x-2">
        {(Array.isArray(project.tech_stacks) ? project.tech_stacks.slice(0, 3) : project.tech_stacks?.split(',').slice(0, 3) || []).map((tech: string) => (
          <span key={tech} className="px-2 py-0.5 bg-neutral-950 text-neutral-500 text-[9px] rounded border border-neutral-800">
            {tech.trim()}
          </span>
        ))}
        {(Array.isArray(project.tech_stacks) ? project.tech_stacks.length : project.tech_stacks?.split(',').length || 0) > 3 && (
          <span className="text-[9px] text-neutral-600">+{(Array.isArray(project.tech_stacks) ? project.tech_stacks.length : project.tech_stacks?.split(',').length || 0) - 3} more</span>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {project.github_link && (
          <a href={project.github_link} target="_blank" className="p-2 text-neutral-500 hover:text-white transition-colors">
            <Github size={18} />
          </a>
        )}
        {project.live_link && (
          <a href={project.live_link} target="_blank" className="p-2 text-neutral-500 hover:text-blue-400 transition-colors">
            <ExternalLink size={18} />
          </a>
        )}
      </div>
    </div>
  </div>
);
