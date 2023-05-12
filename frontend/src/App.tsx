import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
// import { setOpenApiBase } from 'api/configOpenApi';
import { RouterProvider } from 'react-router-dom';
import router from './Routes';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#242424',
    },
    text: {
      primary: '#adb5bd',
    },
    divider: '#adb5bd',
  },
});

function App() {
  // Will not work until openapi is setup
  // useEffect(() => {
  //   setOpenApiBase();
  // }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        <CssBaseline />
        <RouterProvider router={router} />
      </div>
    </ThemeProvider>
  );
}

export default App;
