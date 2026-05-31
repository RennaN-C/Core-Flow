const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WebhookEvent = sequelize.define('WebhookEvent', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  gateway: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  event_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  event_type: DataTypes.STRING,
});

module.exports = WebhookEvent;
