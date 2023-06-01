import React from 'react';
// import { setOpenApiBase } from 'api/configOpenApi';
import Router from './routes';

function App() {
  // Will not work until openapi is setup
  // useEffect(() => {
  //   setOpenApiBase();
  // }, []);

  return <Router />;
}

export default App;
