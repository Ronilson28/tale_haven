const dropdownSelect = document.getElementById('generos-select');
const dropdownOptions = document.getElementById('generos-options');

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

    // Regex para validar o nome de usuário
    const regex = /^(?:[a-z][a-z0-9._]*|_+[a-z][a-z0-9._]*)$/;
    if (!regex.test(usuario)) {
      erros.push('Nome de usuário inválido! Exemplos válidos: "username123", "user.name", "user_name", "_username"');
    }

    const nomesReservados = ['login', 'logout', 'profile', 'sign_up', 'admin', 'moderacao', 'categorias', 'historias'];
    if (nomesReservados.includes(usuario)) {
      erros.push('Nome de usuário não permitido');
    }

    if (erros.length > 0) {
      e.preventDefault();
      alert(erros.join('\n'));
    }
  });
});

// Abre e fecha o dropdown
dropdownSelect.addEventListener('click', () => {
  dropdownOptions.classList.toggle('hidden');
});

// Fecha o dropdown ao clicar fora
document.addEventListener('click', (e) => {
  if (!dropdownSelect.contains(e.target) && !dropdownOptions.contains(e.target) && e.target !== inputNovoGenero && e.target !== btnAddNovo) {
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