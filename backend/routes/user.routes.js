const { Router } = require('express');
const UserController = require('../controllers/UserController');
const auth = require('../middlewares/auth');
const tenantActive = require('../middlewares/tenantActive');
const { requireRoles } = require('../middlewares/rbac');

const router = Router();
router.use(auth, tenantActive, requireRoles('admin'));
router.get('/', UserController.index);
router.post('/', UserController.create);
router.put('/:id/role', UserController.updateRole);
router.delete('/:id', UserController.delete);

module.exports = router;
