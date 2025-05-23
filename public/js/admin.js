const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

if (!user || user.type !== 'ADMIN') {
  showNotification("Acesso restrito!" , 'erro');
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
    showNotification("Erro ao adicionar produto." , 'erro');
  }
});

async function carregarProdutos() {
  const res = await fetch('http://localhost:3001/api/products');
  const produtos = await res.json();

  listaProdutos.innerHTML = produtos.map(prod => `
    <div class="produto" data-id="${prod.id}">
      <h3 class="view-name">${prod.name}</h3>
      <input type="text" class="edit-name" value="${prod.name}" style="display:none;" />

      <p class="view-price">R$ ${prod.price.toFixed(2)}</p>
      <input type="number" class="edit-price" value="${prod.price}" style="display:none;" />

      <p class="view-category">${prod.category}</p>
      <input type="text" class="edit-category" value="${prod.category}" style="display:none;" />

      <img src="${prod.image}" alt="${prod.name}" width="100" class="view-image" />
      <input type="text" class="edit-image" value="${prod.image}" style="display:none;" />

      <button onclick="editarProduto('${prod.id}')">✏️ Editar</button>
      <button class="btn-salvar" onclick="salvarEdicaoProduto('${prod.id}')" style="display:none;">💾 Salvar</button>
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

function editarProduto(id) {
  const container = document.querySelector(`.produto[data-id="${id}"]`);

  container.querySelectorAll('.view-name, .view-price, .view-category, .view-image').forEach(el => el.style.display = 'none');
  container.querySelectorAll('.edit-name, .edit-price, .edit-category, .edit-image').forEach(el => el.style.display = 'inline-block');
  container.querySelector('.btn-salvar').style.display = 'inline-block';
}

async function salvarEdicaoProduto(id) {
  const container = document.querySelector(`.produto[data-id="${id}"]`);

  const name = container.querySelector('.edit-name').value;
  const price = parseFloat(container.querySelector('.edit-price').value);
  const category = container.querySelector('.edit-category').value;
  const image = container.querySelector('.edit-image').value;

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
    carregarProdutos(); 
  } else {
    showNotification("Erro ao atualizar o produto." ,'erro');
  }
}
function showNotification(message, type) {
    const notification = document.getElementById('notificacao');
    notification.textContent = message;
    notification.style.backgroundColor = type === 'sucesso' ? '#4CAF50' : '#f44336';
    notification.classList.add('show');
    notification.classList.remove('hidden');

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.classList.add('hidden');
      }, 400);
    }, 5000);
  }
carregarProdutos();
