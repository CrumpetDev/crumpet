import React from 'react';
import Welcome from 'pages/welcome/welcome';
import { createHashRouter, Navigate, RouteObject } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import NotFound from './404';
import Login from 'pages/Authentication';
import SidebarMenu from 'components/sidebarMenu';

const useRouter = () => {
  const [cookies] = useCookies(['refreshToken']);
  const authenticated = cookies.refreshToken;
  let routerList: RouteObject[] = [];

  if (authenticated) {
    routerList = [
      {
        path: '/',
        element: <SidebarMenu />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ];
  } else {
    routerList = [
      {
        path: '/',
        element: <Login />,
      },
      {
        path: '*',
        element: <Navigate to="/login" />,
      },
    ];
  }

  const router = createHashRouter(routerList);

  return { router };
};

export default useRouter;
