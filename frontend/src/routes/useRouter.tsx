import React from 'react';
import Welcome from 'pages/welcome/welcome';
import { createHashRouter } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import NotFound from './404';
import Login from 'pages/Authentication';

const useRouter = () => {
  const [cookies] = useCookies(['refreshToken']);

  const routerList = [
    {
      path: '/',
      element: <Welcome />,
    },
    {
      path: '*',
      element: <NotFound />,
      status: 404,
    },
    {
      path: '/login',
      element: <Login />,
    },
  ];

  const authenticated = cookies.refreshToken;

  if (authenticated) {
    // Authenticated routes here
    // routerList.push({});
  }

  const router = createHashRouter(routerList);

  return { router };
};

export default useRouter;