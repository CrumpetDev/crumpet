import { ProjectsApi, useApiConfig } from 'api';
import { FormikErrors, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useProjectsStore } from '../stores/useProjectsStore';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

interface FormValues {
  projectName?: string;
}

const useSettings = ({
  projectId,
  projectName: initialProjectName,
}: {
  projectId: number;
  projectName: string;
}) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { fetchAndSelectProject } = useProjectsStore();
  const { config } = useApiConfig();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      projectName: initialProjectName || '',
    },
    validate: values => {
      const formErrors: FormikErrors<FormValues> = {};
      if (!values.projectName) {
        formErrors.projectName = 'You must provide a name.';
      }
      return formErrors;
    },
    onSubmit: async ({ projectName }: FormValues, { setSubmitting }) => {
      setSubmitting(true);
      if (projectName == undefined) {
        setSubmitting(false);
        return;
      }
      try {
        await new ProjectsApi(config).updateProject(projectId.toString(), { name: projectName });
        fetchAndSelectProject(config, projectId);
        toast.success(`Updated project ${projectName} successfully`);
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
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    // this is to prevent infinite re-render cycle
    if (formik.values.projectName !== initialProjectName) {
      formik.setFieldValue('projectName', initialProjectName);
    }
  }, [initialProjectName]);

  const deleteProject = async (id: string, onDelete?: () => void) => {
    setLoading(true);
    try {
      const response = await new ProjectsApi(config).destroyProject(id);
      fetchAndSelectProject(config);
      onDelete?.();
      navigate('/flows');
    } catch (error) {
      toast.error('An error occurred when trying to delete this project');
      setErrors(['An error occurred']);
    } finally {
      setLoading(false);
    }
  };

  return {
    formik,
    loading,
    errors,
    deleteProject,
  };
};

export default useSettings;
