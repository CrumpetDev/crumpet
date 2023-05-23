import LargeLogo from 'assets/images/Logo Large.svg';
import Button from 'components/Button';
import TextInput from 'components/textInput';
import useLogin from './useLogin';
import { Link } from 'react-router-dom';

const Login = () => {
  const { formik } = useLogin();

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <img src={LargeLogo} alt="logo" className="mb-8 w-1/2 md:w-1/6" />
      <div className="flex flex-col items-center drop-shadow-lg rounded-md bg-white py-8 w-11/12 md:w-1/2">
        <div className="flex flex-col items-center w-11/12 md:w-2/3">
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back!</h1>
          <div className="h-0.5 bg-gray-200 w-full my-6"></div>
          <TextInput
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            placeholder="Email"
            inputProps={{ id: 'email' }}
          />
          <TextInput
            containerStyle="mt-6"
            label="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            placeholder="Password"
            inputProps={{ type: 'password', id: 'password' }}
          />
          <div className="w-full mt-2 flex justify-end">
            <Link to="/forgotPassword">Forgot Password?</Link>
          </div>
          <Button onClick={formik.handleSubmit} styles="mt-6" text="Login" />
          <p className="mt-4">
            Don&apos;t Have an account?{' '}
            <span className="underline font-bold">
              <Link to={'/register'}>Register</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
