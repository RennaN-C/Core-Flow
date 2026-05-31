const { AuditLog, User } = require('../models');

class AuditController {
  async index(req, res) {
    const logs = await AuditLog.findAll({
      where: { tenant_id: req.user.tenant_id },
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']],
      limit: 100,
    });
    return res.json(logs);
  }
}

module.exports = new AuditController();
