import React from 'react';
import { createHashRouter, Navigate, RouteObject } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import NotFound from './404';
import Login from 'pages/Authentication';
import SidebarMenu from 'components/sidebarMenu';
import Root from 'pages/root';
import Settings from 'features/projects/pages/ProjectSettings';
import Flows from 'pages/flows';
import { useAuthentication } from 'api';
import ProtectedRoute from './ProtectedRoute';

const useRouter = () => {
  const [cookies] = useCookies(['refreshToken']);
  const authenticated = cookies.refreshToken;
  //const { authenticated } = useAuthentication();
  let routerList: RouteObject[] = [];

  routerList = [
    {
      path: '/',
      element: <ProtectedRoute> <Root /> </ProtectedRoute>,
      children: [
        { path: '/', element: <Navigate to="flows" replace /> },
				{ path: 'flows', element: <Flows />},
        { path: 'settings', element: <Settings /> },
      ],
    },
		{
			path: '/login',
			element: <Login />
		},
    {
      path: '*',
      element: <NotFound />,
    },
  ];

  // if (authenticated) {
  //   routerList = [
  //     {
  //       path: '/',
  //       element: <Root />,
  //       children: [
  //         { path: '/', element: <Navigate to="/settings" replace /> },
  //         { path: 'settings', element: <Settings /> },
  //       ],
  //     },
  //     {
  //       path: '*',
  //       element: <NotFound />,
  //     },
  //   ];
  // } else {
  //   routerList = [
  //     {
  //       path: '/',
  //       element: <Login />,
  //     },
  //     {
  //       path: '*',
  //       element: <Navigate to="/login" />,
  //     },
  //   ];
  // }

  const router = createHashRouter(routerList);

  return { router };
};

export default useRouter;
