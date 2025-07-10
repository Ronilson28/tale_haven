const mongoose = require('mongoose');

const comentarioSchema = new mongoose.Schema({
  conteudo: { type: String, required: true, trim: true },
  autor: { type: mongoose.Schema.Types.ObjectId, ref: 'Autor', required: true },
  capitulo: { type: mongoose.Schema.Types.ObjectId, ref: 'Capitulo', required: true },
  data_criacao: { type: Date, default: Date.now },
  atualizado_em: { type: Date, default: Date.now }
}, { timestamps: true });

// Middleware para atualizar `atualizado_em`
comentarioSchema.pre('save', function (next) {
  this.atualizado_em = Date.now();
  next();
});

module.exports = mongoose.model('Comentario', comentarioSchema);
