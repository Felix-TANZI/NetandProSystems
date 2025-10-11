// Fonctions de validation pour le formulaire

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const validatePhone = (phone) => {
    const regex = /^[\d\s\+\-\(\)]+$/;
    return phone.length >= 8 && regex.test(phone);
};

export const validateRequired = (value) => {
    return value && value.toString().trim().length > 0;
};

export const validateDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    
    // Date de début ne peut pas être dans le passé
    if (start < now.setHours(0, 0, 0, 0)) {
        return { valid: false, message: "La date de début ne peut pas être dans le passé" };
    }
    
    // Date de fin doit être après date de début
    if (end < start) {
        return { valid: false, message: "La date de fin doit être après la date de début" };
    }
    
    return { valid: true, message: "" };
};

// Validation Étape 1 : Informations client
export const validateStep1 = (formData) => {
    const errors = {};
    
    if (!validateRequired(formData.clientName)) {
        errors.clientName = "Le nom est requis";
    }
    
    if (!validateRequired(formData.adresse)) {
        errors.adresse = "L'adresse est requise";
    }
    
    if (!validateEmail(formData.clientEmail)) {
        errors.clientEmail = "Email invalide";
    }
    
    if (!validatePhone(formData.clientPhone)) {
        errors.clientPhone = "Numéro de téléphone invalide";
    }
    
    return errors;
};

// Validation Étape 2 : Détails événement
export const validateStep2 = (formData) => {
    const errors = {};
    
    if (!validateRequired(formData.locationId)) {
        errors.locationId = "Veuillez sélectionner un lieu";
    }
    
    if (!validateRequired(formData.dateStart) || !validateRequired(formData.dateEnd)) {
        errors.dateRange = "Les dates de début et de fin sont requises";
    } else {
        const dateValidation = validateDateRange(formData.dateStart, formData.dateEnd);
        if (!dateValidation.valid) {
            errors.dateRange = dateValidation.message;
        }
    }
    
    if (!validateRequired(formData.numberOfPeople) || formData.numberOfPeople < 1) {
        errors.numberOfPeople = "Le nombre de personnes est requis (minimum 1)";
    }
    
    if (!validateRequired(formData.numberOfDays) || formData.numberOfDays < 1) {
        errors.numberOfDays = "Le nombre de jours est requis (minimum 1)";
    }
    
    return errors;
};

// Validation Étape 3 : Services audio/vidéo 
export const validateStep3 = (formData) => {
    const errors = {};
    
    const hasAnyServiceAV = 
        formData.serviceTraductionSimultanee ||
        formData.serviceSonorisation ||
        formData.serviceConferenceHybride ||
        formData.serviceEcranGeant ||
        formData.serviceMicrophoneTable ||
        formData.serviceMoniteurControle ||
        formData.serviceCamerasTracking ||
        formData.serviceZoomIntegre ||
        formData.serviceZoomDistance ||
        formData.serviceCompteZoom;
    
    // Pour forcer au moins un service
    // if (!hasAnyServiceAV) {
    //     errors.servicesAV = "Veuillez sélectionner au moins un service audio/vidéo";
    // }
    
    return errors;
};

// Validation Étape 4 : Services interprétation & bureautique
export const validateStep4 = (formData) => {
    const errors = {};
    
    // Si interprètes sélectionné, nombre de langues obligatoire
    if (formData.serviceInterpretes && !validateRequired(formData.nombreLangues)) {
        errors.nombreLangues = "Veuillez indiquer le nombre de langues";
    }
    
    return errors;
};

// Validation Étape 5 : Paiement et confirmation
export const validateStep5 = (formData) => {
    const errors = {};
    
    if (!validateRequired(formData.conditionsPaiement)) {
        errors.conditionsPaiement = "Veuillez choisir les conditions de paiement";
    }
    
    if (!validateRequired(formData.paymentMethod)) {
        errors.paymentMethod = "Veuillez choisir un mode de paiement";
    }
    
    if (!formData.conditionsAccepted) {
        errors.conditions = "Vous devez accepter les conditions générales";
    }
    
    return errors;
};