# PROJETO_LABORATORIO_DE_DESENVOLVIMENTO_DE_SOFTWARE

# 📚 Tale Haven

**Tale Haven** é uma plataforma voltada para **autores independentes**, permitindo que criem, editem, publiquem e compartilhem suas histórias com leitores apaixonados por literatura. Inspirado em plataformas como *Wattpad* e *Spirit Fanfics*, o projeto oferece recursos pensados especialmente para a comunidade criativa.

---

## 🚀 Funcionalidades

### 👤 Autores
- Cadastro, login e logout
- Upload de **imagem de perfil e capa**
- Página de **perfil público** com histórias associadas
- Sistema de **seguidores e seguindo**
- Recuperação de senha via **token e link por e-mail**

### ✍️ Escrita e Publicação
- Criação e edição de **histórias**
- Estrutura com **capítulos separados e organizados**
- Listagem de histórias no perfil
- Visualização pública de histórias e capítulos

### 🌐 Interações Sociais
- Seguir e deixar de seguir autores
- Contador de seguidores e seguindo
- Visualização de listas de seguidores/seguindo

### 💻 Frontend e Layout
- Interface moderna com **EJS e CSS personalizado**
- Layout principal reutilizável (`header`, `footer`, etc.)
- Planejamento de modais e temas

---

## 🛠️ Tecnologias Utilizadas

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **EJS** (Embedded JavaScript Templates)
- **Multer** (upload de arquivos)
- **Nodemailer** (envio de e-mails)
- **Express-session** (autenticação)
- **CSS customizado** (sem frameworks por enquanto)

---

## 🗂️ Estrutura do Projeto

tale_haven/
├── bin/
│   └── www
├── config/
│   ├── database.js
│   └── session.js
├── middlewares/
│   │   ├── auth.js
│   │   ├── catch_not_found_page.js
│   │   ├── error_handling.js
│   │   ├── put_mensagemErro.js
│   │   ├── session_to_views.js
│   │   ├── show_header.js
│   │   └── upload.js
├── models/
│   │   ├── Autor.js
│   │   ├── Capitulo.js
│   │   ├── Comentario.js
│   │   ├── Genero.js
│   │   ├── Historia.js
│   │   └── Interacao.js
├── public/
│   ├── icons/
│   ├── images/
│   │   └── modelos-capas/
│   ├── javascripts/
│   ├── stylesheets/
│   └── uploads/
│   │   ├── capas/
│   │   └── perfil/
├── routes/
│   ├── categorias.js
│   ├── historias.js
│   ├── index.js
│   ├── login.js
│   ├── logout.js
│   ├── profile.js
│   ├── public_profile.js
│   └── sign_up.js
├── scripts/
│   └── popularGeneros.js
├── views/
│   ├── partials/
│   │   ├── footer.ejs
│   │   └── header.ejs
│   ├── categorias_genero.ejs
│   ├── categorias.ejs
│   ├── edit_profile.ejs
│   ├── editar_historia.ejs
│   ├── error.ejs
│   ├── index.ejs
│   ├── layout.ejs
│   ├── ler_historia.ejs
│   ├── login.ejs
│   ├── nova_historia.ejs
│   ├── profile.ejs
│   ├── public_profile.js
│   └── sign_up.ejs
├── views/
│ ├── partials/
├── app.js
├── package-lock.json
└── package.json

---

## 🔮 Funcionalidades Futuras (Roadmap)

- ✅ Página "Explorar" com filtros por gênero e popularidade
- ✅ Sistema de notificações
- ✅ Moderação e painel administrativo

---

## 🧪 Como Rodar Localmente

```bash
# Clone o repositório
git clone https://github.com/seuusuario/TALE_HAVEN.git

# Instale as dependências
npm install

# Configure o MongoDB e as variáveis de ambiente

# Inicie o servidor
npm start