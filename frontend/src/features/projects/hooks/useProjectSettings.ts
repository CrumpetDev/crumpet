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
    onSubmit: async ({ projectName }: FormValues, { setSubmitting, setErrors }) => {
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
        if (e instanceof AxiosError) {
          if (e.response) {
            const errorData = e.response.data;

            // Handle model field errors
            const formikErrors: FormikErrors<FormValues> = {};
            for (const field in errorData) {
              if (field in formik.initialValues) {
                formikErrors[field as keyof FormValues] = errorData[field].join(', ');
              } else {
                // If it's a general error or an error for a field not in your form
                console.error(`Error: ${errorData[field].join(', ')}`);
                toast.error('Something went wrong when updating the project.');
              }
            }
            setErrors(formikErrors);

            // For general errors
            if (errorData.detail) {
              console.error(`General error: ${errorData.detail}`);
              toast.error('Something went wrong when updating the project.');
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
    } finally {
      setLoading(false);
    }
  };

  return {
    formik,
    loading,
    deleteProject,
  };
};

export default useSettings;
