const { AuditLog } = require('../models');

const recordAudit = async ({ req, tenantId, userId, action, entityType, entityId, details = {} }) => {
  await AuditLog.create({
    tenant_id: tenantId || req?.user?.tenant_id || null,
    user_id: userId || req?.user?.id || null,
    action,
    entity_type: entityType,
    entity_id: entityId ? String(entityId) : null,
    details,
  });
};

module.exports = { recordAudit };
