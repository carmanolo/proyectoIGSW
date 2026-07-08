import { BookOpen, Calendar, Clock, Users, GraduationCap } from 'lucide-react';

export const MisCursosCard = ({ cursos, loading, rol }) => {
  const rolLower = rol?.toLowerCase() || 'estudiante';

  const getTitulo = () => {
    switch(rolLower) {
      case 'estudiante':
        return 'Mis Cursos';
      case 'profesor':
        return 'Cursos a Cargo';
      case 'secretaria':
      case 'secretario':
        return 'Cursos Disponibles';
      case 'administrador':
        return 'Todos los Cursos';
      default:
        return 'Cursos';
    }
  };

  const getIcono = () => {
    switch(rolLower) {
      case 'estudiante':
        return <GraduationCap className="w-5 h-5 text-blue-500" />;
      case 'profesor':
        return <Users className="w-5 h-5 text-blue-500" />;
      default:
        return <BookOpen className="w-5 h-5 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 bg-gray-200 animate-pulse">
        <div className="h-20 bg-gray-300 rounded-lg mb-2"></div>
        <div className="h-20 bg-gray-300 rounded-lg mb-2"></div>
      </div>
    );
  }

  if (!cursos || cursos.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 bg-gray-50 text-center">
        <div className="text-4xl mb-3">📖</div>
        <p className="text-gray-600">
          {rolLower === 'estudiante' ? 'Aún no estás inscrito en ningún curso' :
           rolLower === 'profesor' ? 'No tienes cursos asignados' :
           'No hay cursos disponibles'}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {rolLower === 'estudiante' ? 'Contrata un plan para comenzar' :
           'Espera a que te asignen cursos'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        {getIcono()}
        <h3 className="text-lg font-semibold text-gray-800">{getTitulo()}</h3>
        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full ml-auto">
          {cursos.length} curso{cursos.length > 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="space-y-3">
        {cursos.map((curso) => (
          <div key={curso.id_inscripcion} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{curso.plan?.nombre || 'Curso'}</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {curso.plan?.tipo || 'General'}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {curso.estado_inscripcion || 'Activo'}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Inicio: {new Date(curso.fecha_inicio).toLocaleDateString('es-CL')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {curso.clases_restantes || 0} clases restantes
                  </span>
                </div>
              </div>
              <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                curso.estado_pago === 'pagado' ? 'bg-green-100 text-green-700' :
                curso.estado_pago === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {curso.estado_pago === 'pagado' ? ' Pagado' :
                 curso.estado_pago === 'pendiente' ? ' Pendiente' :
                 ' Vencido'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};