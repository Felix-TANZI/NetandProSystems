import React, { useState, useEffect } from 'react';
import { eventService } from '../services/eventService';
import AdminSidebar from '../components/AdminSidebar';
import EventModal from '../components/EventModal';
import EditEventModal from '../components/EditEventModal';
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

        // Filtre par recherche
        if (searchTerm) {
            filtered = filtered.filter(event =>
                event.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.client_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.location_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtre par statut
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

    const exportToCSV = () => {
        const headers = ['ID', 'Client', 'Email', 'Téléphone', 'Lieu', 'Date début', 'Date fin', 'Statut', 'Paiement'];
        const rows = filteredEvents.map(event => [
            event.id,
            event.client_name,
            event.client_email,
            event.client_phone,
            event.location_name,
            new Date(event.date_start).toLocaleString('fr-FR'),
            new Date(event.date_end).toLocaleString('fr-FR'),
            event.status,
            event.payment_method
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `evenements_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Confirmé': return 'status-confirmed';
            case 'En attente': return 'status-pending';
            case 'Annulé': return 'status-cancelled';
            default: return '';
        }
    };

    return (
        <div className="admin-layout">
            <AdminSidebar />

            <main className="admin-main">
                <div className="admin-header">
                    <h1>📅 Gestion des événements</h1>
                    <button className="btn btn-secondary" onClick={exportToCSV}>
                        📥 Exporter CSV
                    </button>
                </div>

                <div className="admin-card">
                    <div className="admin-card-header">
                        <h2>Liste des événements ({filteredEvents.length})</h2>
                        
                        <div className="search-bar">
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Rechercher par nom, email, lieu..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            
                            <select
                                className="form-select"
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

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <p>Chargement...</p>
                        </div>
                    ) : filteredEvents.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray)' }}>
                            <p>Aucun événement trouvé</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="events-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Client</th>
                                        <th>Lieu</th>
                                        <th>Date</th>
                                        <th>Statut</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEvents.map((event) => (
                                        <tr key={event.id}>
                                            <td>#{event.id}</td>
                                            <td>
                                                <strong>{event.client_name}</strong>
                                                <br />
                                                <small style={{ color: 'var(--gray)' }}>{event.client_email}</small>
                                            </td>
                                            <td>{event.location_name}</td>
                                            <td>
                                                {new Date(event.date_start).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td>
                                                <select
                                                    className={`status-badge ${getStatusBadgeClass(event.status)}`}
                                                    value={event.status}
                                                    onChange={(e) => handleStatusChange(event.id, e.target.value)}
                                                    style={{ border: 'none', cursor: 'pointer', fontWeight: '600' }}
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
                                                    >
                                                        👁️ Voir
                                                    </button>
                                                    <button
                                                        className="btn-action btn-edit"
                                                        onClick={() => setEditingEvent(event)}
                                                    >
                                                        ✏️ Modifier
                                                    </button>
                                                    <button
                                                        className="btn-action btn-delete"
                                                        onClick={() => handleDelete(event.id)}
                                                    >
                                                        🗑️ Supprimer
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

            {/* Modal détails événement */}
            {selectedEvent && (
                <EventModal
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                />
            )}

            {/* Modal modification événement */}
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