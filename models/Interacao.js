const mongoose = require('mongoose');

const interacaoSchema = new mongoose.Schema({
  tipo: { type: String, enum: ['curtida', 'favorito', 'salvo'], required: true },
  autor: { type: mongoose.Schema.Types.ObjectId, ref: 'Autor', required: true },
  referencia: { type: mongoose.Schema.Types.ObjectId, required: true },
  tipoReferencia: { type: String, enum: ['Historia', 'Capitulo'], required: true },
  criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Interacao', interacaoSchema);
