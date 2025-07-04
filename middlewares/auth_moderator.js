function verificarModerador(req, res, next) {
  if (req.session?.autor?.tipos?.includes('moderador')) {
    return next();
  } else {
    return res.status(403).render('acesso_negado', {
      title: 'Acesso Negado',
      mensagemErro: 'Você não tem permissão para acessar esta página.'
    });
  }
}

module.exports = verificarModerador;