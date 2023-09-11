import { useApiConfig } from 'api';
import SidebarMenu from 'components/sidebarMenu';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useProjectsStore } from 'stores/useProjectsStore';

const Root = () => {
  const { config } = useApiConfig();
  const { projects, fetchProjects, setSelectedProject } = useProjectsStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects(config);
  }, [fetchProjects, config]);

  return (
    <div className="flex h-screen v-screen">
      {(() => {
        switch (projects.state) {
          case 'loading':
            return <div>Loading...</div>; // Just an example
          case 'hasData':
            return (
              <>
                <SidebarMenu
                  projects={projects.data.map(project => {
                    return {
                      id: project.id!,
                      name: project.name,
                      selected: project.id == 1 ? true : false,
                      onSettingsClick: proj => {
                        setSelectedProject(proj.id);
                        navigate('/settings');
                      },
                    };
                  })}
                />
                <Outlet />
              </>
            );
							//TODO: Handle these cases (probs toast and navigate away?)
          case 'hasError':
            return <div>Error encountered</div>; // Render the error
          case 'hasDataWithError':
            return <div>Data loaded but with error</div>; // Handle this case as well
          default:
            return null; // Handle default case, if needed
        }
      })()}
    </div>
  );
};

export default Root;
