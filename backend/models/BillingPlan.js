const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BillingPlan = sequelize.define('BillingPlan', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tenant_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  person_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  gateway_subscription_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  cycle: {
    type: DataTypes.ENUM('WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'SEMIANNUALLY', 'YEARLY'),
    allowNull: false,
  },
  billing_type: {
    type: DataTypes.ENUM('PIX', 'BOLETO', 'CREDIT_CARD'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
    defaultValue: 'ACTIVE',
  },
});

module.exports = BillingPlan;
