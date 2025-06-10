document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const nome = document.getElementById('nome').value.trim();

  const letras = nome.match(/[a-zA-ZÀ-ÿ]/g);
  const numLetras = letras ? letras.length : 0;
  const temNumero = /\d/.test(nome);

  if (!nome) {
    alert('Por favor, digite seu nome.');
    return;
  }
  if (temNumero) {
    alert('O nome não pode conter números.');
    return;
  }
  if (numLetras < 3) {
    alert('O nome deve conter pelo menos 3 letras.');
    return;
  }

  localStorage.setItem('usuarioLogado', nome);
  window.location.href = 'index.html';
});
