const multer = require('multer');
const path = require('path');

// Configuração do destino e nome do arquivo
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'fotoPerfil') {
      cb(null, 'public/uploads/perfil');
    } else if (file.fieldname === 'capa_url') {
      cb(null, 'public/uploads/capas');
    } else {
      cb(new Error('Campo inválido de upload'), null);
    }
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const nomeArquivo = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, nomeArquivo);
  }
});

const upload = multer({ storage });

module.exports = upload;
