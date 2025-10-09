import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { validateStep1, validateStep2, validateStep3, validateStep4 } from '../utils/validation';
import '../styles/planifier.css';

function Planifier() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [locations, setLocations] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        companyName: '',
        locationId: '',
        dateStart: '',
        dateEnd: '',
        services: [],
        paymentMethod: '',
        notes: '',
        conditionsAccepted: false
    });

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
        'Orange Money',
        'MTN Mobile Money',
        'Chèque'
    ];

    // Charger les lieux
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const data = await eventService.getLocations();
                setLocations(data);
            } catch (error) {
                console.error('Erreur chargement lieux:', error);
            }
        };
        fetchLocations();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
        // Effacer l'erreur du champ modifié
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

    const validateCurrentStep = () => {
        let stepErrors = {};
        
        switch (currentStep) {
            case 1:
                stepErrors = validateStep1(formData);
                break;
            case 2:
                stepErrors = validateStep2(formData);
                break;
            case 3:
                stepErrors = validateStep3(formData);
                break;
            case 4:
                stepErrors = validateStep4(formData);
                break;
            default:
                break;
        }
        
        setErrors(stepErrors);
        return Object.keys(stepErrors).length === 0;
    };

    const handleNext = () => {
        if (validateCurrentStep()) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrev = () => {
        setCurrentStep(currentStep - 1);
        setErrors({});
    };

    const handleSubmit = async () => {
        if (!validateCurrentStep()) return;

        setIsSubmitting(true);
        try {
            await eventService.createEvent(formData);
            setSubmitted(true);
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (error) {
            console.error('Erreur soumission:', error);
            alert('Erreur lors de la soumission. Veuillez réessayer.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getLocationName = (id) => {
        const location = locations.find(loc => loc.id === parseInt(id));
        return location ? location.full_name : '';
    };

    const progressPercentage = (currentStep / 4) * 100;

    if (submitted) {
        return (
            <div className="planifier-page">
                <div className="planifier-container">
                    <div className="form-card">
                        <div className="success-message">
                            <div className="success-icon">✅</div>
                            <h2>Événement soumis avec succès !</h2>
                            <p>Nous avons bien reçu votre demande de planification.</p>
                            <p>Un email de confirmation vous a été envoyé à <strong>{formData.clientEmail}</strong></p>
                            <p style={{ color: 'var(--gray)' }}>Redirection vers l'accueil...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="planifier-page">
            <div className="planifier-container">
                <div className="planifier-header">
                    <h1>Planifier un événement</h1>
                    <p>Remplissez le formulaire en 4 étapes simples</p>
                </div>

                {/* Barre de progression */}
                <div className="progress-bar">
                    <div className="progress-line" style={{ width: `${progressPercentage}%` }}></div>
                    
                    <div className={`progress-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                        <div className="progress-circle">1</div>
                        <span className="progress-label">Informations</span>
                    </div>
                    
                    <div className={`progress-step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                        <div className="progress-circle">2</div>
                        <span className="progress-label">Lieu & Date</span>
                    </div>
                    
                    <div className={`progress-step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
                        <div className="progress-circle">3</div>
                        <span className="progress-label">Services</span>
                    </div>
                    
                    <div className={`progress-step ${currentStep >= 4 ? 'active' : ''} ${currentStep > 4 ? 'completed' : ''}`}>
                        <div className="progress-circle">4</div>
                        <span className="progress-label">Confirmation</span>
                    </div>
                </div>

                {/* Formulaire */}
                <div className="form-card">
                    {/* ÉTAPE 1: Informations client */}
                    {currentStep === 1 && (
                        <div className="form-section">
                            <h3>📋 Vos informations</h3>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label required">Nom complet</label>
                                    <input
                                        type="text"
                                        name="clientName"
                                        className={`form-input ${errors.clientName ? 'error' : ''}`}
                                        value={formData.clientName}
                                        onChange={handleInputChange}
                                        placeholder="Ex: Felix TANZI"
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
                                        placeholder="exemple@email.com"
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
                                        placeholder="+237 6XX XXX XXX"
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
                                        placeholder="Nom de l'entreprise"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ÉTAPE 2: Lieu et dates */}
                    {currentStep === 2 && (
                        <div className="form-section">
                            <h3>📍 Lieu et période</h3>
                            
                            <div className="form-group">
                                <label className="form-label required">Lieu de l'événement</label>
                                <select
                                    name="locationId"
                                    className={`form-select ${errors.locationId ? 'error' : ''}`}
                                    value={formData.locationId}
                                    onChange={handleInputChange}
                                >
                                    <option value="">-- Sélectionnez un lieu --</option>
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
                                    <label className="form-label required">Date et heure de début</label>
                                    <input
                                        type="datetime-local"
                                        name="dateStart"
                                        className={`form-input ${errors.dateRange ? 'error' : ''}`}
                                        value={formData.dateStart}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label required">Date et heure de fin</label>
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
                    )}

                    {/* ÉTAPE 3: Services et paiement */}
                    {currentStep === 3 && (
                        <div className="form-section">
                            <h3>🎯 Services souhaités</h3>
                            
                            <div className="services-grid">
                                {services.map((service, index) => (
                                    <div key={index} className="service-checkbox">
                                        <input
                                            type="checkbox"
                                            id={`service-${index}`}
                                            checked={formData.services.includes(service)}
                                            onChange={() => handleServiceToggle(service)}
                                        />
                                        <label htmlFor={`service-${index}`}>
                                            <div className="checkbox-custom"></div>
                                            <span className="service-name">{service}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                            {errors.services && <span className="form-error">{errors.services}</span>}

                            <div className="form-group" style={{ marginTop: '2rem' }}>
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
                                <label className="form-label">Notes additionnelles (optionnel)</label>
                                <textarea
                                    name="notes"
                                    className="form-textarea"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    placeholder="Informations supplémentaires..."
                                />
                            </div>
                        </div>
                    )}

                    {/* ÉTAPE 4: Récapitulatif et confirmation */}
                    {currentStep === 4 && (
                        <div className="form-section">
                            <h3>✅ Récapitulatif</h3>
                            
                            <div className="summary-section">
                                <div className="summary-item">
                                    <span className="summary-label">Nom</span>
                                    <span className="summary-value">{formData.clientName}</span>
                                </div>
                                <div className="summary-item">
                                    <span className="summary-label">Email</span>
                                    <span className="summary-value">{formData.clientEmail}</span>
                                </div>
                                <div className="summary-item">
                                    <span className="summary-label">Téléphone</span>
                                    <span className="summary-value">{formData.clientPhone}</span>
                                </div>
                                {formData.companyName && (
                                    <div className="summary-item">
                                        <span className="summary-label">Entreprise</span>
                                        <span className="summary-value">{formData.companyName}</span>
                                    </div>
                                )}
                                <div className="summary-item">
                                    <span className="summary-label">Lieu</span>
                                    <span className="summary-value">{getLocationName(formData.locationId)}</span>
                                </div>
                                <div className="summary-item">
                                    <span className="summary-label">Date de début</span>
                                    <span className="summary-value">
                                        {new Date(formData.dateStart).toLocaleString('fr-FR')}
                                    </span>
                                </div>
                                <div className="summary-item">
                                    <span className="summary-label">Date de fin</span>
                                    <span className="summary-value">
                                        {new Date(formData.dateEnd).toLocaleString('fr-FR')}
                                    </span>
                                </div>
                                <div className="summary-item">
                                    <span className="summary-label">Services</span>
                                    <span className="summary-value">{formData.services.length} sélectionné(s)</span>
                                </div>
                                <div className="summary-item">
                                    <span className="summary-label">Paiement</span>
                                    <span className="summary-value">{formData.paymentMethod}</span>
                                </div>
                            </div>

                            <div className="conditions-box">
                                <h4>Conditions générales</h4>
                                <ul>
                                    <li>Le paiement d'un acompte de 30% est requis pour confirmer la réservation</li>
                                    <li>Annulation gratuite jusqu'à 7 jours avant l'événement</li>
                                    <li>Les tarifs sont sujets à modification selon les services demandés</li>
                                    <li>Un devis détaillé vous sera envoyé après validation de votre demande</li>
                                    <li>NetandProSystems se réserve le droit de refuser une réservation</li>
                                </ul>
                            </div>

                            <label className="checkbox-accept">
                                <input
                                    type="checkbox"
                                    name="conditionsAccepted"
                                    checked={formData.conditionsAccepted}
                                    onChange={handleInputChange}
                                />
                                <span>J'accepte les conditions générales de réservation</span>
                            </label>
                            {errors.conditions && <span className="form-error">{errors.conditions}</span>}
                        </div>
                    )}

                    {/* Boutons de navigation */}
                    <div className="form-navigation">
                        {currentStep > 1 && (
                            <button className="btn-nav btn-prev" onClick={handlePrev}>
                                ← Précédent
                            </button>
                        )}
                        
                        {currentStep < 4 ? (
                            <button className="btn-nav btn-next" onClick={handleNext} style={{ marginLeft: 'auto' }}>
                                Suivant →
                            </button>
                        ) : (
                            <button
                                className="btn-nav btn-submit"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                style={{ marginLeft: 'auto' }}
                            >
                                {isSubmitting ? 'Envoi en cours...' : 'Confirmer la réservation'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Planifier;