// Redirecionar ao clicar no destaque
const destaque = document.querySelector('.destaque-banner');
if (destaque) {
  destaque.addEventListener('click', () => {
    const id = destaque.dataset.id;
    const autorUser = null;
    if (id) {
      window.location.href = `/historias/${id}/ler?from=index&title=Tale Haven&user=${autorUser}`;
    }
  });
}

// Redirecionar ao clicar em qualquer card de história
document.querySelectorAll('.card-historia').forEach(card => {
  card.addEventListener('click', () => {
    const id = card.dataset.id;
    const autorUser = null;
    if (id) {
      window.location.href = `/historias/${id}/ler?from=index&title=Tale Haven&user=${autorUser}`;
    }
  });
});
