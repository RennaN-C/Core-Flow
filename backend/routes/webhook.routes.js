const { Router } = require('express');
const WebhookController = require('../controllers/WebhookController');

const router = Router();
router.post('/asaas', WebhookController.asaas);

module.exports = router;
