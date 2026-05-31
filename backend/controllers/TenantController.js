const { Tenant } = require('../models');
const { recordAudit } = require('../services/audit');
const { getLicenseSettings, resolveLicensedProfile } = require('../services/businessProfiles');
const { normalizeSystemPreferences } = require('../services/systemPreferences');

const serializeTenant = (tenant) => {
  const settings = tenant.settings || {};
  return {
    id: tenant.id,
    name: tenant.name,
    document: tenant.document,
    business_type: tenant.business_type,
    active: tenant.active,
    createdAt: tenant.createdAt,
    settings: {
      ...settings,
      license: getLicenseSettings({ settings, businessType: tenant.business_type }),
      system: normalizeSystemPreferences({}, settings.system),
    },
    profile: resolveLicensedProfile({ settings, businessType: tenant.business_type }),
  };
};

class TenantController {
  async show(req, res) {
    const tenant = await Tenant.findByPk(req.user.tenant_id);
    if (!tenant) return res.status(404).json({ error: 'Tenant nao encontrado.' });
    return res.json(serializeTenant(tenant));
  }

  async update(req, res) {
    const tenant = await Tenant.findByPk(req.user.tenant_id);
    if (!tenant) return res.status(404).json({ error: 'Tenant nao encontrado.' });

    if (Object.hasOwn(req.body, 'profile_id') || Object.hasOwn(req.body, 'enabled_modules')) {
      return res.status(400).json({ error: 'O nicho e os modulos sao definidos pela licenca no cadastro.' });
    }

    const { name, document, system = {} } = req.body;
    const settings = {
      ...(tenant.settings || {}),
      license: getLicenseSettings({ settings: tenant.settings, businessType: tenant.business_type }),
      system: normalizeSystemPreferences(system, tenant.settings?.system),
    };

    await tenant.update({ name: name?.trim() || tenant.name, document: document?.trim() || null, settings });
    await recordAudit({ req, action: 'TENANT_UPDATED', entityType: 'Tenant', entityId: tenant.id, details: { system: settings.system } });
    return res.json(serializeTenant(tenant));
  }
}

module.exports = new TenantController();
