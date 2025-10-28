import React, { useState, useEffect } from 'react';
import { eventService } from '../services/eventService';
import AdminSidebar from '../components/AdminSidebar';
import EventModal from '../components/EventModal';
import EditEventModal from '../components/EditEventModal';
import { Calendar, Search, Filter, Eye, Edit2, Trash2, CheckCircle2, Clock, XCircle } from 'lucide-react';
import '../styles/admin.css';

function AdminEvents() {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [editingEvent, setEditingEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        filterEvents();
    }, [searchTerm, statusFilter, events]);

    const fetchEvents = async () => {
        try {
            const data = await eventService.getAllEvents();
            setEvents(data);
            setFilteredEvents(data);
        } catch (error) {
            console.error('Erreur chargement événements:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterEvents = () => {
        let filtered = [...events];

        if (searchTerm) {
            filtered = filtered.filter(event =>
                event.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.client_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.location_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(event => event.status === statusFilter);
        }

        setFilteredEvents(filtered);
    };

    const handleStatusChange = async (eventId, newStatus) => {
        try {
            await eventService.updateStatus(eventId, newStatus);
            fetchEvents();
            alert('Statut mis à jour avec succès');
        } catch (error) {
            console.error('Erreur mise à jour statut:', error);
            alert('Erreur lors de la mise à jour du statut');
        }
    };

    const handleDelete = async (eventId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
            try {
                await eventService.deleteEvent(eventId);
                fetchEvents();
                alert('Événement supprimé avec succès');
            } catch (error) {
                console.error('Erreur suppression:', error);
                alert('Erreur lors de la suppression');
            }
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'Confirmé': { icon: CheckCircle2, className: 'status-confirmed' },
            'En attente': { icon: Clock, className: 'status-pending' },
            'Annulé': { icon: XCircle, className: 'status-cancelled' }
        };
        
        const config = statusConfig[status] || statusConfig['En attente'];
        const Icon = config.icon;
        
        return (
            <span className={`status-badge ${config.className}`}>
                <Icon size={14} />
                {status}
            </span>
        );
    };

    return (
        <div className="admin-layout">
            <AdminSidebar />

            <main className="admin-main">
                <div className="admin-header">
                    <h1>
                        <Calendar size={32} strokeWidth={2.5} />
                        Gestion des événements
                    </h1>
                </div>

                <div className="admin-card">
                    <div className="admin-card-header">
                        <h2>Liste des événements ({filteredEvents.length})</h2>
                        
                        <div className="search-bar">
                            <div className="search-input-wrapper">
                                <Search size={20} className="search-icon" />
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Rechercher par nom, email ou lieu..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            
                            <div className="filter-wrapper">
                                <Filter size={20} className="filter-icon" />
                                <select
                                    className="filter-select"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">Tous les statuts</option>
                                    <option value="En attente">En attente</option>
                                    <option value="Confirmé">Confirmé</option>
                                    <option value="Annulé">Annulé</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <p style={{ color: 'var(--admin-text-muted)' }}>Chargement des événements...</p>
                        </div>
                    ) : filteredEvents.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <Calendar size={64} color="var(--admin-text-muted)" strokeWidth={1} />
                            <p style={{ color: 'var(--admin-text-muted)', marginTop: '1rem' }}>
                                Aucun événement trouvé
                            </p>
                        </div>
                    ) : (
                        <div className="table-wrapper">
                            <table className="events-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Client</th>
                                        <th>Email</th>
                                        <th>Lieu</th>
                                        <th>Date début</th>
                                        <th>Statut</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEvents.map((event) => (
                                        <tr key={event.id}>
                                            <td>#{event.id}</td>
                                            <td className="td-name">{event.client_name}</td>
                                            <td className="td-email">{event.client_email}</td>
                                            <td>{event.location_name}</td>
                                            <td>{new Date(event.date_start).toLocaleDateString('fr-FR')}</td>
                                            <td>
                                                <select
                                                    className="status-select"
                                                    value={event.status}
                                                    onChange={(e) => handleStatusChange(event.id, e.target.value)}
                                                >
                                                    <option value="En attente">En attente</option>
                                                    <option value="Confirmé">Confirmé</option>
                                                    <option value="Annulé">Annulé</option>
                                                </select>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="btn-action btn-view"
                                                        onClick={() => setSelectedEvent(event)}
                                                        title="Voir les détails"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        className="btn-action btn-edit"
                                                        onClick={() => setEditingEvent(event)}
                                                        title="Modifier"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        className="btn-action btn-delete"
                                                        onClick={() => handleDelete(event.id)}
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {selectedEvent && (
                <EventModal
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                />
            )}

            {editingEvent && (
                <EditEventModal
                    event={editingEvent}
                    onClose={() => setEditingEvent(null)}
                    onUpdate={fetchEvents}
                />
            )}
        </div>
    );
}

export default AdminEvents;