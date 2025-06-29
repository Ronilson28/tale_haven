const dropdownSelect = document.getElementById('generos-select');
const dropdownOptions = document.getElementById('generos-options');
const inputNovoGenero = document.getElementById('novo-genero');
const btnAddNovo = document.getElementById('btn-add-novo');

// Função para alternar visibilidade da senha
function toggleSenha(inputName, iconElement) {
  const input = document.querySelector(`input[name="${inputName}"]`);
  if (!input) return;
  const img = iconElement.querySelector('img');
  if (input.type === 'password') {
    input.type = 'text';
    img.src = "/icons/eye-icon-open.png";
    img.alt = "Esconder senha";
  } else {
    input.type = 'password';
    img.src = '/icons/eye-icon-closed.png';
    img.alt = "Mostrar senha";
  }
}

// Validação do formulário de cadastro
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cadastroForm');
  if (!form) return;

    form.addEventListener('submit', function (e) {
    const email = form.querySelector('input[name="email"]').value.trim();
    const confirmEmail = form.querySelector('input[name="confirmEmail"]').value.trim();
    const senha = form.querySelector('input[name="senha"]').value;
    const confirmSenha = form.querySelector('input[name="confirmSenha"]').value;
    const usuario = form.querySelector('input[name="usuario"]').value.trim();
    
    const erros = [];
  
    if (senha.length < 8) {
      e.preventDefault();
      erros.push('A senha deve ter pelo menos 8 caracteres');
    }

    if (email !== confirmEmail) {
      e.preventDefault();
      erros.push('Os e-mails não coincidem');
    }

    if (senha !== confirmSenha) {
      e.preventDefault();
      erros.push('As senhas não coincidem');
    }

    if (inputNovoGenero.value.trim() /* && !btnAddNovo.classList.contains('added')*/) {
      e.preventDefault();
      erros.push('Novo gênero não adicionado! Por favor, adicione-o ou limpe o campo.');
    }

    // Regex para validar o nome de usuário
    const regex = /^(?:[a-z][a-z0-9._]*|_+[a-z][a-z0-9._]*)$/;
    if (!regex.test(usuario)) {
      erros.push('Nome de usuário inválido! Exemplos válidos: "username123", "user.name", "user_name", "_username"');
    }

    if (erros.length > 0) {
      e.preventDefault();
      alert(erros.join('\n'));
    }
  });
});

// Seleciona os ícones de senha
dropdownSelect.addEventListener('click', () => {
  dropdownOptions.classList.toggle('hidden');
});

// Fecha o dropdown ao clicar fora
document.addEventListener('click', (e) => {
  if (!dropdownSelect.contains(e.target) && !dropdownOptions.contains(e.target) && e.target !== inputNovoGenero && e.target !== btnAddNovo) {
    dropdownOptions.classList.add('hidden');
  }
});

// Adiciona novo gênero ao dropdown
btnAddNovo.addEventListener('click', () => {
  const novoGenero = inputNovoGenero.value.trim();
  if (!novoGenero) return alert('Digite um gênero para adicionar.');

  // Verifica se já existe
  const inputs = dropdownOptions.querySelectorAll('input[type=checkbox]');
  for (const input of inputs) {
    if (input.value.toLowerCase() === novoGenero.toLowerCase()) {
      alert('Esse gênero já existe.');
      return;
    }
  }

  // Cria novo checkbox (novo gênero)
  const id = 'gen-' + novoGenero.toLowerCase().replace(/\s+/g, '-');

  // Cria elementos para o novo gênero
  const div = document.createElement('div');
  div.className = 'option';
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = id;
  checkbox.name = 'preferenciasGenero';
  checkbox.value = novoGenero;
  checkbox.checked = true;
  const label = document.createElement('label');
  label.htmlFor = id;
  label.textContent = novoGenero;

  div.appendChild(checkbox);
  div.appendChild(label);

  dropdownOptions.appendChild(div);

  inputNovoGenero.value = '';
  dropdownOptions.classList.remove('hidden');

  atualizarTextoSelecionado();
});

// Atualiza o texto do dropdown com os gêneros selecionados
function atualizarTextoSelecionado() {
  const selecionados = [...dropdownOptions.querySelectorAll('input[type=checkbox]:checked')].map(cb => cb.value);
  dropdownSelect.textContent = selecionados.length > 0 ? selecionados.join('; ') : 'Selecione os gêneros...';
}

// Atualiza texto ao clicar nos checkboxes
dropdownOptions.addEventListener('change', atualizarTextoSelecionado);