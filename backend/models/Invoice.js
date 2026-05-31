const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Invoice = sequelize.define('Invoice', {
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
  gateway: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'asaas',
  },
  gateway_payment_id: {
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
  due_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  billing_type: {
    type: DataTypes.ENUM('PIX', 'BOLETO', 'CREDIT_CARD'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'PAID', 'OVERDUE', 'CANCELED'),
    allowNull: false,
    defaultValue: 'PENDING',
  },
  payment_url: DataTypes.TEXT,
  pix_payload: DataTypes.TEXT,
  pix_encoded_image: DataTypes.TEXT,
  paid_at: DataTypes.DATE,
});

module.exports = Invoice;
