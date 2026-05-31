const { Router } = require('express');
const authRoutes = require('./auth.routes');
const personRoutes = require('./person.routes'); 
const financeRoutes = require('./finance.routes');
const userRoutes = require('./user.routes');
const auditRoutes = require('./audit.routes');
const insightRoutes = require('./insight.routes');
const webhookRoutes = require('./webhook.routes');
const tenantRoutes = require('./tenant.routes');
const businessProfileRoutes = require('./business-profile.routes');

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/persons', personRoutes); 
routes.use('/api/persons', personRoutes);
routes.use('/api/finance/invoices', financeRoutes);
routes.use('/api/users', userRoutes);
routes.use('/api/audit-logs', auditRoutes);
routes.use('/api/insights', insightRoutes);
routes.use('/api/tenant', tenantRoutes);
routes.use('/api/business-profiles', businessProfileRoutes);
routes.use('/webhooks', webhookRoutes);

module.exports = routes;
