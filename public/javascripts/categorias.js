document.querySelectorAll('.card-historias-gen .card-img').forEach(card => {
    card.addEventListener('click', () => {
        const historiaId = card.dataset.id;
        const autorUser = null;
        const titleHistoria = card.dataset.genero + ' - Tale Haven';
        const genero = 'categorias/' + card.dataset.genero.toLowerCase().replace(/\s+/g, '-');
        if (historiaId && titleHistoria && genero) {
            window.location.href = `/historias/${historiaId}/ler?from=${genero}&title=${titleHistoria}&user=${autorUser}`
        } else {
            console.error('ID da história não encontrado.');
        }
    });
})