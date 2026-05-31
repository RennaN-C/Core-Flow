const sequelize = require('../config/database');

const Tenant = require('./Tenant');
const User = require('./User');
const Person = require('./Person');
const Invoice = require('./Invoice');
const AuditLog = require('./AuditLog');
const WebhookEvent = require('./WebhookEvent');
const BillingPlan = require('./BillingPlan');


Tenant.hasMany(User, { foreignKey: 'tenant_id' });
User.belongsTo(Tenant, { foreignKey: 'tenant_id' });

Tenant.hasMany(Person, { foreignKey: 'tenant_id' });
Person.belongsTo(Tenant, { foreignKey: 'tenant_id' });

Tenant.hasMany(Invoice, { foreignKey: 'tenant_id' });
Invoice.belongsTo(Tenant, { foreignKey: 'tenant_id' });
Person.hasMany(Invoice, { foreignKey: 'person_id' });
Invoice.belongsTo(Person, { foreignKey: 'person_id' });
User.hasMany(Invoice, { foreignKey: 'created_by' });
Invoice.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
User.hasMany(AuditLog, { foreignKey: 'user_id' });
AuditLog.belongsTo(User, { foreignKey: 'user_id' });
Tenant.hasMany(BillingPlan, { foreignKey: 'tenant_id' });
BillingPlan.belongsTo(Tenant, { foreignKey: 'tenant_id' });
Person.hasMany(BillingPlan, { foreignKey: 'person_id' });
BillingPlan.belongsTo(Person, { foreignKey: 'person_id' });

module.exports = { sequelize, Tenant, User, Person, Invoice, AuditLog, WebhookEvent, BillingPlan };
