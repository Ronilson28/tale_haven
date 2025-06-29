const mongoose = require('mongoose');

//  Definição do esquema para a coleção "historia"
const historiaSchema = new mongoose.Schema({
  id_autor: {  
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Autor', 
    required: true 
  },
  titulo: { type: String, required: true },
  descricao: {type: String, default: ''},
  genero: {type: [String], default: []},
  tags: { type: [String], default: [] },
  status: { 
    type: String,
    enum: ['Em andamento', 'Concluído'], 
    default: 'Em andamento' 
  },
  data_criacao: { type: Date, default: Date.now },
  capa_url: {type: String, default: '/images/modelos-capas/Modelo_capa_url-01.jpg'},
  capitulo: { type: String, default: '' },
  resumo: { type: String, default: '' },
  // Campos adicionais
  capitulos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Capitulo' }],
  //curtidas: { type: Number, default: 0 },
  //visualizacoes: { type: Number, default: 0 },
  //comentarios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comentario' }],
  atualizado_em: { type: Date, default: Date.now },
  //privado: { type: Boolean, default: false },
  //avaliacoes: [{ autorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Autor' },
  //nota: Number, comentario: String
  //}],
  //slug: String
}, {timestamps: true});

// Middleware para atualizar o campo atualizado_em antes de salvar
historiaSchema.pre('save', function (next) {
  this.atualizado_em = Date.now();
  next();
});

module.exports = mongoose.model('Historia', historiaSchema);
