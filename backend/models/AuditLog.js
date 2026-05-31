const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tenant_id: DataTypes.UUID,
  user_id: DataTypes.UUID,
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  entity_type: DataTypes.STRING,
  entity_id: DataTypes.STRING,
  details: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
});

module.exports = AuditLog;
