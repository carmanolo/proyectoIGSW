
import { TrendingUp, Target, Award, Clock, CheckCircle } from 'lucide-react';

export const GraficoDesempeno = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      titulo: 'Clases Tomadas',
      valor: data?.clasesTomadas || 0,
      total: data?.clasesTotales || 0,
      icono: <Clock className="w-5 h-5 text-blue-500" />,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      titulo: 'Clases Restantes',
      valor: (data?.clasesTotales || 0) - (data?.clasesTomadas || 0),
      total: data?.clasesTotales || 0,
      icono: <Target className="w-5 h-5 text-yellow-500" />,
      color: 'bg-yellow-50 border-yellow-200'
    },
    {
      titulo: 'Progreso',
      valor: data?.progreso || 0,
      total: 100,
      icono: <TrendingUp className="w-5 h-5 text-green-500" />,
      color: 'bg-green-50 border-green-200',
      esPorcentaje: true
    },
    {
      titulo: 'Clases Completadas',
      valor: data?.clasesCompletadas || 0,
      total: data?.clasesTotales || 0,
      icono: <CheckCircle className="w-5 h-5 text-purple-500" />,
      color: 'bg-purple-50 border-purple-200'
    }
  ];

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-800">Tu Desempeño</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.color} rounded-lg p-3 border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 font-medium">{stat.titulo}</p>
                <p className="text-xl font-bold text-gray-800">
                  {stat.esPorcentaje ? `${stat.valor}%` : stat.valor}
                </p>
                {!stat.esPorcentaje && stat.total > 0 && (
                  <p className="text-xs text-gray-500">de {stat.total}</p>
                )}
              </div>
              <div className="bg-white rounded-full p-2 shadow-sm">
                {stat.icono}
              </div>
            </div>
            {!stat.esPorcentaje && stat.total > 0 && (
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${(stat.valor / stat.total) * 100}%` }}
                ></div>
              </div>
            )}
            {stat.esPorcentaje && (
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-green-600 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${stat.valor}%` }}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
