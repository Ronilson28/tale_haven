const mongoose = require('mongoose');

// Definição do esquema para a coleção "Capitulo"
const capituloSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  numero: { type: Number, required: true },
  conteudo: { type: String, required: true },
  id_historia: { type: mongoose.Schema.Types.ObjectId, ref: 'Historia', required: true },
  data_criacao: { type: Date, default: Date.now },
  atualizado_em: { type: Date, default: Date.now },
  comentarios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comentario' }],
});

// Middleware para atualizar o campo atualizado_em antes de salvar
capituloSchema.pre('save', function (next) {
  this.atualizado_em = Date.now();
  next();
});

module.exports = mongoose.model('Capitulo', capituloSchema);