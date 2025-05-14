import type { ReactNode } from 'react';

interface MenuItemProps {
    icon: ReactNode;
    title: string;
    onClick: () => void;
}

const MenuItem = ({ icon, title, onClick }: MenuItemProps) => {
    return (
        <div className="menu-item" onClick={onClick}>
            <div className="menu-item-icon">{icon}</div>
            <div className="menu-item-title">{title}</div>
        </div>
    );
};

export default MenuItem;
