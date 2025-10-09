import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminSidebar() {
    const location = useLocation();
    const { user, logout } = useAuth();

    const menuItems = [
        { path: '/admin/dashboard', icon: '📊', label: 'Tableau de bord' },
        { path: '/admin/events', icon: '📅', label: 'Événements' },
        { path: '/admin/password', icon: '🔑', label: 'Mot de passe' }
    ];

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    return (
        <div className="admin-sidebar">
            <div className="sidebar-header">
                <Link to="/" className="sidebar-logo">
                    NetandPro<span>Admin</span>
                </Link>
            </div>

            <nav className="sidebar-menu">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`sidebar-menu-item ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <span className="sidebar-menu-item-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                ))}

                <div className="sidebar-menu-item" onClick={logout}>
                    <span className="sidebar-menu-item-icon">🚪</span>
                    <span>Déconnexion</span>
                </div>
            </nav>

            {user && (
                <div className="sidebar-footer">
                    <div className="admin-user-info">
                        <strong>{user.email}</strong>
                        <span className="admin-expiration">
                            Expire: {formatDate(user.passwordExpiration)}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminSidebar;