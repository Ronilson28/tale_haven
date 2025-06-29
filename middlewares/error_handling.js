module.exports = function(err, req, res, next) {
  // Define variáveis locais de erro, apenas no ambiente de desenvolvimento
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // Renderiza a página de erro
  res.status(err.status || 500);
  res.render('error',  { title: 'Erro no sistema' });
};