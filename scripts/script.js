// Verifica se o usuário está logado
const usuario = localStorage.getItem('usuarioLogado');
if (!usuario) {
  window.location.href = 'login.html';
}

// Exibir o nome do usuário na página
const usuarioElemento = document.getElementById('usuario-logado');
if (usuarioElemento && usuario) {
  usuarioElemento.textContent = `Olá, ${usuario}!`;
}


const chaveSenhas = `senhas_${usuario}`;
let historico = JSON.parse(localStorage.getItem(chaveSenhas)) || [];

let idParaAtualizar = null;

renderTabela();

// Evento botão logout
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('usuarioLogado');
      window.location.href = 'login.html';
    });
  }
});

function gerarSenha() {
  const length = parseInt(document.getElementById('length').value);
  const useLetters = document.getElementById('letters').checked;
  const useNumbers = document.getElementById('numbers').checked;
  const useSymbols = document.getElementById('symbols').checked;

  if (!useLetters && !useNumbers && !useSymbols) {
    alert('Selecione ao menos um tipo de caractere.');
    return;
  }

  const letras = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numeros = "0123456789";
  const simbolos = "!@#$%^&*()_+{}[]<>?";

  let chars = "";
  if (useLetters) chars += letras;
  if (useNumbers) chars += numeros;
  if (useSymbols) chars += simbolos;

  let senha = "";
  for (let i = 0; i < length; i++) {
    senha += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  document.getElementById('senha-gerada').textContent = senha;
  document.getElementById('senha-box').style.display = 'flex';

  const tipos = [];
  if (useLetters) tipos.push('letras');
  if (useNumbers) tipos.push('números');
  if (useSymbols) tipos.push('símbolos');

  if (idParaAtualizar !== null) {
    const index = historico.findIndex(item => item.id === idParaAtualizar);
    if (index !== -1) {
      historico[index] = { id: idParaAtualizar, senha, tamanho: length, tipos };
      mostrarToast("Senha alterada com sucesso! ✏️");
    }
    idParaAtualizar = null;
  } else {
    historico.push({ id: Date.now(), senha, tamanho: length, tipos });
  }

  localStorage.setItem(chaveSenhas, JSON.stringify(historico));

  renderTabela();
}

function copiarSenha() {
  const senha = document.getElementById('senha-gerada').textContent;
  if (!senha) {
    alert('Nenhuma senha para copiar.');
    return;
  }
  navigator.clipboard.writeText(senha);
  alert('Senha copiada!');
}

function renderTabela() {
  const tbody = document.getElementById('historico');
  tbody.innerHTML = '';

  historico.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
    <td data-label="Senha">${item.senha}</td>
    <td data-label="Tamanho">${item.tamanho}</td>
    <td data-label="Tipos">${item.tipos.join(', ')}</td>
    <td data-label="Ações">
      <button onclick="alert('Senha: ${item.senha}')">🔍</button>
      <button onclick="atualizar(${item.id})">🔄</button>
      <button onclick="excluir(${item.id})">❌</button>
    </td>
  `;
    tbody.appendChild(tr);
  });
}

function excluir(id) {
  if (confirm('Deseja excluir essa senha?')) {
    historico = historico.filter(item => item.id !== id);
    localStorage.setItem(chaveSenhas, JSON.stringify(historico));

    renderTabela();
  }
}

function atualizar(id) {
  const item = historico.find(x => x.id === id);
  if (!item) return;

  document.getElementById('length').value = item.tamanho;
  atualizarValorSlide(item.tamanho);

  document.getElementById('letters').checked = item.tipos.includes('letras');
  document.getElementById('numbers').checked = item.tipos.includes('números');
  document.getElementById('symbols').checked = item.tipos.includes('símbolos');

  document.getElementById('senha-gerada').textContent = item.senha;
  document.getElementById('senha-box').style.display = 'flex';

  idParaAtualizar = id;

  mostrarToast("Modo edição ativado. Clique em 'Gerar Senha' para salvar. ✏️");
}

function atualizarValorSlide(valor) {
  document.getElementById('slider-value').innerText = valor;
}

function mostrarToast(mensagem) {
  const toast = document.createElement('div');
  toast.textContent = mensagem;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.backgroundColor = '#333';
  toast.style.color = '#fff';
  toast.style.padding = '10px 15px';
  toast.style.borderRadius = '5px';
  toast.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
  toast.style.zIndex = 1000;
  toast.style.fontSize = '14px';
  toast.style.opacity = '0';
  toast.style.transition = 'opacity 0.3s ease';

  document.body.appendChild(toast);
  setTimeout(() => toast.style.opacity = '1', 100);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
