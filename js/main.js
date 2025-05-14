
document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("product-list");

 
  if (products && Array.isArray(products)) {
    aplicarFiltros();

  }
});


function addToCart(productId) {
 
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  
  const productIndex = cart.findIndex(item => item.id === productId);

  
  if (productIndex !== -1) {
    cart[productIndex].quantity += 1;
  } else {
   
    cart.push({ id: productId, quantity: 1 });
  }

 
  localStorage.setItem("cart", JSON.stringify(cart));

  
  showNotification('Produto adicionado ao carrinho!', 'sucesso');
}

// Função para exibir notificações
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



// Barra de pesquisa
const searchBar = document.getElementById("search-bar");
const searchButton = document.getElementById("search-button");

searchButton.addEventListener("click", searchProducts);
searchBar.addEventListener("input", searchProducts); 

function searchProducts() {
  const query = searchBar.value.toLowerCase();

  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(query)
  );

  
  displayProducts(filteredProducts);
}

function displayProducts(productsToDisplay) {
  const productList = document.getElementById("product-list"); 
  productList.innerHTML = ""; 

  productsToDisplay.forEach(product => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <h2>${product.name}</h2>
      <img src="${product.image}" alt="${product.name}" width="150">
      <p>R$ ${product.price.toFixed(2)}</p>
      <button onclick="addToCart(${product.id})">Adicionar ao Carrinho</button>
    `;
    productList.appendChild(div);
  });
}

document.querySelectorAll(".categorias a").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();


    document.querySelectorAll(".categorias a").forEach(l => l.classList.remove("active"));
    e.target.classList.add("active");

    const category = e.target.dataset.category;

    if (category === "todos") {
      aplicarFiltros();
; 
    } else {
      const filtered = products.filter(product => product.category === category);
      displayProducts(filtered);
    }
  });
});

const sortSelect = document.getElementById("sort");

sortSelect.addEventListener("change", () => {
  aplicarFiltros();
});
function aplicarFiltros() {
  const categoriaAtiva = document.querySelector(".categorias a.active")?.dataset.category || "todos";
  const sortOption = sortSelect.value;

  let produtosFiltrados = categoriaAtiva === "todos"
    ? [...products]
    : products.filter(p => p.category === categoriaAtiva);

  // Ordenação
  switch (sortOption) {
    case "preco-asc":
      produtosFiltrados.sort((a, b) => a.price - b.price);
      break;
    case "preco-desc":
      produtosFiltrados.sort((a, b) => b.price - a.price);
      break;
    case "nome-asc":
      produtosFiltrados.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "nome-desc":
      produtosFiltrados.sort((a, b) => b.name.localeCompare(a.name));
      break;
  }

  displayProducts(produtosFiltrados);
}
