import React from 'react';
import { X, User, Mail, Phone, Building, MapPin, Calendar, CreditCard, FileText } from 'lucide-react';

function EventModal({ event, onClose }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>
                        <FileText size={24} />
                        Détails de l'événement #{event.id}
                    </h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="modal-section">
                        <h3>
                            <User size={20} />
                            Informations client
                        </h3>
                        <div className="modal-info-grid">
                            <div className="modal-info-item">
                                <User size={16} />
                                <div>
                                    <label>Nom complet</label>
                                    <p>{event.client_name}</p>
                                </div>
                            </div>
                            <div className="modal-info-item">
                                <Mail size={16} />
                                <div>
                                    <label>Email</label>
                                    <p>{event.client_email}</p>
                                </div>
                            </div>
                            <div className="modal-info-item">
                                <Phone size={16} />
                                <div>
                                    <label>Téléphone</label>
                                    <p>{event.client_phone}</p>
                                </div>
                            </div>
                            {event.company_name && (
                                <div className="modal-info-item">
                                    <Building size={16} />
                                    <div>
                                        <label>Entreprise</label>
                                        <p>{event.company_name}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="modal-section">
                        <h3>
                            <Calendar size={20} />
                            Détails de l'événement
                        </h3>
                        <div className="modal-info-grid">
                            <div className="modal-info-item">
                                <MapPin size={16} />
                                <div>
                                    <label>Lieu</label>
                                    <p>{event.location_name}</p>
                                </div>
                            </div>
                            <div className="modal-info-item">
                                <Calendar size={16} />
                                <div>
                                    <label>Date de début</label>
                                    <p>{new Date(event.date_start).toLocaleString('fr-FR')}</p>
                                </div>
                            </div>
                            <div className="modal-info-item">
                                <Calendar size={16} />
                                <div>
                                    <label>Date de fin</label>
                                    <p>{new Date(event.date_end).toLocaleString('fr-FR')}</p>
                                </div>
                            </div>
                            <div className="modal-info-item">
                                <CreditCard size={16} />
                                <div>
                                    <label>Mode de paiement</label>
                                    <p>{event.payment_method}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-section">
                        <h3>Services demandés</h3>
                        <div className="services-list">
                            {event.services.map((service, index) => (
                                <span key={index} className="service-tag">
                                    {service}
                                </span>
                            ))}
                        </div>
                    </div>

                    {event.notes && (
                        <div className="modal-section">
                            <h3>Notes</h3>
                            <div className="notes-box">
                                <p>{event.notes}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EventModal;