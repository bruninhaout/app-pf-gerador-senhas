let historico = JSON.parse(localStorage.getItem('senhas')) || [];
renderTabela();

function gerarSenha() {
  const length = parseInt(document.getElementById('length').value);
  const useLetters = document.getElementById('letters').checked;
  const useNumbers = document.getElementById('numbers').checked;
  const useSymbols = document.getElementById('symbols').checked;

  if (!useLetters && !useNumbers && !useSymbols) return alert('Selecione ao menos um tipo de caractere');

  const letras = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numeros = '0123456789';
  const simbolos = '!@#$%^&*()_+{}[]<>?';

  let chars = '';
  if (useLetters) chars += letras;
  if (useNumbers) chars += numeros;
  if (useSymbols) chars += simbolos;

  let senha = '';
  for (let i = 0; i < length; i++) {
    senha += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  document.getElementById('senha-gerada').innerText = senha;
  document.getElementById('senha-box').style.display = 'flex';

  const tipos = [];
  if (useLetters) tipos.push('letras');
  if (useNumbers) tipos.push('números');
  if (useSymbols) tipos.push('símbolos');

  historico.push({ id: Date.now(), senha, tamanho: length, tipos });
  localStorage.setItem('senhas', JSON.stringify(historico));
  renderTabela();
}

function copiarSenha() {
  const senha = document.getElementById('senha-gerada').innerText;
  navigator.clipboard.writeText(senha);
  alert('Senha copiada!');
}

function renderTabela() {
  const tbody = document.getElementById('historico');
  tbody.innerHTML = '';
  historico.forEach((item) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.senha}</td>
      <td>${item.tamanho}</td>
      <td>${item.tipos.join(', ')}</td>
      <td>
        <button onclick="alert('Senha: ${item.senha}')">🔍</button>
        <button onclick="atualizar(${item.id})">🔄</button>
        <button onclick="excluir(${item.id})">❌</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

function confirmarExclusao(id) {
 var x;
 var r=confirm("Realmente quer excluir a senha?");
 if(r==true){
  x = "Senha excluída";
  historico = historico.filter(item => item.id !== id);
  localStorage.setItem('senhas', JSON.stringify(historico));
  renderTabela();
 }
 else{
  x="Você pressionou Cancelar!";
 }
 document.getElementById(id).innerHTML=x;
}

function excluir(id) {
  historico = historico.filter(item => item.id !== id);
  localStorage.setItem('senhas', JSON.stringify(historico));
  confirmarExclusao();
  renderTabela();
}

let idParaAtualizar = null;

function atualizar(id) {
  const item = historico.find(x => x.id === id);
  if (!item) return;

  document.getElementById('length').value = item.tamanho;
  atualizarValorSlide(item.tamanho); // Atualiza o valor visual do slider
  document.getElementById('letters').checked = item.tipos.includes('letras');
  document.getElementById('numbers').checked = item.tipos.includes('números');
  document.getElementById('symbols').checked = item.tipos.includes('símbolos');

  document.getElementById('senha-gerada').innerText = item.senha;
  document.getElementById('senha-box').style.display = 'flex';

  idParaAtualizar = id;
  mostrarToast('Modo edição ativado. Clique em "Gerar Senha" para salvar.', '✏️');
}


function atualizarValorSlide(valor) {
  document.getElementById('slider-value').innerText = valor;
}

