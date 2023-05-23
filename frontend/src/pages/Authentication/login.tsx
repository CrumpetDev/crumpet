import LargeLogo from 'assets/images/Logo Large.svg';
import Button from 'components/Button';

const Login = () => {
  const handleSubmit = () => {
    console.log('submit');
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <img src={LargeLogo} alt="logo" className="mb-8 w-1/2 md:w-1/6" />
      <div className="flex flex-col items-center drop-shadow-lg rounded-md bg-white py-8 w-11/12 md:w-1/2">
        <div className="flex flex-col items-center w-11/12 md:w-2/3">
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back!</h1>
          <div className="h-0.5 bg-gray-200 w-full my-6"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
