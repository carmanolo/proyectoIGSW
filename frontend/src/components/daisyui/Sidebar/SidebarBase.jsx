import { SidebarItem } from "./SidebarItem.jsx";
import { MdHouse, MdSchool, MdAttachMoney, MdShoppingCart, MdAdminPanelSettings, MdDirectionsCar, MdLogout } from "react-icons/md";
import { useAuth } from '@context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const SidebarBase = ({ pageContent }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/auth');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            sessionStorage.removeItem('usuario');
            sessionStorage.removeItem('token');
            window.location.href = '/auth';
        }
    };

    // Obtener iniciales del usuario
    const getInitials = () => {
        if (!user?.nombre) return 'U';
        const nombres = user.nombre.split(' ');
        if (nombres.length >= 2) {
            return (nombres[0][0] + nombres[1][0]).toUpperCase();
        }
        return user.nombre.substring(0, 2).toUpperCase();
    };

    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                {/* Navbar */}
                <nav className="navbar w-full bg-base-300 shadow-sm">
                    <div className="flex-1 flex items-center gap-2">
                        <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4">
                                <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                                <path d="M9 4v16"></path>
                                <path d="M14 10l2 2l-2 2"></path>
                            </svg>
                        </label>
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-gradient">🚗 Conduce</span>
                        </div>
                    </div>
                    <div className="flex-none">
                        <div className="flex items-center gap-3">
                            <div className="avatar placeholder">
                                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                                    {getInitials()}
                                </div>
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-sm font-medium text-gray-800">{user?.nombre || 'Usuario'}</p>
                                <p className="text-xs text-gray-500 capitalize">{user?.rol || 'Estudiante'}</p>
                            </div>
                        </div>
                    </div>
                </nav>
                <div className="actual-page-background">
                    <div className="p-4 actual-page-content">
                        {pageContent}
                    </div>
                </div>
            </div>

            <div className="drawer-side is-drawer-close:overflow-visible">
                <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
                    <ul className="menu w-full grow">
                        {/* Items del menú */}
                        <SidebarItem label="Inicio" destination="/home" icon={MdHouse} />            
                        <SidebarItem label="Clases" destination="/clase" icon={MdSchool} />
                        {(user?.rol === 'secretario' || user?.rol === 'profesor') && (
                           <SidebarItem label="Clases" destination="/clase" icon={MdSchool} />
                        ) 
                        } 
                        {user?.rol === 'profesor' && (
                            <SidebarItem label="Mis Clases" destination="/mis-clases" icon={MdSchool} />
                        )}
                        
                        <SidebarItem label="Planes" destination="/planes" icon={MdAdminPanelSettings} />
                        <SidebarItem label="Comprar Clases" destination="/comprar-clases" icon={MdShoppingCart} />
                        <SidebarItem label="Generar QR Asistencia" destination="/generar-qr-clase" icon={MdSchool} />
                        <SidebarItem label="Ver Asistencias" destination="/ver-asistencia" icon={MdSchool} />

                        
                        {user?.rol === 'estudiante' && (
                            <>
                                <SidebarItem label="Mi Historial de Clases" destination="/historial-clases" icon={MdSchool} />
                                <SidebarItem label="Agendar Clase" destination="/agendar-clase" icon={MdSchool} />
                                 <SidebarItem label="Registrar Asistencia (QR)" destination="/escanear-asistencia" icon={MdSchool} />
                            </>
                        )}
                        
                        {user?.rol === 'secretario' && (
                            <>
                                <SidebarItem label="Gestión de Clases Alumnos" destination="/gestion-clases-alumnos" icon={MdAdminPanelSettings} />
                                <SidebarItem label="Gestión de Vehículos" destination="/gestion-vehiculos" icon={MdDirectionsCar} />
                                <SidebarItem label="Gestionar Ventas" destination="/gestionar-ventas" icon={MdAttachMoney} />
                            </>
                        )}
                        
                        <SidebarItem label="Evaluaciones" destination="/evaluaciones" icon={MdSchool} />
                        
                        {user?.rol === 'estudiante' && (
                            <SidebarItem label="Próximas Clases" destination="/calendario-clases" icon={MdSchool} />
                        )}

                        {/* Botón Logout */}
                        <li className="mt-auto pt-4 border-t border-base-300">
                            <button 
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-red-50 hover:text-red-600 transition-colors rounded-lg"
                            >
                                <MdLogout className="w-5 h-5" />
                                <span className="font-medium">Cerrar Sesión</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default SidebarBase;