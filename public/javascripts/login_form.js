// Função para alternar a visibilidade da senha
function toggleSenha() {
  const senhaInput = document.querySelector('input[name="senha"]');
  const mostrarSenha = document.getElementById('mostrarSenha');

  if (mostrarSenha.checked) {
    senhaInput.type = 'text';
  } else {
    senhaInput.type = 'password';
  }
}

// Validar o formulário de login
const form = document.getElementById('loginForm');

form?.addEventListener('submit', function (e) {
  const email = this.querySelector('input[name="email"]')?.value.trim();
  const senha = this.querySelector('input[name="senha"]')?.value.trim();

  if (!email || !senha) {
    e.preventDefault();
    alert('Email ou senha incorretos.');
  }
});