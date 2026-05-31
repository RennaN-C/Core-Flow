const { Router } = require('express');
const TenantController = require('../controllers/TenantController');
const auth = require('../middlewares/auth');
const tenantActive = require('../middlewares/tenantActive');
const { requireRoles } = require('../middlewares/rbac');

const router = Router();
router.get('/', auth, tenantActive, TenantController.show);
router.put('/', auth, tenantActive, requireRoles('admin'), TenantController.update);

module.exports = router;
