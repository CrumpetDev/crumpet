import { useApiConfig } from 'api';
import { AxiosError } from 'axios';
import { FormikErrors, useFormik } from 'formik';
import { useProjectsStore } from '../stores/useProjectsStore';

interface FormValues {
  name: string;
}

interface useCreateProjectProps {
	onSubmit: () => void;
}

const useCreateProject = ({onSubmit} : useCreateProjectProps) => {
  const { config } = useApiConfig();
  const { createProject } = useProjectsStore();
  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validate: values => {
      const errors: FormikErrors<FormValues> = {};
      if (!values.name) {
        errors.name = 'You must provide a name.';
      }
      return errors;
    },
    onSubmit: async ({ name }: FormValues) => {
      try {
				// Run onSubmit if successful
        await createProject(name, config);
				onSubmit();
      } catch (e) {
				//TODO: Propagate errors to form using setError etc.
        if (e instanceof AxiosError) {
          if (e.response) {
            const errorData = e.response.data;
            if (errorData.detail) {
              console.error('General error:', errorData.detail);
            } else {
              // Handle model field errors.
              for (const field in errorData) {
                console.error(`Error with ${field}:`, errorData[field].join(', '));
              }
            }
          }
        } else {
          // Some other error
          console.error(e);
        }
      }
    },
  });

  return { formik };
};

export default useCreateProject;
