import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { statsService } from '../services/statsService';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/admin.css';

function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        total: 0,
        byStatus: [],
        byMonth: [],
        topServices: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await statsService.getStats();
            setStats(data);
        } catch (error) {
            console.error('Erreur chargement stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusCount = (status) => {
        const statusData = stats.byStatus.find(s => s.status === status);
        return statusData ? statusData.count : 0;
    };

    const monthNames = [
        'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
        'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'
    ];

    return (
        <div className="admin-layout">
            <AdminSidebar />
            
            <main className="admin-main">
                <div className="admin-header">
                    <h1>📊 Tableau de bord</h1>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <p>Chargement des statistiques...</p>
                    </div>
                ) : (
                    <>
                        {/* Stats Cards */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon primary">📅</div>
                                <div className="stat-info">
                                    <h3>Total Événements</h3>
                                    <p>{stats.total}</p>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon success">✅</div>
                                <div className="stat-info">
                                    <h3>Confirmés</h3>
                                    <p>{getStatusCount('Confirmé')}</p>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon warning">⏳</div>
                                <div className="stat-info">
                                    <h3>En attente</h3>
                                    <p>{getStatusCount('En attente')}</p>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon danger">❌</div>
                                <div className="stat-info">
                                    <h3>Annulés</h3>
                                    <p>{getStatusCount('Annulé')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Événements par mois */}
                        <div className="admin-card" style={{ marginBottom: '2rem' }}>
                            <div className="admin-card-header">
                                <h2>📈 Événements par mois (année en cours)</h2>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', height: '200px' }}>
                                {stats.byMonth.length > 0 ? (
                                    stats.byMonth.map((item) => (
                                        <div key={item.month} style={{ flex: 1, textAlign: 'center' }}>
                                            <div
                                                style={{
                                                    height: `${(item.count / Math.max(...stats.byMonth.map(m => m.count))) * 150}px`,
                                                    background: 'linear-gradient(180deg, var(--primary), var(--secondary))',
                                                    borderRadius: '8px 8px 0 0',
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    justifyContent: 'center',
                                                    paddingTop: '0.5rem',
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    minHeight: '40px'
                                                }}
                                            >
                                                {item.count}
                                            </div>
                                            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--gray)' }}>
                                                {monthNames[item.month - 1]}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ color: 'var(--gray)', margin: 'auto' }}>Aucune donnée disponible</p>
                                )}
                            </div>
                        </div>

                        {/* Services les plus demandés */}
                        <div className="admin-card">
                            <div className="admin-card-header">
                                <h2>🎯 Top 5 services les plus demandés</h2>
                            </div>

                            {stats.topServices.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {stats.topServices.map((service, index) => (
                                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ 
                                                minWidth: '200px', 
                                                fontWeight: '600',
                                                color: 'var(--dark)'
                                            }}>
                                                {service.name}
                                            </div>
                                            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '8px', height: '30px', position: 'relative' }}>
                                                <div
                                                    style={{
                                                        width: `${(service.count / stats.topServices[0].count) * 100}%`,
                                                        background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                                                        height: '100%',
                                                        borderRadius: '8px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'flex-end',
                                                        paddingRight: '1rem',
                                                        color: 'white',
                                                        fontWeight: 'bold',
                                                        minWidth: '50px'
                                                    }}
                                                >
                                                    {service.count}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: 'var(--gray)', textAlign: 'center' }}>Aucun service enregistré</p>
                            )}
                        </div>

                        {/* Bouton vers gestion événements */}
                        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/admin/events')}
                                style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}
                            >
                                Gérer les événements →
                            </button>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default AdminDashboard;