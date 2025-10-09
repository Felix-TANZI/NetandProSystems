import api from './api';

export const testimonialService = {
    // Créer un témoignage
    create: async (testimonialData) => {
        const response = await api.post('/testimonials', testimonialData);
        return response.data;
    },

    // Récupérer les témoignages récents
    getRecent: async () => {
        const response = await api.get('/testimonials/recent');
        return response.data;
    }
};