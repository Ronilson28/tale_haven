const express = require('express');
const router = express.Router();
const Autor = require('../models/Autor');
const Historia = require('../models/Historia');
const Capitulo = require('../models/Capitulo');
const Genero = require('../models/Genero');
const upload = require('../middlewares/upload');
const verificarAutenticacao = require('../middlewares/auth');

// Visualização da História
router.get('/:id/ler', async (req, res) => {
  const origem = req.query.from;
  const titulo = req.query.title;
  const usuario = req.query.user;
  
  try {
    const historia = await Historia.findById(req.params.id).populate('id_autor').populate('capitulos');
    if (!historia) {
      return res.status(404).render(origem, {
        title: titulo,
        usuario,
        mensagemErro: 'História não encontrada.'
      });
    }

    res.render('ler_historia',{
      title: historia.titulo + ' - Tale Haven',
      historia,
      origem,
      titulo,
      usuario,
      mensagemErro: null
    });
  } catch (err) {
    console.error(err);
    res.status(500).render(origem, {
      title: titulo,
      messagemErro: 'Erro ao carregar a história.'
    });
  }
});

// GET /historias/nova-historia
router.get('/nova-historia', verificarAutenticacao, async (req, res) => {
  const generos = await Genero.find({ ativo: true }).sort('nome');
  res.render('nova_historia', {
    title: 'Criar Nova História',
    mensagemErro: null,
    generos
  });
});

// Criar nova história (POST /historias/nova-historia)
router.post('/nova-historia', verificarAutenticacao, upload.single('capa_url'), async (req, res) => {
  try {
    const { titulo, genero, resumo, capitulos, capa_selecionada } = req.body;

    
    let generos = [];
    if (genero) {
      if (Array.isArray(genero)) {
        generos = genero.map(str => str.trim()).filter(str => str !== '');
      } else {
        const valor = genero.trim();
        if (valor) generos = [valor];
      }
    }
    
    // Escolhe a capa com base no que o usuário usou
    const capaFinal = req.file
      ? '/uploads/capas/' + req.file.filename
      : capa_selecionada || '/images/modelos-capas/Modelo_capa_url-01.jpg';

    const novaHistoria = new Historia({
      titulo,
      genero: generos,
      resumo,
      id_autor: req.session.autor.id,
      capa_url: capaFinal
    });
    await novaHistoria.save();
    console.log('Nova história criada:', novaHistoria);

    // Processa os capítulos
    const capitulosArray = Object.values(capitulos);
    const capitulosIds = [];

    for (let i = 0; i < capitulosArray.length; i++) {
      const cap = capitulosArray[i];
      const novoCapitulo = new Capitulo({
        titulo: cap.titulo,
        conteudo: cap.conteudo,
        numero: i + 1,
        id_historia: novaHistoria._id
      });
      await novoCapitulo.save();
      capitulosIds.push(novoCapitulo._id);
    }

    // Atualiza a história com os capítulos criados
    novaHistoria.capitulos = capitulosIds;
    await novaHistoria.save();

    // Atualiza o autor com a nova história
    await Autor.findByIdAndUpdate(
      req.session.autor.id,
      { $push: { historias: novaHistoria._id } }
    );
    console.log('Autor atualizado com nova história:', req.session.autor.nome);

    // Redirecionar para o perfil após criar
    res.redirect('/profile');
  } catch (error) {
    console.error(error);
    res.status(500).render('nova_historia', {
      title: 'Criar Nova História',
      mensagemErro: 'Erro ao criar a história. Tente novamente.'
    });
  }
});

// Excluir história (DELETE /historias/:id)
router.delete('/:id', verificarAutenticacao, async (req, res) => {
  try {
    const historia = await Historia.findOne({ _id: req.params.id, id_autor: req.session.autor.id });

    if (!historia) {
      return res.status(404).json({ message: 'História não encontrada ou você não tem permissão para excluí-la.' });
    }

    await Historia.deleteOne({ _id: req.params.id });

    // Remove a história do array 'historias' do Autor
    await Autor.findByIdAndUpdate(req.session.autor.id, { $pull: { historias: req.params.id } });

    res.json({ message: 'História excluída com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao excluir história.' });
  }
});

// GET /historias/editar/:id
router.get('/editar/:id', verificarAutenticacao, async (req, res) => {
  try {
    const historia = await Historia.findById(req.params.id).populate('capitulos');
    const generos = await Genero.find({ ativo: true }).sort('nome');
    if (!historia) {
      return res.status(404).render('404', { mensagem: 'História não encontrada' });
    }
    console.log('História encontrada:', historia);
    res.render('editar_historia', {
      title: 'Editar História',
      historia,
      mensagemErro: null,
      generos
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('nova_historia', {
      title: 'Editar História',
      mensagemErro: 'Erro ao editar a história. Tente novamente.'
    });
  }
});

// POST /historias/editar/:id
router.post('/editar/:id', verificarAutenticacao, upload.single('capa_url'), async (req, res) => {
  try {
    const { titulo, genero, resumo, capitulos_removidos, capa_selecionada } = req.body;
    
    let generos = [];
    if (genero) {
      if (Array.isArray(genero)) {
        generos = genero.map(str => str.trim()).filter(str => str !== '');
      } else {
        const valor = genero.trim();
        if (valor) generos = [valor];
      }
    }

    // Buscar a história atual
    const historiaExistente = await Historia.findById(req.params.id).populate('capitulos');
    if (!historiaExistente) {
      req.session.mensagemErro = 'História não encontrada.';
      return res.status(404).redirect('/profile');
    }
    
    // Deletar os capítulos antigos (opcional, se quiser limpar duplicatas)
    await Capitulo.deleteMany({ id_historia: historiaExistente._id });
    
    const novosIdsCapitulos = [];
    const capitulosData = req.body.capitulos;

    if (capitulosData && typeof capitulosData === 'object') {
      for (const index in capitulosData) {
        const capitulo = capitulosData[index];
        if (capitulo._id) {
          // Se o capítulo já existe, atualiza
          await Capitulo.findByIdAndUpdate(capitulo._id, {
            titulo: capitulo.titulo,
            conteudo: capitulo.conteudo,
            atualizado_em: new Date(Date.now())
          });
          novosIdsCapitulos.push(capitulo._id);
        }
        else {
          // Se é um novo capítulo, cria
          const novoCapitulo = new Capitulo({
            titulo: capitulo.titulo,
            conteudo: capitulo.conteudo,
            numero: novosIdsCapitulos.length + 1, // Incrementa o número do capítulo
            id_historia: historiaExistente._id
          });
          const novoCapituloSalvo = await novoCapitulo.save();
          novosIdsCapitulos.push(novoCapituloSalvo._id);
        }
      }
    }

    // Se houver capítulos removidos, exclui-os
    if (capitulos_removidos) {
      const capitulosIds = capitulos_removidos.split(',').map(id => id.trim()).filter(Boolean);
      await Capitulo.deleteMany({ _id: { $in: capitulosIds } });
    }
    
    // Escolhe a capa com base no que o usuário usou
    const capaFinal = req.file
      ? '/uploads/capas/' + req.file.filename
      : capa_selecionada || historiaExistente.capa_url;
    
    // Atualiza a história com os novos dados
    historiaExistente.titulo = titulo;
    historiaExistente.genero = generos;
    historiaExistente.resumo = resumo;
    historiaExistente.capitulos = novosIdsCapitulos;
    historiaExistente.atualizado_em = new Date(Date.now());
    historiaExistente.capa_url = capaFinal;

    const historiaAtualizada = await historiaExistente.save();

    if (!historiaAtualizada) {
      req.session.mensagemErro = 'História não encontrada.';
      return res.status(404).redirect('/profile');
    }

    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.status(500).render('editar_historia', {
      mensagemErro: 'Erro ao atualizar a história.',
      historia: req.body
    });
  }
});

module.exports = router;