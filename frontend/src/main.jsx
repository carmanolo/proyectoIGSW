import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import Clase from '@pages/Clase';
import ComprarClases from '@pages/ComprarClases';
import GestionarVentas from '@pages/GestionarVentas';
import ProtectedRoute from '@components/ProtectedRoute';
import '@styles/styles.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      {
        path: '/home',
        element: <Home />
      },
      {
        path: '/clase',
        element: <Clase/>
      },
      {
        path: '/comprar-clases',
        element: <ComprarClases />
      },
      {
        path: '/gestionar-ventas',
        element: <GestionarVentas />
      }
    ]
  },
  {
    path: '/auth',
    element: <Login />
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
