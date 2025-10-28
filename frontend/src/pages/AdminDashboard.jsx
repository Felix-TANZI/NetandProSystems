import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { statsService } from '../services/statsService';
import AdminSidebar from '../components/AdminSidebar';
import { Calendar, CheckCircle2, Clock, XCircle, TrendingUp, Target } from 'lucide-react';
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
                    <h1>
                        <TrendingUp size={32} strokeWidth={2.5} />
                        Tableau de bord
                    </h1>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <p style={{ color: 'var(--admin-text)' }}>Chargement des statistiques...</p>
                    </div>
                ) : (
                    <>
                        {/* Stats Cards */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon primary">
                                    <Calendar size={32} strokeWidth={2} color="white" />
                                </div>
                                <div className="stat-info">
                                    <h3>Total Événements</h3>
                                    <p>{stats.total}</p>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon success">
                                    <CheckCircle2 size={32} strokeWidth={2} color="white" />
                                </div>
                                <div className="stat-info">
                                    <h3>Confirmés</h3>
                                    <p>{getStatusCount('Confirmé')}</p>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon warning">
                                    <Clock size={32} strokeWidth={2} color="white" />
                                </div>
                                <div className="stat-info">
                                    <h3>En attente</h3>
                                    <p>{getStatusCount('En attente')}</p>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon danger">
                                    <XCircle size={32} strokeWidth={2} color="white" />
                                </div>
                                <div className="stat-info">
                                    <h3>Annulés</h3>
                                    <p>{getStatusCount('Annulé')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Événements par mois */}
                        <div className="admin-card">
                            <div className="admin-card-header">
                                <h2>
                                    <TrendingUp size={24} />
                                    Événements par mois (année en cours)
                                </h2>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', height: '200px' }}>
                                {stats.byMonth.length > 0 ? (
                                    stats.byMonth.map((item) => (
                                        <div key={item.month} style={{ flex: 1, textAlign: 'center' }}>
                                            <div
                                                style={{
                                                    height: `${(item.count / Math.max(...stats.byMonth.map(m => m.count))) * 150}px`,
                                                    background: 'linear-gradient(180deg, #3b82f6, #2563eb)',
                                                    borderRadius: '12px 12px 0 0',
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    justifyContent: 'center',
                                                    paddingTop: '0.5rem',
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    minHeight: '40px',
                                                    boxShadow: '0 -4px 20px rgba(59, 130, 246, 0.3)',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                {item.count}
                                            </div>
                                            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--admin-text-muted)', fontWeight: '600' }}>
                                                {monthNames[item.month - 1]}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ color: 'var(--admin-text-muted)', margin: 'auto' }}>Aucune donnée disponible</p>
                                )}
                            </div>
                        </div>

                        {/* Services les plus demandés */}
                        <div className="admin-card">
                            <div className="admin-card-header">
                                <h2>
                                    <Target size={24} />
                                    Top 5 services les plus demandés
                                </h2>
                            </div>

                            {stats.topServices.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {stats.topServices.map((service, index) => (
                                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ 
                                                minWidth: '220px', 
                                                fontWeight: '600',
                                                color: 'var(--admin-text)',
                                                fontSize: '1rem'
                                            }}>
                                                {service.name}
                                            </div>
                                            <div style={{ 
                                                flex: 1, 
                                                background: 'rgba(255, 255, 255, 0.05)', 
                                                borderRadius: '12px', 
                                                height: '40px', 
                                                position: 'relative',
                                                border: '1px solid var(--admin-border)'
                                            }}>
                                                <div
                                                    style={{
                                                        width: `${(service.count / stats.topServices[0].count) * 100}%`,
                                                        background: 'linear-gradient(90deg, #3b82f6, #10b981)',
                                                        height: '100%',
                                                        borderRadius: '12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'flex-end',
                                                        paddingRight: '1rem',
                                                        color: 'white',
                                                        fontWeight: 'bold',
                                                        minWidth: '60px',
                                                        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                >
                                                    {service.count}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: 'var(--admin-text-muted)', textAlign: 'center' }}>Aucun service enregistré</p>
                            )}
                        </div>

                        {/* Bouton vers gestion événements */}
                        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/admin/events')}
                                style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem' }}
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