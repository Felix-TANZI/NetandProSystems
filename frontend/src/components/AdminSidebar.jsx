import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Calendar, KeyRound, LogOut, Shield } from 'lucide-react';

function AdminSidebar() {
    const location = useLocation();
    const { user, logout } = useAuth();

    const menuItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
        { path: '/admin/events', icon: Calendar, label: 'Événements' },
        { path: '/admin/password', icon: KeyRound, label: 'Mot de passe' }
    ];

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    return (
        <div className="admin-sidebar">
            <div className="sidebar-header">
                <Link to="/" className="sidebar-logo">
                    <Shield className="sidebar-logo-icon" size={32} strokeWidth={2.5} />
                    <div className="sidebar-logo-text">
                        <span className="sidebar-logo-main">NetandPro</span>
                        <span className="sidebar-logo-sub">Admin Panel</span>
                    </div>
                </Link>
            </div>

            <nav className="sidebar-menu">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`sidebar-menu-item ${isActive ? 'active' : ''}`}
                        >
                            <div className="sidebar-menu-item-icon">
                                <Icon size={20} strokeWidth={2} />
                            </div>
                            <span className="sidebar-menu-item-label">{item.label}</span>
                            {isActive && <div className="sidebar-menu-item-indicator" />}
                        </Link>
                    );
                })}

                <div className="sidebar-menu-divider" />

                <div className="sidebar-menu-item logout-item" onClick={logout}>
                    <div className="sidebar-menu-item-icon">
                        <LogOut size={20} strokeWidth={2} />
                    </div>
                    <span className="sidebar-menu-item-label">Déconnexion</span>
                </div>
            </nav>

            {user && (
                <div className="sidebar-footer">
                    <div className="admin-user-info">
                        <div className="admin-user-avatar">
                            {user.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="admin-user-details">
                            <strong className="admin-user-email">{user.email}</strong>
                            <span className="admin-expiration">
                                Expire: {formatDate(user.passwordExpiration)}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminSidebar;