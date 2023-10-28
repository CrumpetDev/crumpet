import { ProjectsApi, useApiConfig } from 'api';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useProjectsStore } from '../stores/useProjectsStore';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';


interface FormValues {
  projectName?: string;
}

const useSettings = ({ projectName: initialProjectName}: FormValues) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { fetchAndSelectProject } = useProjectsStore();
  const { config } = useApiConfig();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      projectName: initialProjectName || '',
    },
    onSubmit: ({ projectName }: FormValues) => {
      // if (email && password) {
      //   login({ email, password }).then(res => {
      //     if (res?.success) navigate('/');
      //     else setErrorAlert(res?.errors[0]);
      //   });
      // }
    },
  });

  useEffect(() => {
    // this is to prevent infinite re-render cycle
    if (formik.values.projectName !== initialProjectName) {
      formik.setFieldValue('projectName', initialProjectName);
    }
  }, [initialProjectName, formik]);

  const deleteProject = async (id: string, onDelete?: () => void) => {
    setLoading(true);
    try {
      const response = await new ProjectsApi(config).destroyProject(id);
      fetchAndSelectProject(config);
      onDelete?.();
      navigate('/flows');
    } catch (error) {
      toast.error("An error occurred when trying to delete this project");
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
