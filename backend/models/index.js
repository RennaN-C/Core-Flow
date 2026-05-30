const sequelize = require('../config/database');

const Tenant = require('./Tenant');
const User = require('./User');
const Person = require('./Person');


Tenant.hasMany(User, { foreignKey: 'tenant_id' });
User.belongsTo(Tenant, { foreignKey: 'tenant_id' });

Tenant.hasMany(Person, { foreignKey: 'tenant_id' });
Person.belongsTo(Tenant, { foreignKey: 'tenant_id' });


module.exports = { sequelize, Tenant, User, Person };