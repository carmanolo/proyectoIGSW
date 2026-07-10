import { useState } from 'react';
import { SidebarItem } from "./SidebarItem.jsx";
import { MdHouse, MdSchool, MdAttachMoney, MdShoppingCart, MdAdminPanelSettings, MdDirectionsCar, MdLogout, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { useAuth } from '@context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const SidebarBase = ({ pageContent }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);

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

    const role = String(user?.rol || "").toLowerCase();


    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                {/* Navbar */}
                <nav className="navbar w-full bg-white border-b border-gray-200">
                    <div className="flex-1 flex items-center gap-2">
                        <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4">
                                <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                                <path d="M9 4v16"></path>
                                <path d="M14 10l2 2l-2 2"></path>
                            </svg>
                        </label>
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-gradient"> Conduce</span>
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
                <div className="actual-page-background min-h-screen bg-slate-50">
                    <div className="p-6 actual-page-content">
                        {pageContent}
                    </div>
                </div>
            </div>

            <div className="drawer-side z-40">
                <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className={`flex min-h-full flex-col items-start bg-[#15234b] text-gray-300 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
                    <div className="flex w-full items-center justify-between p-4 border-b border-[#1e3060]">
                        {!isCollapsed && <span className="font-bold text-white text-lg tracking-wide ml-2">Menú</span>}
                        <button onClick={() => setIsCollapsed(!isCollapsed)} className="btn btn-ghost btn-sm btn-square text-white hover:bg-[#1e3060]">
                            {isCollapsed ? <MdChevronRight className="w-5 h-5" /> : <MdChevronLeft className="w-5 h-5" />}
                        </button>
                    </div>
                    <ul className="menu w-full grow pt-4 px-2">
                        {/* Items del menú */}
                        <SidebarItem label="Inicio" destination="/home" icon={MdHouse} isCollapsed={isCollapsed} />            
                        <SidebarItem label="Clases" destination="/clase" icon={MdSchool} isCollapsed={isCollapsed} />
                        
                        {/* Material Descargable - visible para todos */}
                        <SidebarItem label="Material Descargable" destination="/mis-clases" icon={MdSchool} isCollapsed={isCollapsed} />
                        
                        <SidebarItem label="Planes" destination="/planes" icon={MdAdminPanelSettings} isCollapsed={isCollapsed} />
                        {role === 'estudiante' && (
                            <SidebarItem label="Comprar Clases" destination="/comprar-clases" icon={MdShoppingCart} isCollapsed={isCollapsed} />
                        )}
                        
                        {(role === 'profesor' || role === 'secretario') && (
                            <>
                                <SidebarItem label="Generar QR Asistencia" destination="/generar-qr-clase" icon={MdSchool} isCollapsed={isCollapsed} />
                                <SidebarItem label="Ver Asistencias" destination="/ver-asistencia" icon={MdSchool} isCollapsed={isCollapsed} />
                            </>
                        )}
                        
                        {role === 'estudiante' && (
                            <>
                                <SidebarItem label="Mi Historial de Clases" destination="/historial-clases" icon={MdSchool} isCollapsed={isCollapsed} />
                                <SidebarItem label="Registrar Asistencia (QR)" destination="/escanear-asistencia" icon={MdSchool} isCollapsed={isCollapsed} />
                                <SidebarItem label="Próximas Clases" destination="/calendario-clases" icon={MdSchool} isCollapsed={isCollapsed} />
                            </>
                        )}
                        
                        {role === 'secretario' && (
                            <>
                                <SidebarItem label="Gestión de Vehículos" destination="/gestion-vehiculos" icon={MdDirectionsCar} isCollapsed={isCollapsed} />
                                <SidebarItem label="Gestionar Ventas" destination="/gestionar-ventas" icon={MdAttachMoney} isCollapsed={isCollapsed} />
                                <SidebarItem label="Lista de Espera" destination="/lista-espera" icon={MdAdminPanelSettings} isCollapsed={isCollapsed} />
                                <SidebarItem label="Gestionar Usuarios" destination="/Gestion de Usuarios" icon={MdAdminPanelSettings} isCollapsed={isCollapsed} />
                            </>
                        )}
                        
                        {role === 'profesor' && (
                            <SidebarItem label="Mis Clases" destination="/mis-clases" icon={MdSchool} isCollapsed={isCollapsed} />
                        )}
                        
                        {(role === 'profesor' || role === 'estudiante') && (
                            <SidebarItem label="Evaluaciones" destination="/evaluaciones" icon={MdSchool} isCollapsed={isCollapsed} />
                        )}

                        {/* Botón Logout */}
                        <li className="mt-auto pt-4 mb-6 px-2 w-full border-t border-[#1e3060]" title={isCollapsed ? "Cerrar Sesión" : ""}>
                            <button 
                                onClick={handleLogout}
                                className={`flex items-center px-4 py-3 w-full border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white transition-colors rounded-lg ${isCollapsed ? 'justify-center' : 'gap-3'}`}
                            >
                                <MdLogout className="w-5 h-5 min-w-[20px]" />
                                {!isCollapsed && <span className="font-semibold text-sm">Cerrar Sesión</span>}
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SidebarBase;