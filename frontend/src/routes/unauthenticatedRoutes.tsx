import React from 'react';
import Welcome from 'pages/welcome/welcome';
import { createHashRouter } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import NotFound from './404';

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
  ];

  const authenticated = !cookies.refreshToken;

  if (authenticated) {
    routerList.push({
      path: '/login',
      element: <h1>LOGIN</h1>,
    });
  }

  const router = createHashRouter(routerList);

  return { router };
};

export default useRouter;
