module.exports = (req, res, next) => {
  res.locals.mensagemErro = req.session.mensagemErro || null;
  req.session.mensagemErro = null;
  next();
};