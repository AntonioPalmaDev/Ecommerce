const productList = document.getElementById('product-list');
const searchBar = document.getElementById('search-bar');
const sortSelect = document.getElementById('sort');
const categoryLinks = document.querySelectorAll('.categorias nav a');

let products = [];
let filteredProducts = [];

async function fetchProducts() {
  try {
    const res = await fetch('http://localhost:3001/api/products');
    products = await res.json();
    filteredProducts = products;
    renderProducts(filteredProducts);
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
  }
}

function renderProducts(productsToRender) {
  productList.innerHTML = '';

  if (productsToRender.length === 0) {
    productList.innerHTML = '<p>Nenhum produto encontrado.</p>';
    return;
  }

  productsToRender.forEach(product => {
    productList.innerHTML += `
      <article class="product">
        <img src="${encodeURI(product.image)}" alt="${product.name}">

        <h3>${product.name}</h3>
        <p>R$ ${product.price.toFixed(2)}</p>
        <button data-id="${product.id}" class="add-to-cart">Adicionar ao carrinho</button>
      </article>
    `;
  });
}

// Filtro por categoria
categoryLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    categoryLinks.forEach(l => l.classList.remove('active'));
    e.target.classList.add('active');

    const category = e.target.dataset.category;

    if (category === 'todos') {
      filteredProducts = products;
    } else {
      filteredProducts = products.filter(p => p.category === category);
    }
    renderProducts(filteredProducts);
  });
});

// Busca por nome
searchBar.addEventListener('input', () => {
  const term = searchBar.value.toLowerCase();
  filteredProducts = products.filter(p => p.name.toLowerCase().includes(term));
  renderProducts(filteredProducts);
});

// Ordenação
sortSelect.addEventListener('change', () => {
  switch (sortSelect.value) {
    case 'preco-asc':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'preco-desc':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'nome-asc':
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'nome-desc':
      filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
      break;
    default:
      filteredProducts = [...products]; // padrão, sem ordenação
  }
  renderProducts(filteredProducts);
});
const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

if (user) {
 // document.getElementById('user-info').innerText = `Olá, ${user.name}`;
  document.getElementById('logout-btn').style.display = 'inline-block';
} else {
  window.location.href = '/login.html';
}

document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = '/login.html';
});


// Inicialização
fetchProducts();
