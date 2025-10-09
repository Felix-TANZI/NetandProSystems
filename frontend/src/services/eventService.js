import api from './api';

export const eventService = {
    // Récupérer tous les événements
    getAllEvents: async () => {
        try {
            const response = await api.get('/events');
            return response.data;
        } catch (error) {
            console.error('Erreur getAllEvents:', error);
            throw error;
        }
    },

    // Créer un nouvel événement
    createEvent: async (eventData) => {
        try {
            const response = await api.post('/events', eventData);
            return response.data;
        } catch (error) {
            console.error('Erreur createEvent:', error);
            throw error;
        }
    },

    // Récupérer les lieux hiérarchiques
    getLocations: async () => {
        try {
            const response = await api.get('/locations');
            console.log('Lieux récupérés:', response.data); // Debug
            return response.data;
        } catch (error) {
            console.error('Erreur getLocations:', error);
            throw error;
        }
    },

    

    // Récupérer les événements publics
    getPublicEvents: async () => {
        try {
            const response = await api.get('/events/public');
            return response.data;
        } catch (error) {
            console.error('Erreur getPublicEvents:', error);
            throw error;
        }
    },
    
    // Mettre à jour un événement
    updateEvent: async (eventId, eventData) => {
    try {
        const response = await api.put(`/events/${eventId}`, eventData);
        return response.data;
    } catch (error) {
        console.error('Erreur updateEvent:', error);
        throw error;
    }
    },

// Mettre à jour le statut
    updateStatus: async (eventId, status) => {
    try {
        const response = await api.patch(`/events/${eventId}/status`, { status });
        return response.data;
    } catch (error) {
        console.error('Erreur updateStatus:', error);
        throw error;
    }
    },

// Supprimer un événement
deleteEvent: async (eventId) => {
    try {
        const response = await api.delete(`/events/${eventId}`);
        return response.data;
    } catch (error) {
        console.error('Erreur deleteEvent:', error);
        throw error;
    }
}

};