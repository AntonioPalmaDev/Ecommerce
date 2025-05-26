document.addEventListener('DOMContentLoaded', () => {
  // TODO: TODO seu código aqui dentro

  const productList = document.getElementById('product-list');
  const searchBar = document.getElementById('search-bar');
  const sortSelect = document.getElementById('sort');
  const categoryLinks = document.querySelectorAll('.categorias nav a , .menu-list nav a');   

  let products = [];
  let filteredProducts = [];
  window.products = [];
window.updateCart = function() {
  const countElement = document.getElementById("cart-count");
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (totalItems > 0) {
    countElement.textContent = totalItems;
    countElement.style.display = 'inline-block';
  } else {
    countElement.style.display = 'none';
  }
};
  async function fetchProducts() {
    try {
      const res = await fetch('http://localhost:3001/api/products');
      products = await res.json();      // Corrigido: atualiza variável local
      window.products = products;       // Mantém variável global
      filteredProducts = products;
      renderProducts(filteredProducts);
      if (window.updateCart) window.updateCart(); // atualiza o carrinho após produtos carregarem
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

    setupAddToCartButtons(); // ativa os botões depois de renderizar
  }

  // Função para ativar os botões "Adicionar ao carrinho"
  function setupAddToCartButtons() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', e => {
        const id = e.target.dataset.id;

        addToCart(id);
      });
    });
  }

  // Função para adicionar produto no carrinho localStorage
  function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const itemIndex = cart.findIndex(item => item.id === productId); // deixe como string

  if (itemIndex > -1) {
    cart[itemIndex].quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  showNotification('Produto adicionado ao carrinho!', 'sucesso');
   updateCart();
}




// Lógica logout e exibir botão, dentro do DOMContentLoaded
const user = JSON.parse(localStorage.getItem('user'));
const logoutBtns = document.querySelectorAll('.logout-btn'); // Pega todos os botões
const btnAdmin = document.getElementById('btn-admin');

if (!user) {
  window.location.href = '/login.html';
} else {
  logoutBtns.forEach(btn => {
    
    btn.addEventListener('click', () => {
      localStorage.clear();
      window.location.href = '/login.html';
    });
  });

  if (btnAdmin && user.type !== 'ADMIN') {
    btnAdmin.style.display = 'none';
  }
}




  // Filtros e buscas
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

  searchBar.addEventListener('input', () => {
    const term = searchBar.value.toLowerCase();
    filteredProducts = products.filter(p => p.name.toLowerCase().includes(term));
    renderProducts(filteredProducts);
  });

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
        filteredProducts = [...products];
    }
    renderProducts(filteredProducts);
  });
const hamburguerBtn = document.getElementById('hamburguer-btn');
const menuLateral = document.getElementById('menu-lateral');
const btnFecharMenu = document.getElementById('close-menu');

// Abre/fecha o menu com o botão hambúrguer
hamburguerBtn.addEventListener("click", () => {
  menuLateral.classList.toggle("open");
});

// Fecha o menu ao clicar fora dele
document.addEventListener('click', (event) => {
  if (
    menuLateral.classList.contains('open') &&
    !menuLateral.contains(event.target) &&
    !hamburguerBtn.contains(event.target)
  ) {
    menuLateral.classList.remove('open');
  }
});

// Fecha o menu com o botão "X"
btnFecharMenu.addEventListener('click', () => {
  menuLateral.classList.remove('open');
});

  updateCart();

  // Finalmente chama fetch para iniciar o app
  fetchProducts();
});
