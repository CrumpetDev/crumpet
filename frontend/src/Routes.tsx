import React from 'react';
import Welcome from 'pages/welcome/welcome';
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Welcome />,
  },
]);

export default router;
