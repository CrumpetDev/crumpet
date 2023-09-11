import { Configuration, Project, ProjectsApi } from 'api';
import { ApiState } from 'api/utils';
import { create } from 'zustand';

type ProjectsStore = {
  selectedProject: ApiState<Project>;
  projects: ApiState<Project[]>;
  fetchProjects: (config: Configuration) => void;
  setSelectedProject: (projectId: number) => void;
};

//TODO: Need to handle currently active project vs. selected project (in the settings page)
export const useProjectsStore = create<ProjectsStore>((set, get) => ({
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
}));
