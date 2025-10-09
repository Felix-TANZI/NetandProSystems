const rateLimit = require('express-rate-limit');

// Limiteur pour les tentatives de connexion (10 essais par 15 minutes)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 tentatives max
    message: { 
        success: false, 
        message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.' 
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { loginLimiter };