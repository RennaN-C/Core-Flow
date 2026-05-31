const { Router } = require('express');
const BusinessProfileController = require('../controllers/BusinessProfileController');

const router = Router();
router.get('/', BusinessProfileController.index);

module.exports = router;
