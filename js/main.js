// Espera o DOM ser carregado para inserir os produtos na tela
document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("product-list");

  // Certifique-se que a lista de produtos está disponível
  if (products && Array.isArray(products)) {
    displayProducts(products); // Exibe todos os produtos inicialmente
  }
});

// Define a função addToCart fora do DOMContentLoaded
function addToCart(productId) {
  // Recupera o carrinho ou inicializa como um array vazio
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Verifica se o produto já está no carrinho
  const productIndex = cart.findIndex(item => item.id === productId);

  // Se o produto já estiver no carrinho, aumenta a quantidade
  if (productIndex !== -1) {
    cart[productIndex].quantity += 1;
  } else {
    // Caso o produto não esteja no carrinho, adiciona o item com quantidade 1
    cart.push({ id: productId, quantity: 1 });
  }

  // Armazena o carrinho atualizado no localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Exibe a notificação
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
    }, 400); // espera a transição acabar
  }, 5000);
}

// Supondo que seus produtos estejam armazenados na variável 'products'

// Barra de pesquisa
const searchBar = document.getElementById("search-bar");
const searchButton = document.getElementById("search-button");

searchButton.addEventListener("click", searchProducts);
searchBar.addEventListener("input", searchProducts); // Para pesquisa em tempo real

function searchProducts() {
  const query = searchBar.value.toLowerCase();

  // Filtra os produtos pela pesquisa
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(query)
  );

  // Exibe os produtos filtrados
  displayProducts(filteredProducts);
}

function displayProducts(productsToDisplay) {
  const productList = document.getElementById("product-list"); // Garantir que estamos usando o elemento correto
  productList.innerHTML = ""; // Limpa a lista atual de produtos

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
