const { Router } = require('express');
const FinanceController = require('../controllers/FinanceController');
const auth = require('../middlewares/auth');
const tenantActive = require('../middlewares/tenantActive');
const { requireRoles } = require('../middlewares/rbac');

const router = Router();
router.use(auth, tenantActive);
router.get('/', requireRoles('admin', 'manager'), FinanceController.index);
router.post('/', requireRoles('admin'), FinanceController.create);
router.post('/subscriptions', requireRoles('admin'), FinanceController.createSubscription);
router.get('/subscriptions', requireRoles('admin', 'manager'), FinanceController.subscriptions);
router.put('/subscriptions/:id/status', requireRoles('admin'), FinanceController.updateSubscriptionStatus);
router.put('/:id/cancel', requireRoles('admin'), FinanceController.cancel);
router.post('/:gatewayPaymentId/demo-payment', requireRoles('admin'), FinanceController.simulatePayment);

module.exports = router;
