const express = require('express');
var router = express.Router();

// Rota GET para logout
// Esta rota destrói a sessão do usuário e redireciona para a página de login
router.get('/', (req, res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/login');
});

module.exports = router;