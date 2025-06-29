// Altera o botão de seguir. Se "seguindo", altera valor para "Deixar de seguir" se estiver com o mouse sobre o botão
document.addEventListener('DOMContentLoaded', () => {
  const botaoSeguir = document.querySelector('.btn-seguir');

  if (botaoSeguir && botaoSeguir.dataset.seguindo === 'true') {
    const textoOriginal = botaoSeguir.textContent;

    botaoSeguir.addEventListener('mouseover', () => {
      botaoSeguir.textContent = 'Deixar de seguir';
    });

    botaoSeguir.addEventListener('mouseout', () => {
      botaoSeguir.textContent = textoOriginal;
    });
  }
});

// Redireciona para a página de leitura de história
document.querySelectorAll('.btn-ler-historia').forEach(button => {
  button.addEventListener('click', (e) => {
    const historiaId = button.getAttribute('data-id');
    const autorUser = button.getAttribute('data-usuario');
    const titleHistoria = button.getAttribute('data-nome') + ' - Tale Haven';
    if (historiaId && autorUser && titleHistoria) {
      window.location.href = `/historias/${historiaId}/ler?from=public_profile&title=${titleHistoria}&user=${autorUser}`;
    } else {
      console.error('ID da história não encontrado.');
    }
  });
});

function abrirModalLista(tipo) {
  const modal = document.getElementById('modal-seguidores');
  const titulo = document.getElementById('modal-seguidores-titulo');
  const listaSeguidores = document.getElementById('lista-seguidores');
  const listaSeguindo = document.getElementById('lista-seguindo');

  // Reset
  listaSeguidores.classList.add('hidden');
  listaSeguindo.classList.add('hidden');

  // Mostrar lista correta
  if (tipo === 'seguidores') {
    titulo.textContent = 'Seguidores';
    listaSeguidores.classList.remove('hidden');
  } else {
    titulo.textContent = 'Seguindo';
    listaSeguindo.classList.remove('hidden');
  }

  modal.classList.remove('hidden');
  modal.style.display = 'flex';
}

function fecharModal() {
  document.getElementById('modal-seguidores').style.display = 'none';
}