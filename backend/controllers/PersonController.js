const { Person } = require('../models');

class PersonController {
 
  async store(req, res) {
    try {
      const { name, document, phone, email, metadata } = req.body;
      
      const person = await Person.create({
        name,
        document,
        phone,
        email,
        metadata: metadata || {},
        tenant_id: req.user.tenant_id 
      });

      return res.status(201).json(person);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar pessoa', details: error.message });
    }
  }

 
  async index(req, res) {
    try {
      const people = await Person.findAll({ 
        where: { tenant_id: req.user.tenant_id },
        order: [['createdAt', 'DESC']]
      });

      return res.json(people);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar pessoas' });
    }
  }

 
  async show(req, res) {
    try {
      const { id } = req.params;
      const person = await Person.findOne({
        where: { id, tenant_id: req.user.tenant_id }
      });

      if (!person) {
        return res.status(404).json({ error: 'Pessoa não encontrada neste tenant.' });
      }

      return res.json(person);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar pessoa' });
    }
  }

 
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, document, phone, email, metadata } = req.body;

      const person = await Person.findOne({
        where: { id, tenant_id: req.user.tenant_id }
      });

      if (!person) {
        return res.status(404).json({ error: 'Pessoa não encontrada para atualização.' });
      }

      await person.update({ name, document, phone, email, metadata });

      return res.json(person);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar pessoa' });
    }
  }

 
  async delete(req, res) {
    try {
      const { id } = req.params;

      const person = await Person.findOne({
        where: { id, tenant_id: req.user.tenant_id }
      });

      if (!person) {
        return res.status(404).json({ error: 'Pessoa não encontrada para exclusão.' });
      }

      await person.destroy();

      return res.status(204).send(); // Sucesso sem conteúdo
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar pessoa' });
    }
  }
}

module.exports = new PersonController();