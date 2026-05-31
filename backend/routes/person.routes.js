const { Router } = require('express');
const PersonController = require('../controllers/PersonController');
const authMiddleware = require('../middlewares/auth');
const tenantActive = require('../middlewares/tenantActive');
const { requireRoles } = require('../middlewares/rbac');

const router = Router();


router.use(authMiddleware, tenantActive);


router.post('/', requireRoles('admin', 'manager', 'staff'), PersonController.store);
router.get('/', requireRoles('admin', 'manager', 'staff'), PersonController.index);
router.get('/:id', requireRoles('admin', 'manager', 'staff'), PersonController.show);
router.put('/:id', requireRoles('admin', 'manager'), PersonController.update);
router.delete('/:id', requireRoles('admin'), PersonController.delete);

module.exports = router;
