function selecionarModeloCapa(caminho) {
    document.getElementById('preview-capa').src = caminho;
    document.getElementById('capa_selecionada').value = caminho;
    document.getElementById('capa_url').value = ""; // Limpa input de upload
}

document.getElementById('capa_url').addEventListener('change', function (e) {
    if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('preview-capa').src = e.target.result;
            document.getElementById('capa_selecionada').value = ""; // Limpa escolha de modelo
        };
        reader.readAsDataURL(e.target.files[0]);
    }
});

let contadorCapitulo = document.querySelectorAll('#capitulos-container .capitulo').length;;

function adicionarCapitulo() {
    const container = document.getElementById('capitulos-container');
    const novoIndex = contadorCapitulo;

    const novoCapitulo = document.createElement('div');
    novoCapitulo.className = 'capitulo';
    novoCapitulo.setAttribute('data-index', novoIndex + 1);

    novoCapitulo.innerHTML = `
        <input type="text" name="capitulos[${novoIndex}][titulo]" value="Capítulo ${novoIndex + 1}" placeholder="Título do Capítulo ${novoIndex + 1}" required>
        <textarea name="capitulos[${novoIndex}][conteudo]" placeholder="Conteúdo do Capítulo ${novoIndex + 1}" required></textarea>
        <button type="button" class="btn-remover-capitulo" onclick="removerCapitulo(this)">Remover</button>
    `;
    container.appendChild(novoCapitulo);
    contadorCapitulo++;
}

function removerCapitulo(botao) {
    const capituloDiv = botao.closest('.capitulo');
    const capituloIdInput = capituloDiv.querySelector('input[name$="[id]"]');

    // Se o capítulo tiver um ID, vamos armazená-lo num campo oculto para deletar no backend
    if (capituloIdInput) {
        const capituloId = capituloIdInput.value;
        const deletadosInput = document.getElementById('capitulos-removidos');
        if (deletadosInput) {
            deletadosInput.value += `${capituloId},`;
        } else {
            const hidden = document.createElement('input');
            hidden.type = 'hidden';
            hidden.id = 'capitulos-removidos';
            hidden.name = 'capitulos_removidos';
            hidden.value = `${capituloId},`;
            document.getElementById('novaHistoriaForm').appendChild(hidden);
        }
    }

    // Remover do DOM
    capituloDiv.remove();

    // Reorganizar índices
    const capitulos = document.querySelectorAll('#capitulos-container .capitulo');
    capitulos.forEach((cap, index) => {
        cap.setAttribute('data-index', index + 1);

        const tituloInput = cap.querySelector('input[type="text"]');
        const conteudoTextarea = cap.querySelector('textarea');
        const idInput = cap.querySelector('input[name$="[id]"]');

        tituloInput.name = `capitulos[${index}][titulo]`;
        conteudoTextarea.name = `capitulos[${index}][conteudo]`;

        // Atualiza placeholders e valor se for default
        if (tituloInput.value === `Capítulo ${index + 2}` || tituloInput.value.trim() === '') {
            tituloInput.value = `Capítulo ${index + 1}`;
        }
        tituloInput.placeholder = `Título do Capítulo ${index + 1}`;
        conteudoTextarea.placeholder = `Conteúdo do Capítulo ${index + 1}`;

        if (idInput) {
            idInput.name = `capitulos[${index}][id]`;
        }
    });

    contadorCapitulo = capitulos.length;
}

// Evento para destacar o capítulo ao passar o mouse sobre o botão de remover
// Isso é necessário para que o destaque apareça quando o mouse estiver sobre o botão
document.addEventListener('mouseover', function (e) {
    if (e.target.classList.contains('btn-remover-capitulo')) {
        const capituloDiv = e.target.closest('.capitulo');
        capituloDiv.classList.add('destacar');
    }
});

// Evento para remover o destaque ao sair do mouse
// Isso é necessário para evitar que o destaque permaneça quando o mouse sair do botão 
document.addEventListener('mouseout', function (e) {
    if (e.target.classList.contains('btn-remover-capitulo')) {
        const capituloDiv = e.target.closest('.capitulo');
        capituloDiv.classList.remove('destacar');
    }
});

// Evento para publicar a nova história
document.querySelector('.btn-nova-historia').addEventListener('click', () => {
    const titulo = document.querySelector('input[name="titulo"]').value.trim();
    const genero = document.querySelector('input[name="genero"]').value.trim();
    const resumo = document.querySelector('textarea[name="resumo"]').value.trim();
    const capitulos = Array.from(document.querySelectorAll('#capitulos-container .capitulo')).map(cap => ({
        titulo: cap.querySelector('input').value.trim(),
        conteudo: cap.querySelector('textarea').value.trim()
    }));

    if (!titulo || !genero || !resumo || capitulos.some(cap => !cap.titulo || !cap.conteudo)) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
});

// Cancelar a edição da nova história
document.querySelector('.btn-cancelar-nova-historia').addEventListener('click', () => {
    if (confirm('Tem certeza que deseja cancelar a edição da história?')) {
        window.location.href = '/profile'; // Redireciona para o perfil do usuário
    }
});