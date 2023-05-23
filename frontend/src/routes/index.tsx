import useRouter from './unauthenticatedRoutes';
import { RouterProvider } from 'react-router-dom';

const Routes = () => {
  const { router } = useRouter();

  return <RouterProvider router={router} />;
};

export default Routes;
