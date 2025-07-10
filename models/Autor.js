const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Definição do esquema para a coleção "Autor"
const autorSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  usuario: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  tipo_usuario: { type: [String], enum: ['autor', 'moderador', 'admin'], default: ['autor'] },
  modo_usuario: { type: String, enum: ['autor', 'moderador', 'admin'], default: 'autor' },
  dataNascimento: { type: Date, required: true },
  biografia: { type: String },
  fotoPerfil: { type: String, default: '/images/default-profile.png' },
  redesSociais: {
    twitter: {type: String, default: ''}, 
    instagram: {type: String, default: ''},
    facebook: {type: String, default: ''},
    sitePessoal: {type: String, default: ''}
  },
  preferenciasGenero: { type: [String], default: [] },
  data_criacao: { type: Date, default: Date.now },
  historias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Historia' }],
  seguindo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Autor' }],
  seguidores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Autor' }]
});

// Hash da senha antes de salvar
autorSchema.pre('save', async function (next) {
  if (!this.isModified('senha')) return next();
  this.senha = await bcrypt.hash(this.senha, 10);
  next();
});

// Método para verificar senha
autorSchema.methods.compararSenha = function (senhaDigitada) {
  return bcrypt.compare(senhaDigitada, this.senha);
};

module.exports = mongoose.model('Autor', autorSchema);