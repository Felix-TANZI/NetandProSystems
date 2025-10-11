import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { validateStep1, validateStep2, validateStep3, validateStep4, validateStep5 } from '../utils/validation';
import '../styles/planifier.css';

function Planifier() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [locations, setLocations] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        // Étape 1 : Informations client
        nui: '',
        clientName: '',
        raisonSociale: '',
        adresse: '',
        clientPhone: '',
        clientEmail: '',
        companyName: '',
        contactPerson: '',
        contactPhone: '',
        
        // Étape 2 : Détails événement
        locationId: '',
        dateStart: '',
        dateEnd: '',
        numberOfPeople: '',
        numberOfDays: '',
        
        // Étape 3 : Services audio/vidéo/conférence
        serviceTraductionSimultanee: false,
        serviceSonorisation: false,
        serviceConferenceHybride: false,
        serviceEcranGeant: false,
        serviceMicrophoneTable: false,
        serviceMoniteurControle: false,
        serviceCamerasTracking: false,
        serviceZoomIntegre: false,
        serviceZoomDistance: false,
        serviceCompteZoom: false,
        
        // Étape 4 : Services interprétation & bureautique
        serviceInterpretes: false,
        nombreLangues: '',
        serviceCabineTraduction: false,
        serviceInterpretationEscorte: false,
        serviceCopieursColor: false,
        serviceCopieursNB: false,
        serviceImprimantes: false,
        serviceOrdinateur: false,
        serviceSecretariat: false,
        serviceGestionComplete: false,
        serviceAssistance: false,
        
        // Étape 5 : Paiement
        conditionsPaiement: '',
        paymentMethod: '',
        notes: '',
        conditionsAccepted: false
    });

    const conditionsPaiementOptions = [
        '50% à la commande, 50% avant l\'événement',
        '70% à la commande, 30% avant l\'événement'
    ];

    const paymentMethods = [
        'Chèque',
        'Espèces',
        'MTN Mobile Money',
        'Orange Money',
        'Virement bancaire'
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
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
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
            case 5:
                stepErrors = validateStep5(formData);
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
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrev = () => {
        setCurrentStep(currentStep - 1);
        setErrors({});
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async () => {
        if (!validateCurrentStep()) return;

        setIsSubmitting(true);
        try {
            // Préparer les données pour l'API
            const servicesArray = [];
            
            // Services audio/vidéo
            if (formData.serviceTraductionSimultanee) servicesArray.push('Traduction simultanée');
            if (formData.serviceSonorisation) servicesArray.push('Sonorisation');
            if (formData.serviceConferenceHybride) servicesArray.push('Conférence Hybride');
            if (formData.serviceEcranGeant) servicesArray.push('Écran géant');
            if (formData.serviceMicrophoneTable) servicesArray.push('Microphone de table');
            if (formData.serviceMoniteurControle) servicesArray.push('Moniteur de contrôle');
            if (formData.serviceCamerasTracking) servicesArray.push('Caméras Tracking');
            if (formData.serviceZoomIntegre) servicesArray.push('Zoom intégré');
            if (formData.serviceZoomDistance) servicesArray.push('Zoom à distance');
            if (formData.serviceCompteZoom) servicesArray.push('Compte Zoom/Teams/Gmeeting');
            
            // Services interprétation
            if (formData.serviceInterpretes) servicesArray.push(`Interprètes (${formData.nombreLangues} langues)`);
            if (formData.serviceCabineTraduction) servicesArray.push('Cabine de traduction');
            if (formData.serviceInterpretationEscorte) servicesArray.push('Interprétation escorte mobile');
            
            // Services bureautique
            if (formData.serviceCopieursColor) servicesArray.push('Copieurs couleur');
            if (formData.serviceCopieursNB) servicesArray.push('Copieur N/B');
            if (formData.serviceImprimantes) servicesArray.push('Imprimantes');
            if (formData.serviceOrdinateur) servicesArray.push('Ordinateur');
            if (formData.serviceSecretariat) servicesArray.push('Secrétariat complet');
            if (formData.serviceGestionComplete) servicesArray.push('Gestion complète de l\'événement');
            if (formData.serviceAssistance) servicesArray.push('Assistance');

            const eventData = {
                clientName: formData.clientName,
                clientEmail: formData.clientEmail,
                clientPhone: formData.clientPhone,
                companyName: formData.companyName || formData.raisonSociale,
                locationId: formData.locationId,
                dateStart: formData.dateStart,
                dateEnd: formData.dateEnd,
                services: servicesArray,
                paymentMethod: formData.paymentMethod,
                notes: `NUI: ${formData.nui}\nAdresse: ${formData.adresse}\nPersonne à contacter: ${formData.contactPerson}\nTél. contact: ${formData.contactPhone}\nNombre de personnes: ${formData.numberOfPeople}\nNombre de jours: ${formData.numberOfDays}\nConditions de paiement: ${formData.conditionsPaiement}\n\nNotes: ${formData.notes}`,
                conditionsAccepted: formData.conditionsAccepted
            };

            await eventService.createEvent(eventData);
            setSubmitted(true);
            setTimeout(() => {
                navigate('/');
            }, 4000);
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

    const progressPercentage = (currentStep / 5) * 100;

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
                    <p>Remplissez le formulaire en 5 étapes simples</p>
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
                        <span className="progress-label">Événement</span>
                    </div>
                    
                    <div className={`progress-step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
                        <div className="progress-circle">3</div>
                        <span className="progress-label">Services A/V</span>
                    </div>
                    
                    <div className={`progress-step ${currentStep >= 4 ? 'active' : ''} ${currentStep > 4 ? 'completed' : ''}`}>
                        <div className="progress-circle">4</div>
                        <span className="progress-label">Services +</span>
                    </div>

                    <div className={`progress-step ${currentStep >= 5 ? 'active' : ''}`}>
                        <div className="progress-circle">5</div>
                        <span className="progress-label">Confirmation</span>
                    </div>
                </div>

                {/* Formulaire */}
                <div className="form-card">
                    {/* ÉTAPE 1: Informations client */}
                    {currentStep === 1 && (
                        <div className="form-section">
                            <h3>📋 Informations du client</h3>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">NUI (optionnel)</label>
                                    <input
                                        type="text"
                                        name="nui"
                                        className="form-input"
                                        value={formData.nui}
                                        onChange={handleInputChange}
                                        placeholder="Numéro d'Identification Unique"
                                    />
                                </div>

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
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Raison Sociale (optionnel)</label>
                                    <input
                                        type="text"
                                        name="raisonSociale"
                                        className="form-input"
                                        value={formData.raisonSociale}
                                        onChange={handleInputChange}
                                        placeholder="Nom de l'entreprise"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label required">Adresse</label>
                                    <input
                                        type="text"
                                        name="adresse"
                                        className={`form-input ${errors.adresse ? 'error' : ''}`}
                                        value={formData.adresse}
                                        onChange={handleInputChange}
                                        placeholder="Adresse complète"
                                    />
                                    {errors.adresse && <span className="form-error">{errors.adresse}</span>}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label required">Numéro de téléphone</label>
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
                                    <label className="form-label">Nom de la personne à contacter (optionnel)</label>
                                    <input
                                        type="text"
                                        name="contactPerson"
                                        className="form-input"
                                        value={formData.contactPerson}
                                        onChange={handleInputChange}
                                        placeholder="Personne de contact"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Numéro de téléphone de contact (optionnel)</label>
                                    <input
                                        type="tel"
                                        name="contactPhone"
                                        className="form-input"
                                        value={formData.contactPhone}
                                        onChange={handleInputChange}
                                        placeholder="+237 6XX XXX XXX"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ÉTAPE 2: Détails événement */}
                    {currentStep === 2 && (
                        <div className="form-section">
                            <h3>📍 Détails de l'événement</h3>
                            
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

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label required">Nombre de personnes</label>
                                    <input
                                        type="number"
                                        name="numberOfPeople"
                                        className={`form-input ${errors.numberOfPeople ? 'error' : ''}`}
                                        value={formData.numberOfPeople}
                                        onChange={handleInputChange}
                                        placeholder="Ex: 50"
                                        min="1"
                                    />
                                    {errors.numberOfPeople && <span className="form-error">{errors.numberOfPeople}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label required">Nombre de jours</label>
                                    <input
                                        type="number"
                                        name="numberOfDays"
                                        className={`form-input ${errors.numberOfDays ? 'error' : ''}`}
                                        value={formData.numberOfDays}
                                        onChange={handleInputChange}
                                        placeholder="Ex: 1"
                                        min="1"
                                    />
                                    {errors.numberOfDays && <span className="form-error">{errors.numberOfDays}</span>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ÉTAPE 3: Services audio/vidéo/conférence */}
                    {currentStep === 3 && (
                        <div className="form-section">
                            <h3>🎤 Services audio/vidéo/conférence</h3>
                            <p style={{ color: 'var(--gray)', marginBottom: '2rem' }}>
                                Sélectionnez les services techniques dont vous avez besoin
                            </p>
                            
                            <div className="services-grid">
                                <div className="service-checkbox">
                                    <input
                                        type="checkbox"
                                        id="serviceTraductionSimultanee"
                                        name="serviceTraductionSimultanee"
                                        checked={formData.serviceTraductionSimultanee}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="serviceTraductionSimultanee">
                                        <div className="checkbox-custom"></div>
                                        <span className="service-name">Système de traduction simultanée</span>
                                    </label>
                                </div>

                                <div className="service-checkbox">
                                    <input
                                        type="checkbox"
                                        id="serviceSonorisation"
                                        name="serviceSonorisation"
                                        checked={formData.serviceSonorisation}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="serviceSonorisation">
                                        <div className="checkbox-custom"></div>
                                        <span className="service-name">Système de Sonorisation</span>
                                    </label>
                                </div>

                                <div className="service-checkbox">
                                    <input
                                        type="checkbox"
                                        id="serviceConferenceHybride"
                                        name="serviceConferenceHybride"
                                        checked={formData.serviceConferenceHybride}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="serviceConferenceHybride">
                                        <div className="checkbox-custom"></div>
                                        <span className="service-name">Système de conférence Hybride</span>
                                    </label>
                                </div>

                                <div className="service-checkbox">
                                    <input
                                        type="checkbox"
                                        id="serviceEcranGeant"
                                        name="serviceEcranGeant"
                                        checked={formData.serviceEcranGeant}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="serviceEcranGeant">
                                        <div className="checkbox-custom"></div>
                                        <span className="service-name">Écran géant</span>
                                    </label>
                                </div>

                                <div className="service-checkbox">
                                    <input
                                        type="checkbox"
                                        id="serviceMicrophoneTable"
                                        name="serviceMicrophoneTable"
                                        checked={formData.serviceMicrophoneTable}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="serviceMicrophoneTable">
                                        <div className="checkbox-custom"></div>
                                        <span className="service-name">Microphone de table col de cygne</span>
                                    </label>
                                </div>

                                <div className="service-checkbox">
                                    <input
                                        type="checkbox"
                                        id="serviceMoniteurControle"
                                        name="serviceMoniteurControle"
                                        checked={formData.serviceMoniteurControle}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="serviceMoniteurControle">
                                        <div className="checkbox-custom"></div>
                                        <span className="service-name">Moniteur de contrôle retour</span>
                                    </label>
                                </div>

                                <div className="service-checkbox">
                                    <input
                                        type="checkbox"
                                        id="serviceCamerasTracking"
                                        name="serviceCamerasTracking"
                                        checked={formData.serviceCamerasTracking}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="serviceCamerasTracking">
                                        <div className="checkbox-custom"></div>
                                        <span className="service-name">Caméras de conférence Tracking</span>
                                    </label>
                                </div>

                                <div className="service-checkbox">
                                    <input
                                        type="checkbox"
                                        id="serviceZoomIntegre"
                                        name="serviceZoomIntegre"
                                        checked={formData.serviceZoomIntegre}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="serviceZoomIntegre">
                                        <div className="checkbox-custom"></div>
                                        <span className="service-name">Zoom intégré</span>
                                    </label>
                                </div>

                                <div className="service-checkbox">
                                    <input
                                        type="checkbox"
                                        id="serviceZoomDistance"
                                        name="serviceZoomDistance"
                                        checked={formData.serviceZoomDistance}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="serviceZoomDistance">
                                        <div className="checkbox-custom"></div>
                                        <span className="service-name">Zoom à distance</span>
                                    </label>
                                </div>

                                <div className="service-checkbox">
                                    <input
                                        type="checkbox"
                                        id="serviceCompteZoom"
                                        name="serviceCompteZoom"
                                        checked={formData.serviceCompteZoom}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="serviceCompteZoom">
                                        <div className="checkbox-custom"></div>
                                        <span className="service-name">Compte Zoom/Teams/Gmeeting</span>
                                    </label>
                                </div>
                            </div>
                            {errors.servicesAV && <span className="form-error">{errors.servicesAV}</span>}
                        </div>
                    )}

                    {/* ÉTAPE 4: Services interprétation & bureautique */}
                    {currentStep === 4 && (
                        <div className="form-section">
                            <h3>🌐 Services interprétation & bureautique</h3>
                            <p style={{ color: 'var(--gray)', marginBottom: '2rem' }}>
                                Services complémentaires pour votre événement
                            </p>
                            
                            <div className="services-grid">
                                <div className="service-checkbox">
                                    <input
                                        type="checkbox"
                                        id="serviceInterpretes"
                                        name="serviceInterpretes"
                                        checked={formData.serviceInterpretes}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="serviceInterpretes">
                                        <div className="checkbox-custom"></div>
                                        <span className="service-name">Interprètes</span>
                                    </label>
                                </div>

                                <div className="service-checkbox">
                                    <input
                                        type="checkbox"
                                        id="serviceCabineTraduction"
                                        name="serviceCabineTraduction"
                                        checked={formData.serviceCabineTraduction}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="serviceCabineTraduction">
                                        <div className="checkbox-custom"></div>
                                        <span className="service-name">Cabine de traduction</span>
                                    </label>
                                </div>

                                <div className="service-checkbox">
                                    <input
                                        type="checkbox"
                                        id="serviceInterpretationEscorte"
                                        name="serviceInterpretationEscorte"
                                        checked={formData.serviceInterpretationEscorte}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="serviceInterpretationEscorte">
                                        <div className="checkbox-custom"></div>
                                        <span className="service-name">Interprétation escorte mobile</span>
                                    </label>
                                </div>

                                <div className="service-checkbox">
                                    <input
                                        type="checkbox"
                                        id="serviceCopieursColor"
                                        name="serviceCopieursColor"
                                        checked={formData.serviceCopieursColor}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="serviceCopieursColor">
                                        <div className="checkbox-custom"></div>
                                        <span className="service-name">Copieurs couleur</span>
                                    </label>
                                </div>

                                <div className="service-checkbox">
                                    <input
                                        type="checkbox"
                                        id="serviceCopieursNB"
                                        name="serviceCopieursNB"
                                        checked={formData.serviceCopieursNB}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="serviceCopieursNB">
                                        <div className="checkbox-custom"></div>
                                        <span className="service-name">Copieur N/B</span>
                                    </label>
                                </div>

                                <div className="service-checkbox">
                                    <input
                                        type="checkbox"
                                        id="serviceImprimantes"
                                        name="serviceImprimantes"
                                        checked={formData.serviceImprimantes}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="serviceImprimantes">
                                        <div className="checkbox-custom"></div>
                                        <span className="service-name">Imprimantes</span>
                                    </label>
                                </div>

                                <div className="service-checkbox">
                                    <input
                                        type="checkbox"
                                        id="serviceOrdinateur"
                                        name="serviceOrdinateur"
                                        checked={formData.serviceOrdinateur}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="serviceOrdinateur">
                                        <div className="checkbox-custom"></div>
                                        <span className="service-name">Ordinateur</span>
                                    </label>
                                </div>

                                <div className="service-checkbox">
                                    <input
                                        type="checkbox"
                                        id="serviceSecretariat"
                                        name="serviceSecretariat"
                                        checked={formData.serviceSecretariat}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="serviceSecretariat">
                                        <div className="checkbox-custom"></div>
                                        <span className="service-name">Secrétariat complet</span>
                                    </label>
                                </div>

                                <div className="service-checkbox">
                                    <input
                                        type="checkbox"
                                        id="serviceGestionComplete"
                                        name="serviceGestionComplete"
                                        checked={formData.serviceGestionComplete}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="serviceGestionComplete">
                                        <div className="checkbox-custom"></div>
                                        <span className="service-name">Gestion complète de l'événement</span>
                                    </label>
                                </div>

                                <div className="service-checkbox">
                                    <input
                                        type="checkbox"
                                        id="serviceAssistance"
                                        name="serviceAssistance"
                                        checked={formData.serviceAssistance}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="serviceAssistance">
                                        <div className="checkbox-custom"></div>
                                        <span className="service-name">Assistance</span>
                                    </label>
                                </div>
                            </div>

                            {/* Champ conditionnel pour nombre de langues */}
                            {formData.serviceInterpretes && (
                                <div className="form-group" style={{ marginTop: '2rem' }}>
                                    <label className="form-label required">Nombre de langues</label>
                                    <input
                                        type="number"
                                        name="nombreLangues"
                                        className={`form-input ${errors.nombreLangues ? 'error' : ''}`}
                                        value={formData.nombreLangues}
                                        onChange={handleInputChange}
                                        placeholder="Ex: 2"
                                        min="1"
                                    />
                                    {errors.nombreLangues && <span className="form-error">{errors.nombreLangues}</span>}
                                </div>
                            )}

                            {errors.servicesPlus && <span className="form-error">{errors.servicesPlus}</span>}
                        </div>
                    )}

                    {/* ÉTAPE 5: Paiement et confirmation */}
                    {currentStep === 5 && (
                        <div className="form-section">
                            <h3>✅ Paiement & Confirmation</h3>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label required">Conditions de paiement</label>
                                    <select
                                        name="conditionsPaiement"
                                        className={`form-select ${errors.conditionsPaiement ? 'error' : ''}`}
                                        value={formData.conditionsPaiement}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">-- Sélectionnez --</option>
                                        {conditionsPaiementOptions.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                        ))}
                                    </select>
                                    {errors.conditionsPaiement && <span className="form-error">{errors.conditionsPaiement}</span>}
                                </div>

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
                            </div>

                            <div className="form-group">
                                <label className="form-label">Notes additionnelles (optionnel)</label>
                                <textarea
                                    name="notes"
                                    className="form-textarea"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    placeholder="Informations supplémentaires..."
                                    rows="4"
                                />
                            </div>

                            {/* Récapitulatif */}
                            <div className="summary-section">
                                <h4 style={{ marginBottom: '1.5rem', color: 'var(--dark)' }}>📋 Récapitulatif de votre demande</h4>
                                
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
                                <div className="summary-item">
                                    <span className="summary-label">Lieu</span>
                                    <span className="summary-value">{getLocationName(formData.locationId)}</span>
                                </div>
                                <div className="summary-item">
                                    <span className="summary-label">Date de début</span>
                                    <span className="summary-value">
                                        {formData.dateStart ? new Date(formData.dateStart).toLocaleString('fr-FR') : '-'}
                                    </span>
                                </div>
                                <div className="summary-item">
                                    <span className="summary-label">Date de fin</span>
                                    <span className="summary-value">
                                        {formData.dateEnd ? new Date(formData.dateEnd).toLocaleString('fr-FR') : '-'}
                                    </span>
                                </div>
                                <div className="summary-item">
                                    <span className="summary-label">Nombre de personnes</span>
                                    <span className="summary-value">{formData.numberOfPeople || '-'}</span>
                                </div>
                                <div className="summary-item">
                                    <span className="summary-label">Nombre de jours</span>
                                    <span className="summary-value">{formData.numberOfDays || '-'}</span>
                                </div>
                                <div className="summary-item">
                                    <span className="summary-label">Conditions de paiement</span>
                                    <span className="summary-value">{formData.conditionsPaiement || '-'}</span>
                                </div>
                                <div className="summary-item">
                                    <span className="summary-label">Mode de paiement</span>
                                    <span className="summary-value">{formData.paymentMethod || '-'}</span>
                                </div>
                            </div>

                            {/* Conditions générales */}
                            <div className="conditions-box">
                                <h4>Conditions générales</h4>
                                <ul>
                                    <li>Le paiement selon les conditions sélectionnées est requis pour confirmer la réservation</li>
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

                    {/* Boutons navigation */}
                    <div className="form-navigation">
                        {currentStep > 1 && (
                            <button className="btn-nav btn-prev" onClick={handlePrev}>
                                ← Précédent
                            </button>
                        )}
                        
                        {currentStep < 5 ? (
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