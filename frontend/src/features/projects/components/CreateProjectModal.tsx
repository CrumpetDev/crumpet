import { Dialog, Transition } from '@headlessui/react';
import EmphasisButton from 'components/buttons/EmphasisButton';
import { TextInput } from 'components/inputs';
import Toast from 'components/toasts/Toast';
import { Fragment } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useCreateProject from '../hooks/useCreateProject';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProjectModal = ({ isOpen, onClose }: CreateProjectModalProps) => {
  const navigate = useNavigate();
  const close = () => {
    formik.resetForm({ values: formik.initialValues, errors: {} });
    onClose();
  };

  const onSubmit = () => {
    close();
    toast.success("Project created successfully");
  };

  const { formik } = useCreateProject({ onSubmit: onSubmit });

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={close}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <Dialog.Panel
                className="w-full max-w-md transform overflow-hidden rounded-lg 
													bg-white p-6 text-center align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-oxford">
                  Create a new project
                </Dialog.Title>
                <Dialog.Description className="mt-2 text-grey-900 text-sm">
                  Please provide the following details to continue.
                </Dialog.Description>
                <div className="mt-6">
                  <TextInput
                    label="Name"
                    description="This is the display name of the project."
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && formik.errors.name ? formik.errors.name : null}
                    inputProps={{
                      type: 'text',
                      id: 'name',
                      name: 'name',
                      onBlur: formik.handleBlur,
                    }}
                  />
                </div>

                <div className="mt-6 flex gap-4 justify-center">
                  <EmphasisButton text="Cancel" variant="secondary" onClick={close} />
                  <EmphasisButton
                    text="Create"
                    variant="primary"
                    enabled={formik.isValid && formik.dirty}
                    type="submit"
                    onClick={formik.handleSubmit}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
