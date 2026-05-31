const { Router } = require('express');
const InsightsController = require('../controllers/InsightsController');
const auth = require('../middlewares/auth');
const tenantActive = require('../middlewares/tenantActive');
const { requireRoles } = require('../middlewares/rbac');

const router = Router();
router.get('/', auth, tenantActive, requireRoles('admin', 'manager'), InsightsController.index);

module.exports = router;
