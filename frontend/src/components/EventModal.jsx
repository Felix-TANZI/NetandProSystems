import React from 'react';

function EventModal({ event, onClose }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>📋 Détails de l'événement</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <strong>Client :</strong> {event.client_name}
                    </div>
                    <div>
                        <strong>Email :</strong> {event.client_email}
                    </div>
                    <div>
                        <strong>Téléphone :</strong> {event.client_phone}
                    </div>
                    {event.company_name && (
                        <div>
                            <strong>Entreprise :</strong> {event.company_name}
                        </div>
                    )}
                    <div>
                        <strong>Lieu :</strong> {event.location_name}
                    </div>
                    <div>
                        <strong>Date de début :</strong> {new Date(event.date_start).toLocaleString('fr-FR')}
                    </div>
                    <div>
                        <strong>Date de fin :</strong> {new Date(event.date_end).toLocaleString('fr-FR')}
                    </div>
                    <div>
                        <strong>Services :</strong>
                        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                            {event.services.map((service, index) => (
                                <li key={index}>{service}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <strong>Mode de paiement :</strong> {event.payment_method}
                    </div>
                    {event.notes && (
                        <div>
                            <strong>Notes :</strong>
                            <p style={{ marginTop: '0.5rem', padding: '0.8rem', background: 'var(--light-gray)', borderRadius: '8px' }}>
                                {event.notes}
                            </p>
                        </div>
                    )}
                    <div>
                        <strong>Statut :</strong> <span className={`status-badge ${event.status === 'Confirmé' ? 'status-confirmed' : event.status === 'En attente' ? 'status-pending' : 'status-cancelled'}`}>{event.status}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventModal;