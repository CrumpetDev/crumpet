import useAuthentication from 'api/auth/useAuthentication';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router';

interface FormValues {
  email?: string;
  password?: string;
}

const useLogin = () => {
	const { login, authenticating, errorAlert, setErrorAlert } = useAuthentication();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: ({email, password} : FormValues ) => {
      if (email && password) {
        login({ email, password }).then(res => {
          if (res?.success) navigate('/');
          else setErrorAlert(res?.errors[0]);
        });
      }
    },
  });

  return {
    formik,
  };
};

export default useLogin;
