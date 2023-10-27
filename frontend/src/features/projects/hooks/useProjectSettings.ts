import { useFormik } from 'formik';
import { useEffect } from 'react';

interface FormValues {
  projectName?: string;
}

const useSettings = ({ projectName: initialProjectName }: FormValues) => {

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

  return {
    formik,
  };
};

export default useSettings;
