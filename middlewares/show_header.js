module.exports = (req, res, next) => {
  const noHeaderPaths = ['/login', '/sign_up'];
  res.locals.showHeader = !noHeaderPaths.includes(req.path);
  next();
};