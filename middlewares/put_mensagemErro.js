module.exports = (req, res, next) => {
  res.locals.mensagemErro = null; // valor padrão para evitar erro
  next();
};