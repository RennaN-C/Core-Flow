const { Router } = require('express');
const AuditController = require('../controllers/AuditController');
const auth = require('../middlewares/auth');
const tenantActive = require('../middlewares/tenantActive');
const { requireRoles } = require('../middlewares/rbac');

const router = Router();
router.get('/', auth, tenantActive, requireRoles('admin'), AuditController.index);

module.exports = router;
