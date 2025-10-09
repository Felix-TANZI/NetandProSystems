const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Routes publiques
router.get('/public', eventController.getPublicEvents);
router.post('/', eventController.createEvent);

// Routes admin (à sécuriser avec authMiddleware plus tard)
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.put('/:id', eventController.updateEvent);         
router.patch('/:id/status', eventController.updateEventStatus);
router.delete('/:id', eventController.deleteEvent);

module.exports = router;