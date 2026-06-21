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
import Plan from '@pages/Plan';
import Evaluacion from '@pages/Evaluacion';
import MisClases from '@pages/MisClases';
import '@styles/styles.css';

import HistorialClasesAlumno from '@pages/HistorialClasesAlumno';
import GestionClasesSecretaria from '@pages/GestionClasesSecretaria';
import GestionVehiculosSecretaria from '@pages/GestionVehiculosSecretaria';
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
        path: '/planes',
        element: <Plan/>
      },
      {
        path: '/comprar-clases',
        element: <ComprarClases />
      },
      {
        path: '/evaluaciones',
        element: <Evaluacion />
      },
      {
        path: '/mis-clases',
        element: <MisClases />
      },
      {
         path: '/gestionar-ventas',
        element: <GestionarVentas />
      },
      {
        path: '/historial-clases',
        element: <HistorialClasesAlumno />
      },
      {
        path: '/gestion-clases-alumnos',
        element: <GestionClasesSecretaria />
      },
      {
        path: '/gestion-vehiculos',
        element: <GestionVehiculosSecretaria />
      },
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
