import React, { useState } from 'react';
// import { setOpenApiBase } from 'api/configOpenApi';
import Router from './routes';
import { TokenContext } from 'api';
import { ToastContainer } from 'components/toasts';

function App() {
  const [accessToken, setAccessToken] = useState<string>('');
  const [refreshToken, setRefreshToken] = useState<string>('');

  // Will not work until openapi is setup
  // useEffect(() => {
  //   setOpenApiBase();
  // }, []);

  return (
    <TokenContext.Provider value={{ accessToken, setAccessToken, refreshToken, setRefreshToken }}>
      <Router />
      <ToastContainer />
    </TokenContext.Provider>
  );
}

export default App;
