import { Link } from 'react-router-dom';

export const SidebarItem = ({label, destination, icon: Icon}) => {
    return (
        <li>
            <Link to={destination} className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-blue-50 hover:text-blue-600">
                <Icon className="w-5 h-5" />
                <span className="is-drawer-close:hidden">{label}</span>
            </Link>
        </li>
    );
}

export default SidebarItem;