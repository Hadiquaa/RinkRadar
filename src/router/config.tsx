
import type { RouteObject } from 'react-router-dom';

// Pages
import Home from '../pages/home/page';
import Map from '../pages/map/page';
import Dashboard from '../pages/dashboard/page';
import About from '../pages/about/page';
import NotFound from '../pages/NotFound';
import Impacts from '../pages/impacts/page';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/explore',
    element: <Map />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/impacts',
    element: <Impacts />
  },
  {
    path: '*',
    element: <NotFound />,
  }
];

export default routes;
