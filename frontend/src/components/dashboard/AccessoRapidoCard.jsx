import { TrendingUp, BookOpen, Calendar, DollarSign, Users, Clock, Award, FileText } from 'lucide-react';

export const AccesoRapidoCard = ({ rol }) => {
  // Diferentes accesos según el rol
  const getAccesos = () => {
    const accesosComunes = [
      { icono: <Calendar className="w-6 h-6 mx-auto mb-1" />, label: 'Horario', color: 'blue' },
      { icono: <BookOpen className="w-6 h-6 mx-auto mb-1" />, label: 'Material', color: 'yellow' },
    ];

    const accesosPorRol = {
      estudiante: [
        ...accesosComunes,
        { icono: <TrendingUp className="w-6 h-6 mx-auto mb-1" />, label: 'Progreso', color: 'blue' },
        { icono: <DollarSign className="w-6 h-6 mx-auto mb-1" />, label: 'Pagos', color: 'yellow' },
      ],
      profesor: [
        ...accesosComunes,
        { icono: <Users className="w-6 h-6 mx-auto mb-1" />, label: 'Alumnos', color: 'blue' },
        { icono: <Award className="w-6 h-6 mx-auto mb-1" />, label: 'Evaluaciones', color: 'green' },
      ],
      secretaria: [
        ...accesosComunes,
        { icono: <Users className="w-6 h-6 mx-auto mb-1" />, label: 'Lista Espera', color: 'yellow' },
        { icono: <FileText className="w-6 h-6 mx-auto mb-1" />, label: 'Reportes', color: 'blue' },
      ],
      ADMINISTRADOR: [
        ...accesosComunes,
        { icono: <Users className="w-6 h-6 mx-auto mb-1" />, label: 'Usuarios', color: 'blue' },
        { icono: <DollarSign className="w-6 h-6 mx-auto mb-1" />, label: 'Finanzas', color: 'yellow' },
      ],
    };

    return accesosPorRol[rol] || accesosPorRol.estudiante;
  };

  const accesos = getAccesos();

  const getColorClass = (color) => {
    const colores = {
      blue: 'bg-blue-50 hover:bg-blue-100 border-blue-100',
      yellow: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-100',
      green: 'bg-green-50 hover:bg-green-100 border-green-100',
      gray: 'bg-gray-50 hover:bg-gray-100 border-gray-200',
    };
    return colores[color] || colores.gray;
  };

  const getIconColor = (color) => {
    const colores = {
      blue: 'text-blue-500',
      yellow: 'text-yellow-500',
      green: 'text-green-500',
      gray: 'text-gray-500',
    };
    return colores[color] || colores.gray;
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="font-semibold text-gray-800 mb-4">Acceso Rápido</h3>
      <div className="grid grid-cols-2 gap-3">
        {accesos.map((acceso, index) => (
          <button
            key={index}
            className={`${getColorClass(acceso.color)} rounded-lg p-3 text-center transition-colors border`}
          >
            <div className={getIconColor(acceso.color)}>
              {acceso.icono}
            </div>
            <span className="text-xs text-gray-600">{acceso.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};