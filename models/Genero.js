const mongoose = require('mongoose');

const generoSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true, trim: true },
  descricao: {type: String, default: ''},
  status: { 
    type: String,
    enum: ['Pendente', 'Aprovado', 'Rejeitado'], 
    default: 'Pendente'
  },
  ativo: {
    type: Boolean,
    default: true
  },
  data_criacao: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Genero', generoSchema);
