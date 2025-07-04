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

let contadorCapitulo = 1;

function adicionarCapitulo() {
    contadorCapitulo++;
    const container = document.getElementById('capitulos-container');

    const novoCapitulo = document.createElement('div');
    novoCapitulo.className = 'capitulo';
    novoCapitulo.setAttribute('data-index', contadorCapitulo);

    novoCapitulo.innerHTML = `
        <input type="text" name="capitulos[${contadorCapitulo - 1}][titulo]" value="Capítulo ${contadorCapitulo}" placeholder="Título do Capítulo ${contadorCapitulo}" required>
        <textarea name="capitulos[${contadorCapitulo - 1}][conteudo]" placeholder="Conteúdo do Capítulo ${contadorCapitulo}" required></textarea>
        <button type="button" class="btn-remover-capitulo" onclick="removerCapitulo(this)">Remover</button>
    `;
    container.appendChild(novoCapitulo);
}

// Função para remover um capítulo
function removerCapitulo(botao) {
    const capituloDiv = botao.closest('.capitulo');
    let nomeCapitulo = capituloDiv.querySelector('input').value;
    if (nomeCapitulo === "") { nomeCapitulo = `Capítulo ${capituloDiv.getAttribute('data-index')}`; }
    const mensagem = `Você está prestes a remover o capítulo: ${nomeCapitulo}. Deseja continuar?`;
    if (confirm(mensagem)) {
        // Remove o capítulo do DOM
        capituloDiv.remove();
    }

    // Reorganiza os índices após remoção
    const capitulos = document.querySelectorAll('#capitulos-container .capitulo');
    capitulos.forEach((cap, index) => {
        cap.setAttribute('data-index', index + 1);
        cap.querySelector('input').name = `capitulos[${index}][titulo]`;
        // Verifica se o input tem o valor igual ao original (Capítulo X) ou se está vazio e atualiza o valor
        if (cap.querySelector('input').value === `Capítulo ${index + 2}` || cap.querySelector('input').value === '') {
            cap.querySelector('input').value = `Capítulo ${index + 1}`
        }
        cap.querySelector('input').placeholder = `Título do Capítulo ${index + 1}`;
        cap.querySelector('textarea').name = `capitulos[${index}][conteudo]`;
        cap.querySelector('textarea').placeholder = `Conteúdo do Capítulo ${index + 1}`;
    });

    contadorCapitulo = capitulos.length; // Atualiza o contador para o próximo capítulo
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
document.querySelector('.btn-nova-historia').addEventListener('submit', (e) => {
    const titulo = document.querySelector('input[name="titulo"]').value.trim();
    const genero = document.querySelector('input[name="genero"]').value.trim();
    const resumo = document.querySelector('textarea[name="resumo"]').value.trim();
    const capitulos = Array.from(document.querySelectorAll('#capitulos-container .capitulo')).map(cap => ({
        titulo: cap.querySelector('input').value.trim(),
        conteudo: cap.querySelector('textarea').value.trim()
    }));

    if (!titulo || !genero || !resumo || capitulos.some(cap => !cap.titulo || !cap.conteudo)) {
        e.preventDefault();
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
});

// Cancelar a criação da nova história
document.querySelector('.btn-cancelar-nova-historia').addEventListener('click', () => {
    if (confirm('Tem certeza que deseja cancelar a criação da nova história?')) {
        window.location.href = '/profile'; // Redireciona para o perfil do usuário
    }
});

const dropdownSelect = document.getElementById('generos-select');
const dropdownOptions = document.getElementById('generos-options');

// Abre e fecha o dropdown
dropdownSelect.addEventListener('click', () => {
  dropdownOptions.classList.toggle('hidden');
});

// Fecha o dropdown ao clicar fora
document.addEventListener('click', (e) => {
  if (!dropdownSelect.contains(e.target) && !dropdownOptions.contains(e.target)) {
    dropdownOptions.classList.add('hidden');
  }
});

// Atualiza o texto do dropdown com os gêneros selecionados
function atualizarTextoSelecionado() {
  const selecionados = [...dropdownOptions.querySelectorAll('input[type=checkbox]:checked')].map(cb => cb.value);
  dropdownSelect.textContent = selecionados.length > 0 ? selecionados.join('; ') : 'Selecione os gêneros...';
}

// Atualiza texto ao clicar nos checkboxes
dropdownOptions.addEventListener('change', atualizarTextoSelecionado);