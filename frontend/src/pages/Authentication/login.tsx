import LargeLogo from 'assets/images/Logo Large.svg';
import Button from 'components/Button';

const Login = () => {
  const handleSubmit = () => {
    console.log('submit');
  };

  return (
    <>
      <img src={LargeLogo} alt="logo" className="logo" />
      <Button onClick={handleSubmit} text="Login" />
    </>
  );
};

export default Login;
