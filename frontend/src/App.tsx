import React, { useState } from 'react';
// import { setOpenApiBase } from 'api/configOpenApi';
import Router from './routes';
import { TokenContext } from 'api';

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
    </TokenContext.Provider>
  );
}

export default App;
