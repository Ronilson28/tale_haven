require('dotenv').config(); // carrega '.env'

var express = require('express');
const expressLayouts = require('express-ejs-layouts');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Importação de Middlewares
const catchNotFoundPage = require('./middlewares/catch_not_found_pages');
const errorHandling = require('./middlewares/error_handling');
const sessionConfig = require('./config/session');
const sessionToViews = require('./middlewares/session_to_views');
const showHeader = require('./middlewares/show_header');
const putMensagemErro = require('./middlewares/put_mensagemErro');
const conectarMongo = require('./config/database');

// Importação das rotas
var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var signUpRouter = require('./routes/sign_up');
var logoutRouter = require('./routes/logout');
var historiasRouter = require('./routes/historias');
var categorias = require('./routes/categorias');
var profileRouter = require('./routes/profile');
var publicProfileRouter = require('./routes/public_profile');

var app = express();

// Configuração do mecanismo de visualização (EJS com layouts)
app.use(expressLayouts);
app.set('layout', 'layout');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Conexão com o Banco de Dados MongoDB 
conectarMongo();

app.use(logger('dev')); // Middleware de logging
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Middleware para processar requisições com dados codificados na URL
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // Middleware para servir arquivos estáticos da pasta 'public'

// Configuração do middleware de sessão
app.use(sessionConfig);
// Middleware para tornar a sessão disponível para todas as views
app.use(sessionToViews);
// Middleware para esconder o header em páginas específicas. Define quando o cabeçalho será exibido ou ocultado.
app.use(showHeader);
// Torna 'mensagemErro' disponível em todas as views
app.use(putMensagemErro);

// Registro das rotas principais
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/sign_up', signUpRouter);
app.use('/logout', logoutRouter);
app.use('/profile', profileRouter);
app.use('/historias', historiasRouter);
app.use('/categorias', categorias);
app.use('/', publicProfileRouter);

// Middleware para capturar erros 404 (página não encontrada)
app.use(catchNotFoundPage);
// Middleware de tratamento de erros
app.use(errorHandling);

module.exports = app;