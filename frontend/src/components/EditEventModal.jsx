import React, { useState, useEffect } from 'react';
import { eventService } from '../services/eventService';
import { X, User, Mail, Phone, Building, MapPin, Calendar, CreditCard, FileText, Save } from 'lucide-react';

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
            await eventService.updateEvent(event.id, formData);
            alert('Événement modifié avec succès !');
            onUpdate();
            onClose();
        } catch (error) {
            console.error('❌ Erreur modification:', error);
            setError('Erreur lors de la modification. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>
                        <FileText size={24} />
                        Modifier l'événement #{event.id}
                    </h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="modal-form">
                    {/* Informations client */}
                    <div className="form-section">
                        <h3>
                            <User size={20} />
                            Informations client
                        </h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label required">
                                    <User size={16} />
                                    Nom complet
                                </label>
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
                                <label className="form-label required">
                                    <Mail size={16} />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="clientEmail"
                                    className="form-input"
                                    value={formData.clientEmail}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label required">
                                    <Phone size={16} />
                                    Téléphone
                                </label>
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
                                <label className="form-label">
                                    <Building size={16} />
                                    Entreprise (optionnel)
                                </label>
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

                    {/* Détails événement */}
                    <div className="form-section">
                        <h3>
                            <Calendar size={20} />
                            Détails de l'événement
                        </h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label required">
                                    <MapPin size={16} />
                                    Lieu
                                </label>
                                <select
                                    name="locationId"
                                    className="form-select"
                                    value={formData.locationId}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">-- Sélectionner un lieu --</option>
                                    {locations.map((location) => (
                                        <option key={location.id} value={location.id}>
                                            {location.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label required">
                                    <Calendar size={16} />
                                    Date de début
                                </label>
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
                                <label className="form-label required">
                                    <Calendar size={16} />
                                    Date de fin
                                </label>
                                <input
                                    type="datetime-local"
                                    name="dateEnd"
                                    className="form-input"
                                    value={formData.dateEnd}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label required">
                                    <CreditCard size={16} />
                                    Mode de paiement
                                </label>
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
                        </div>
                    </div>

                    {/* Services */}
                    <div className="form-section">
                        <h3>Services demandés</h3>
                        <div className="services-grid">
                            {services.map((service, index) => (
                                <label key={index} className="service-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={formData.services.includes(service)}
                                        onChange={() => handleServiceToggle(service)}
                                    />
                                    <span>{service}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="form-section">
                        <h3>
                            <FileText size={20} />
                            Notes
                        </h3>
                        <textarea
                            name="notes"
                            className="form-textarea"
                            value={formData.notes}
                            onChange={handleInputChange}
                            rows="4"
                            placeholder="Notes additionnelles..."
                        />
                    </div>

                    {/* Boutons */}
                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={onClose}
                            disabled={loading}
                        >
                            Annuler
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            <Save size={20} />
                            {loading ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditEventModal;