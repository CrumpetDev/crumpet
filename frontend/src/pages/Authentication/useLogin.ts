import { useFormik } from 'formik';

const useLogin = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: () => {
      // console.log(values); -- Functionality to be added after backend is complete
    },
  });

  return {
    formik,
  };
};

export default useLogin;
