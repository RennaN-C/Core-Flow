const { Tenant } = require('../models');

module.exports = async (req, res, next) => {
  const tenant = await Tenant.findByPk(req.user.tenant_id);
  if (!tenant?.active) return res.status(403).json({ error: 'Tenant sem licença ativa.' });
  return next();
};
