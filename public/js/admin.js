const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

if (!user || user.type !== 'ADMIN') {
  showNotification("Acesso restrito!", 'erro');
  window.location.href = "index.html";
}

const form = document.getElementById('form-add-produto');
const listaProdutos = document.getElementById('lista-produtos');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const price = parseFloat(document.getElementById('price').value);
  const category = document.getElementById('category').value;
  const image = document.getElementById('image').value;

  const response = await fetch('http://localhost:3001/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ name, price, category, image })
  });

  if (response.ok) {
    showNotification("Produto adicionado com sucesso!", 'sucesso');
    form.reset();
    carregarProdutos();
  } else {
    showNotification("Erro ao adicionar produto.", 'erro');
  }
});

async function carregarProdutos() {
  const res = await fetch('http://localhost:3001/api/products');
  const produtos = await res.json();

  listaProdutos.innerHTML = produtos.map(prod => `
    <div class="produto" data-id="${prod.id}">
      <h3 class="view-name">${prod.name}</h3>
      <p class="view-price">R$ ${prod.price.toFixed(2)}</p>
      <p class="view-category">${prod.category}</p>
      <img src="${prod.image}" alt="${prod.name}" width="100" class="view-image" />

      <button onclick="editarProduto('${prod.id}')">✏️ Editar</button>
      <button onclick="excluirProduto('${prod.id}')">🗑️ Excluir</button>
    </div>
  `).join('');
}

async function excluirProduto(id) {
  if (!confirm("Tem certeza que deseja excluir este produto?")) return;

  const response = await fetch(`http://localhost:3001/api/products/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (response.ok) {
    showNotification("Produto excluído.", 'sucesso');
    carregarProdutos();
  } else {
    showNotification("Erro ao excluir.", 'erro');
  }
}

// Variável global para manter o ID do produto sendo editado
let produtoAtualEditando = null;

function editarProduto(id) {
  const container = document.querySelector(`.produto[data-id="${id}"]`);
  produtoAtualEditando = id;

  document.getElementById('editNome').value = container.querySelector('.view-name').textContent;
  document.getElementById('editPreco').value = parseFloat(container.querySelector('.view-price').textContent.replace("R$ ", ""));
  document.getElementById('editCategoria').value = container.querySelector('.view-category').textContent;
  document.getElementById('editImagem').value = container.querySelector('img').src;

  document.getElementById('modalOverlay').classList.add('flex');
}

function fecharModal() {
  document.getElementById('modalOverlay').classList.remove('flex');
  produtoAtualEditando = null;
}

async function salvarEdicao() {
  const id = produtoAtualEditando;
  const name = document.getElementById('editNome').value;
  const price = parseFloat(document.getElementById('editPreco').value);
  const category = document.getElementById('editCategoria').value;
  const image = document.getElementById('editImagem').value;

  const response = await fetch(`http://localhost:3001/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ name, price, category, image })
  });

  if (response.ok) {
    showNotification("Produto atualizado com sucesso!", 'sucesso');
    fecharModal();
    carregarProdutos();
  } else {
    showNotification("Erro ao atualizar o produto.", 'erro');
  }
}


carregarProdutos();
