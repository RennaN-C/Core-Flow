const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tenant = sequelize.define('Tenant', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  business_type: {
    type: DataTypes.ENUM('academia', 'clinica', 'barbearia', 'igreja', 'varejo'),
    allowNull: false,
  },
  document: { 
    type: DataTypes.STRING,
    unique: true,
  },
  
  licenseKey: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, 
  },
  settings: {
    type: DataTypes.JSONB,
    defaultValue: {},
  }
}, {
  timestamps: true,
});

module.exports = Tenant;
