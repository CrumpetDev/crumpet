import { ProjectMembersInner, ProjectMembersInnerTypeEnum } from 'api';
import { CopyInput, TextInput } from 'components/inputs';
import { MainButton, OutlineButton, TextButton } from 'components/buttons';
import { MembersTable } from 'components/tables';
import { useProjectsStore } from 'features/projects/stores/useProjectsStore';
import { MdAdd, MdSave } from 'react-icons/md';
import useSettings from '../hooks/useProjectSettings';
import toast from 'react-hot-toast';
import { useShallow } from 'zustand/react/shallow';

type UserData = {
  email: string;
  name: string;
  role: string;
};

const Settings = () => {
  const selectedProject = useProjectsStore(useShallow(state => state.selectedProject));
  //const { selectedProject } = useProjectsStore();
  //TODO: Can we improve this to just pass in selectedProject as is without a check?
  const { formik, deleteProject } = useSettings(
    selectedProject.state == 'hasData'
      ? { projectName: selectedProject?.data.name }
      : { projectName: '' },
  );

  // TODO: If there is no selected project, display an error on the page.
  // There needs to be a selected project before page is loaded.

  // Convert selectedProject.data.members to UserData format
  const convertMembersToUserData = (
    members: Array<ProjectMembersInner> | undefined,
  ): UserData[] => {
    return (
      members?.map(member => ({
        email: member.user.email,
        name: `${member.user.first_name || ''} ${member.user.last_name || ''}`.trim(),
        role: member.type === ProjectMembersInnerTypeEnum.Adm ? 'Admin' : 'Member',
      })) || []
    );
  };

  return (
    <div className="w-full h-full container px-6 py-8">
      {(() => {
        switch (selectedProject.state) {
          case 'loading':
            //TODO: Better loading experience
            return <div>Loading...</div>; // Just an example
          case 'hasData': {
            console.log('members', selectedProject.data.members);
            const membersData = convertMembersToUserData(selectedProject.data.members);

            return (
              <div className="flex flex-col gap-5">
                <TextInput
                  label="Project Name"
                  description="The display name of your project."
                  value={formik.values.projectName ?? ''}
                  error={
                    formik.touched.projectName && formik.errors.projectName
                      ? formik.errors.projectName
                      : null
                  }
                  onChange={formik.handleChange}
                  placeholder="Name"
                  inputProps={{ id: 'projectName', onBlur: formik.handleBlur }}
                />
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col justify-start items-start gap-1">
                    <h4 className="text-oxford text-sm font-semibold">Members</h4>
                    <p className="text-grey-700 text-sm">Manage the members of your project.</p>
                  </div>
                  <MembersTable data={membersData} />
                </div>
                <CopyInput
                  label="Project API Key"
                  description="Use this key to authorize API requests."
                  value={selectedProject.data.api_key?.toString() ?? ''}
                />
                <CopyInput
                  label="Project ID"
                  description="You can use this to reference your project in our API."
                  value={selectedProject.data.id?.toString() ?? ''}
                />
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col justify-start items-start gap-1">
                    <h4 className="text-oxford text-sm font-semibold">Danger Zone</h4>
                    <p className="text-grey-700 text-sm">
                      Delete your project and all associated data.
                    </p>
                  </div>
                  <OutlineButton
                    label="Delete project"
                    className="self-start"
                    onClick={async () =>
                      await deleteProject(selectedProject.data.id?.toString() ?? '', () =>
                        toast.success('Project deleted successfully'),
                      )
                    }
                  />
                </div>
              </div>
            );
          }
          case 'hasError':
            //TODO: Toast error message and navigate away (probs to / route)
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
export default Settings;
