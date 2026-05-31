const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Tenant, sequelize } = require('../models');
const { recordAudit } = require('../services/audit');
const { createLicenseSettings, resolveProfile } = require('../services/businessProfiles');
const { normalizeSystemPreferences } = require('../services/systemPreferences');

const generateLicenseKey = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let key = '';
  for (let i = 0; i < 16; i++) {
    if (i > 0 && i % 4 === 0) key += '-';
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
};

class AuthController {
  
  async register(req, res) {
    try {
      const { name, email, password, companyName, companyDocument, companyPhone, business_type, profile_id } = req.body;

      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'E-mail já cadastrado.' });
      }

      const licenseKey = generateLicenseKey();
      
      
      const documentToSave = companyDocument && companyDocument.trim() !== "" ? companyDocument : null;
      const profile = resolveProfile({ profileId: profile_id, businessType: business_type });

      const { tenant, user } = await sequelize.transaction(async (transaction) => {
        const tenant = await Tenant.create({
          name: companyName,
          business_type: profile.baseBusinessType,
          document: documentToSave,
          licenseKey: licenseKey,
          active: false,
          settings: {
            license: createLicenseSettings(profile),
            system: normalizeSystemPreferences({ company_phone: companyPhone }),
          },
        }, { transaction });

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const user = await User.create({
          tenant_id: tenant.id,
          name: name,
          email,
          password_hash,
          role: 'admin'
        }, { transaction });

        return { tenant, user };
      });

      return res.status(201).json({
        message: 'Empresa e usuário criados com sucesso!',
        licenseKey: licenseKey,
        tenant: { id: tenant.id, name: tenant.name, profile_id: profile.id },
        user: { id: user.id, name: user.name, email: user.email }
      });

    } catch (error) {
      console.error("ERRO DETALHADO NO CADASTRO:", error);
      if (error.name === 'SequelizeUniqueConstraintError') {
         return res.status(400).json({ error: 'Este documento ou e-mail já está em uso.' });
      }
      return res.status(500).json({ error: 'Erro ao registrar', details: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas.' });
      }

      const checkPassword = await bcrypt.compare(password, user.password_hash);
      if (!checkPassword) {
        return res.status(401).json({ error: 'Credenciais inválidas.' });
      }

      const tenant = await Tenant.findByPk(user.tenant_id);

      const token = jwt.sign(
        { 
          id: user.id, 
          tenant_id: user.tenant_id,
          role: user.role
        }, 
        process.env.JWT_SECRET,
        { expiresIn: '1d' } 
      );

      return res.json({
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email,
          role: user.role,
          Tenant: { isActive: tenant.active } 
        },
        token
      });

    } catch (error) {
      return res.status(500).json({ error: 'Erro ao fazer login', details: error.message });
    }
  }

  async activateLicense(req, res) {
    console.log("ENTROU NA ROTA DE ATIVAÇÃO. Payload:", req.body);
    try {
      const { licenseKey } = req.body;
      
      if (!licenseKey) {
        return res.status(400).json({ error: 'Chave de licença não enviada.' });
      }

      
      const tenant = await Tenant.findOne({
        where: {
          id: req.user.tenant_id,
          licenseKey: licenseKey.trim()
        }
      });

      if (!tenant) {
        console.log("ERRO: Chave não encontrada no banco");
        return res.status(400).json({ error: 'Chave de licença inválida.' });
      }

      tenant.active = true;
      await tenant.save();
      await recordAudit({ req, action: 'TENANT_LICENSE_ACTIVATED', entityType: 'Tenant', entityId: tenant.id });

      console.log("SUCESSO: Empresa ativada com sucesso!");
      return res.json({ message: 'Sistema ativado com sucesso!', active: true });

    } catch (error) {
      console.error("ERRO CRÍTICO NA ATIVAÇÃO:", error);
      return res.status(500).json({ error: 'Erro ao ativar licença', details: error.message });
    }
  }
}

module.exports = new AuthController();
