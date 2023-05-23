import { useFormik } from 'formik';

const useLogin = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async values => {
      console.log(values);
    },
  });

  return {
    formik,
  };
};

export default useLogin;
