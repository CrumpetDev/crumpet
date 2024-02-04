import { Configuration, Project, ProjectsApi } from 'api';
import { ApiState } from 'api/utils';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface State {
  selectedProject: ApiState<Project>;
  projects: ApiState<Project[]>;
}
interface Actions {
  fetchProjects: (config: Configuration) => void;
  setSelectedProject: (projectId: number) => void;
  fetchAndSelectProject: (config: Configuration, projectId?: number) => void;
  createProject: (name: string, config: Configuration) => void;
}

export const useProjectsStore = create<State & Actions>()(
  subscribeWithSelector((set, get) => ({
    selectedProject: ApiState.initial(),
    projects: ApiState.initial(),
    fetchProjects: (config: Configuration) => {
      set(state => ({ projects: ApiState.loading() }));
      new ProjectsApi(config)
        .listProjects()
        .then(res => set(state => ({ projects: ApiState.hasData(res.data) })))
        .catch(err => set(state => ({ projects: ApiState.hasError(err) })));
    },
    setSelectedProject: (projectId: number) => {
      const currentProjects = get().projects;
      if (currentProjects.state == 'hasData' || currentProjects.state == 'hasDataWithError') {
        const proj = currentProjects.data.find(project => project.id == projectId);
        if (proj) {
          set(state => ({ selectedProject: ApiState.hasData(proj) }));
        }
      }
    },
    fetchAndSelectProject: (config: Configuration, projectId?: number) => {
      set(state => ({ projects: ApiState.loading() }));
      new ProjectsApi(config)
        .listProjects()
        .then(res => {
          const index =
            projectId == undefined ? 0 : res.data.findIndex(project => project.id == projectId);
          return set(state => ({
            projects: ApiState.hasData(res.data),
            selectedProject: ApiState.hasData(res.data[index]),
          }));
        })
        .catch(err => set(state => ({ projects: ApiState.hasError(err) })));
    },
    createProject: async (name: string, config: Configuration) => {
      const res = await new ProjectsApi(config).createProject({ name: name });
      set(state => ({ selectedProject: ApiState.hasData(res.data) }));
      get().fetchProjects(config);
    },
  })),
);
