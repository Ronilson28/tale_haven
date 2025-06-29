// Middleware para verificar se o autor está autenticado
function verificarAutenticacao(req, res, next) {
  if (req.session && req.session.autor && req.session.autor.id) {
    next();
  } else {
    res.redirect('/login');
  }
}

module.exports = verificarAutenticacao;
