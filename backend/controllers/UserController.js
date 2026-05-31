const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { recordAudit } = require('../services/audit');

class UserController {
  async index(req, res) {
    const users = await User.findAll({
      where: { tenant_id: req.user.tenant_id },
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
      order: [['name', 'ASC']],
    });
    return res.json(users);
  }

  async create(req, res) {
    try {
      const { name, email, password, role = 'staff' } = req.body;
      if (!['admin', 'manager', 'staff'].includes(role)) return res.status(400).json({ error: 'Cargo invalido.' });
      const password_hash = await bcrypt.hash(password, 10);
      const user = await User.create({ tenant_id: req.user.tenant_id, name, email, password_hash, role });
      await recordAudit({ req, action: 'USER_CREATED', entityType: 'User', entityId: user.id, details: { role } });
      return res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
    } catch (error) {
      return res.status(400).json({ error: 'Não foi possível criar o usuário.', details: error.message });
    }
  }

  async updateRole(req, res) {
    if (!['admin', 'manager', 'staff'].includes(req.body.role)) return res.status(400).json({ error: 'Cargo invalido.' });
    if (req.params.id === req.user.id) return res.status(400).json({ error: 'Voce nao pode alterar seu proprio cargo.' });
    const user = await User.findOne({ where: { id: req.params.id, tenant_id: req.user.tenant_id } });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    await user.update({ role: req.body.role });
    await recordAudit({ req, action: 'USER_ROLE_UPDATED', entityType: 'User', entityId: user.id, details: { role: user.role } });
    return res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  }

  async delete(req, res) {
    if (req.params.id === req.user.id) return res.status(400).json({ error: 'Voce nao pode remover seu proprio usuario.' });
    const user = await User.findOne({ where: { id: req.params.id, tenant_id: req.user.tenant_id } });
    if (!user) return res.status(404).json({ error: 'Usuario nao encontrado.' });
    await user.destroy();
    await recordAudit({ req, action: 'USER_DELETED', entityType: 'User', entityId: user.id, details: { email: user.email } });
    return res.status(204).send();
  }
}

module.exports = new UserController();
