import React, { useState, useEffect } from 'react';
import { eventService } from '../services/eventService';

function EditEventModal({ event, onClose, onUpdate }) {
    const [locations, setLocations] = useState([]);
    const [formData, setFormData] = useState({
        clientName: event.client_name || '',
        clientEmail: event.client_email || '',
        clientPhone: event.client_phone || '',
        companyName: event.company_name || '',
        locationId: event.location_id || '',
        dateStart: event.date_start ? event.date_start.slice(0, 16) : '',
        dateEnd: event.date_end ? event.date_end.slice(0, 16) : '',
        services: Array.isArray(event.services) ? event.services : [],
        paymentMethod: event.payment_method || '',
        notes: event.notes || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const services = [
        'Interprétation simultanée à distance',
        'Interprétation simultanée',
        'Sonorisation',
        'Vidéo & projection',
        'Éclairage',
        'Captation vidéo',
        'Webinar',
        'Tourguide',
        'Conférence silencieuse',
        'Solutions intégrées'
    ];

    const paymentMethods = [
        'Chèque',
        'Espèces',
        'MTN Mobile Money',
        'Orange Money',
        'Virement bancaire'
    ];

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const data = await eventService.getLocations();
            setLocations(data);
        } catch (error) {
            console.error('Erreur chargement lieux:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError('');
    };

    const handleServiceToggle = (service) => {
        const updatedServices = formData.services.includes(service)
            ? formData.services.filter(s => s !== service)
            : [...formData.services, service];
        
        setFormData({ ...formData, services: updatedServices });
        setError('');
    };

    const validateForm = () => {
        if (!formData.clientName || !formData.clientEmail || !formData.clientPhone) {
            setError('Nom, email et téléphone sont requis');
            return false;
        }
        if (!formData.locationId) {
            setError('Veuillez sélectionner un lieu');
            return false;
        }
        if (!formData.dateStart || !formData.dateEnd) {
            setError('Les dates sont requises');
            return false;
        }
        if (!formData.paymentMethod) {
            setError('Mode de paiement requis');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            console.log('📤 Envoi modification événement:', formData); // Debug
            await eventService.updateEvent(event.id, formData);
            alert('Événement modifié avec succès !');
            onUpdate(); // Rafraîchir la liste
            onClose(); // Fermer le modal
        } catch (error) {
            console.error('❌ Erreur modification:', error);
            setError('Erreur lors de la modification. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
                <div className="modal-header">
                    <h2>✏️ Modifier l'événement #{event.id}</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                {error && (
                    <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Informations client */}
                    <div className="form-section">
                        <h3>👤 Informations client</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label required">Nom complet</label>
                                <input
                                    type="text"
                                    name="clientName"
                                    className="form-input"
                                    value={formData.clientName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label required">Email</label>
                                <input
                                    type="email"
                                    name="clientEmail"
                                    className="form-input"
                                    value={formData.clientEmail}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label required">Téléphone</label>
                                <input
                                    type="tel"
                                    name="clientPhone"
                                    className="form-input"
                                    value={formData.clientPhone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Entreprise (optionnel)</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    className="form-input"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Lieu et dates */}
                    <div className="form-section">
                        <h3>📍 Lieu et période</h3>
                        <div className="form-group">
                            <label className="form-label required">Lieu</label>
                            <select
                                name="locationId"
                                className="form-select"
                                value={formData.locationId}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">-- Sélectionnez --</option>
                                {locations.map(location => (
                                    <option key={location.id} value={location.id}>
                                        {location.full_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label required">Date début</label>
                                <input
                                    type="datetime-local"
                                    name="dateStart"
                                    className="form-input"
                                    value={formData.dateStart}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label required">Date fin</label>
                                <input
                                    type="datetime-local"
                                    name="dateEnd"
                                    className="form-input"
                                    value={formData.dateEnd}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Services */}
                    <div className="form-section">
                        <h3>🎯 Services</h3>
                        <div className="services-grid" style={{ gridTemplateColumns: '1fr', gap: '0.5rem' }}>
                            {services.map((service, index) => (
                                <div key={index} className="service-checkbox">
                                    <input
                                        type="checkbox"
                                        id={`edit-service-${index}`}
                                        checked={formData.services.includes(service)}
                                        onChange={() => handleServiceToggle(service)}
                                    />
                                    <label htmlFor={`edit-service-${index}`} style={{ padding: '0.8rem' }}>
                                        <div className="checkbox-custom"></div>
                                        <span className="service-name">{service}</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Paiement */}
                    <div className="form-section">
                        <h3>💳 Paiement</h3>
                        <div className="form-group">
                            <label className="form-label required">Mode de paiement</label>
                            <select
                                name="paymentMethod"
                                className="form-select"
                                value={formData.paymentMethod}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">-- Choisir --</option>
                                {paymentMethods.map((method, index) => (
                                    <option key={index} value={method}>{method}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Notes</label>
                            <textarea
                                name="notes"
                                className="form-textarea"
                                value={formData.notes}
                                onChange={handleInputChange}
                                rows="3"
                            />
                        </div>
                    </div>

                    {/* Boutons */}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={onClose} 
                            style={{ flex: 1 }}
                            disabled={loading}
                        >
                            Annuler
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary" 
                            disabled={loading} 
                            style={{ flex: 1 }}
                        >
                            {loading ? 'Enregistrement...' : '✅ Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditEventModal;