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

export const validateStep1 = (formData) => {
    const errors = {};
    
    if (!validateRequired(formData.clientName)) {
        errors.clientName = "Le nom est requis";
    }
    
    if (!validateEmail(formData.clientEmail)) {
        errors.clientEmail = "Email invalide";
    }
    
    if (!validatePhone(formData.clientPhone)) {
        errors.clientPhone = "Numéro de téléphone invalide";
    }
    
    return errors;
};

export const validateStep2 = (formData) => {
    const errors = {};
    
    if (!validateRequired(formData.locationId)) {
        errors.locationId = "Veuillez sélectionner un lieu";
    }
    
    const dateValidation = validateDateRange(formData.dateStart, formData.dateEnd);
    if (!dateValidation.valid) {
        errors.dateRange = dateValidation.message;
    }
    
    return errors;
};

export const validateStep3 = (formData) => {
    const errors = {};
    
    if (!formData.services || formData.services.length === 0) {
        errors.services = "Veuillez sélectionner au moins un service";
    }
    
    if (!validateRequired(formData.paymentMethod)) {
        errors.paymentMethod = "Veuillez choisir un mode de paiement";
    }
    
    return errors;
};

export const validateStep4 = (formData) => {
    const errors = {};
    
    if (!formData.conditionsAccepted) {
        errors.conditions = "Vous devez accepter les conditions générales";
    }
    
    return errors;
};