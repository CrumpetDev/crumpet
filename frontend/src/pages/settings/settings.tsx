import { ProjectMembersInner, ProjectMembersInnerTypeEnum } from 'api';
import CustomButton from 'components/button';
import CopyInput from 'components/copyInput';
import Table from 'components/table';
import TextInput from 'components/textInput';
import { useProjectsStore } from 'features/projects/stores/useProjectsStore';
import { MdAdd } from 'react-icons/md';
import useSettings from './useSettings';

const headers = [
  { propertyName: 'email', displayName: 'Email' },
  { propertyName: 'name', displayName: 'Name' },
  { propertyName: 'role', displayName: 'Role' },
];

type UserData = {
  email: string;
  name: string;
  role: string;
};

const Settings = () => {
  const { selectedProject } = useProjectsStore();
  //TODO: Can we improve this to just pass in selectedProject as is without a check?
  const { formik } = useSettings(
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

  const handleMoreClick = () => {
    console.log('More icon clicked');
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
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-semibold">Project Settings</p>
                  <p className="text-base">Customise your project settings here.</p>
                </div>
                <TextInput
                  label="Project Name"
                  value={formik.values.projectName}
                  onChange={formik.handleChange}
                  placeholder="Name"
                  inputProps={{ id: 'projectName' }}
                />
                <div className="flex flex-col w-full gap-2">
                  <p className="font-bold">Members</p>
                  <Table headers={headers} data={membersData} onMoreClick={handleMoreClick} />
                  <CustomButton
                    styles="self-start"
                    text="Invite member"
                    icon={<MdAdd />}
                    onClick={() => console.log('button clicked')}
                  />
                </div>
                <div className="flex flex-col w-full gap-2">
                  <p className="font-bold"> Project API Key</p>
                  <CopyInput
                    className="self-start"
                    value={selectedProject.data.api_key?.toString() ?? ''}
                  />
                </div>
                <div className="flex flex-col w-full gap-2">
                  <p className="font-bold"> Project ID</p>
                  <p className="text-base">
                    You can use this to reference your project in the API.
                  </p>
                  <CopyInput
                    className="self-start"
                    value={selectedProject.data.id?.toString() ?? ''}
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
