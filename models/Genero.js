const mongoose = require('mongoose');

//  Definição do esquema para a coleção "historia"
const generoSchema = new mongoose.Schema({
  id_historia: {  
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Historia', 
    required: true 
  },
  nome: { type: String, required: true },
  descricao: {type: String, default: ''},
  status: { 
    type: String,
    enum: ['Pendente', 'Aprovado', 'Rejeitado'], 
    default: 'Em andamento'
  },
  data_criacao: { type: Date, default: Date.now },
  atualizado_em: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Genero', generoSchema);
