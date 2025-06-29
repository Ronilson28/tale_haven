const mongoose = require('mongoose');

const ambiente = process.env.NODE_ENV || 'dev';

const MONGO_URI = ambiente === 'prod'
  ? process.env.MONGODB_URI_PROD
  : process.env.MONGODB_URI_LOCAL;

const conectarMongo = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`✅ MongoDB conectado com sucesso [${ambiente}]`);
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
    process.exit(1); // Encerra a aplicação caso a conexão falhe
  }
};

module.exports = conectarMongo;