import { NavLink } from 'react-router-dom';

export const SidebarItem = ({label, destination, icon: Icon, isCollapsed}) => {
    return (
        <li title={isCollapsed ? label : ""} className="px-2 mb-1">
            <NavLink 
                to={destination} 
                className={({ isActive }) => 
                    `flex items-center px-4 py-3 rounded-lg transition-colors ${
                        isActive 
                            ? 'bg-[#253b75] text-white font-semibold' 
                            : 'text-gray-300 hover:bg-[#1e3060] hover:text-white'
                    } ${isCollapsed ? 'justify-center' : 'gap-3'}`
                }
            >
                <Icon className="w-6 h-6 min-w-[24px]" />
                {!isCollapsed && <span className="text-sm whitespace-nowrap">{label}</span>}
            </NavLink>
        </li>
    );
}

export default SidebarItem;