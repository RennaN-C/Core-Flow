require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models'); 

const PORT = process.env.PORT || 3000;


console.log('Tentando conectar ao banco:', process.env.DB_HOST);
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Conexão estabelecida e tabelas sincronizadas com sucesso!');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao sincronizar as tabelas com o banco:', error);
    process.exit(1); 
  });