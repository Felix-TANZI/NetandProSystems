import React, { useState, useEffect } from 'react';
import { eventService } from '../services/eventService';
import { validateStep1, validateStep2, validateStep3 } from '../utils/validation';

function EditEventModal({ event, onClose, onUpdate }) {
    const [locations, setLocations] = useState([]);
    const [formData, setFormData] = useState({
        clientName: event.client_name,
        clientEmail: event.client_email,
        clientPhone: event.client_phone,
        companyName: event.company_name || '',
        locationId: event.location_id,
        dateStart: event.date_start.slice(0, 16), // Format datetime-local
        dateEnd: event.date_end.slice(0, 16),
        services: event.services,
        paymentMethod: event.payment_method,
        notes: event.notes || ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

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
        'Virement bancaire',
        'Espèces',
        'Mobile Money',
        'Chèque'
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
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleServiceToggle = (service) => {
        const updatedServices = formData.services.includes(service)
            ? formData.services.filter(s => s !== service)
            : [...formData.services, service];
        
        setFormData({ ...formData, services: updatedServices });
        if (errors.services) {
            setErrors({ ...errors, services: '' });
        }
    };

    const validateForm = () => {
        const allErrors = {
            ...validateStep1(formData),
            ...validateStep2(formData),
            ...validateStep3(formData)
        };
        
        setErrors(allErrors);
        return Object.keys(allErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            await eventService.updateEvent(event.id, formData);
            alert('Événement modifié avec succès');
            onUpdate();
            onClose();
        } catch (error) {
            console.error('Erreur modification:', error);
            alert('Erreur lors de la modification');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
                <div className="modal-header">
                    <h2>✏️ Modifier l'événement #{event.id}</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

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
                                    className={`form-input ${errors.clientName ? 'error' : ''}`}
                                    value={formData.clientName}
                                    onChange={handleInputChange}
                                />
                                {errors.clientName && <span className="form-error">{errors.clientName}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label required">Email</label>
                                <input
                                    type="email"
                                    name="clientEmail"
                                    className={`form-input ${errors.clientEmail ? 'error' : ''}`}
                                    value={formData.clientEmail}
                                    onChange={handleInputChange}
                                />
                                {errors.clientEmail && <span className="form-error">{errors.clientEmail}</span>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label required">Téléphone</label>
                                <input
                                    type="tel"
                                    name="clientPhone"
                                    className={`form-input ${errors.clientPhone ? 'error' : ''}`}
                                    value={formData.clientPhone}
                                    onChange={handleInputChange}
                                />
                                {errors.clientPhone && <span className="form-error">{errors.clientPhone}</span>}
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
                                className={`form-select ${errors.locationId ? 'error' : ''}`}
                                value={formData.locationId}
                                onChange={handleInputChange}
                            >
                                <option value="">-- Sélectionnez --</option>
                                {locations.map(location => (
                                    <option key={location.id} value={location.id}>
                                        {location.full_name}
                                    </option>
                                ))}
                            </select>
                            {errors.locationId && <span className="form-error">{errors.locationId}</span>}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label required">Date début</label>
                                <input
                                    type="datetime-local"
                                    name="dateStart"
                                    className={`form-input ${errors.dateRange ? 'error' : ''}`}
                                    value={formData.dateStart}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label required">Date fin</label>
                                <input
                                    type="datetime-local"
                                    name="dateEnd"
                                    className={`form-input ${errors.dateRange ? 'error' : ''}`}
                                    value={formData.dateEnd}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        {errors.dateRange && <span className="form-error">{errors.dateRange}</span>}
                    </div>

                    {/* Services */}
                    <div className="form-section">
                        <h3>🎯 Services</h3>
                        <div className="services-grid">
                            {services.map((service, index) => (
                                <div key={index} className="service-checkbox">
                                    <input
                                        type="checkbox"
                                        id={`edit-service-${index}`}
                                        checked={formData.services.includes(service)}
                                        onChange={() => handleServiceToggle(service)}
                                    />
                                    <label htmlFor={`edit-service-${index}`}>
                                        <div className="checkbox-custom"></div>
                                        <span className="service-name">{service}</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                        {errors.services && <span className="form-error">{errors.services}</span>}
                    </div>

                    {/* Paiement */}
                    <div className="form-section">
                        <h3>💳 Paiement</h3>
                        <div className="form-group">
                            <label className="form-label required">Mode de paiement</label>
                            <select
                                name="paymentMethod"
                                className={`form-select ${errors.paymentMethod ? 'error' : ''}`}
                                value={formData.paymentMethod}
                                onChange={handleInputChange}
                            >
                                <option value="">-- Choisir --</option>
                                {paymentMethods.map((method, index) => (
                                    <option key={index} value={method}>{method}</option>
                                ))}
                            </select>
                            {errors.paymentMethod && <span className="form-error">{errors.paymentMethod}</span>}
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
                        <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
                            Annuler
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
                            {loading ? 'Modification...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditEventModal;