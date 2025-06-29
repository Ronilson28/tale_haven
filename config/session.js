const session = require('express-session');

// Configuração do middleware de sessão
module.exports = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // True se estiver usando HTTPS
});