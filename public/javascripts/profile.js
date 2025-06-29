const btnNovaHistoria = document.getElementById('btn-nova-historia');

// Abrir página para criar Nova História
btnNovaHistoria.addEventListener('click', () => {
  window.location.href = '/historias/nova-historia';
});

// Adiciona eventos de clique para os botões de excluir histórias
document.querySelectorAll('.btn-excluir-historia').forEach(button => {
  button.addEventListener('click', async () => {
    const historiaId = button.getAttribute('data-id');
    if (!historiaId) {
      alert('ID da história não encontrado.');
      console.error('ID da história não encontrado.');
      return;
    }
    const confirmacao = confirm('Você está prestes a excluir permanentemente esta história.\nTem certeza que quer continuar?');
    if (confirmacao) {
      try {
        const response = await fetch(`/historias/${historiaId}`, {
          method: 'DELETE',
          //headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
          // História excluída com sucesso, recarrega a página
          //window.location.reload();
          location.reload(); // Recarrega o perfil para atualizar a lista de histórias
        } else {
          const erro = await response.json();
          alert(`Erro ao excluir história: ${erro.message}`);
        }
      } catch (error) {
        console.error('Erro ao excluir história:', error);
        alert('Erro ao excluir história. Tente novamente mais tarde.');
      }
    }
  });
});

// Redireciona para a página de leitura de história
document.querySelectorAll('.btn-ler-historia').forEach(button => {
  button.addEventListener('click', (e) => {
    const historiaId = button.getAttribute('data-id');
    const autorUser = button.getAttribute('data-usuario');
    const titleHistoria = button.getAttribute('data-nome') + ' - Tale Haven';
    if (historiaId && autorUser && titleHistoria) {
      window.location.href = `/historias/${historiaId}/ler?from=profile&title=${titleHistoria}&user=${autorUser}`
    } else {
      console.error('ID da história não encontrado.');
    }
  });
});

// Redireciona para a página de edição de história
document.querySelectorAll('.btn-editar-historia').forEach(button => {
  button.addEventListener('click', (e) => {
    const historiaId = button.getAttribute('data-id');
    if (historiaId) {
      window.location.href = `/historias/editar/${historiaId}`;
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