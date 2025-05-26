document.addEventListener("DOMContentLoaded", () => {
  const cartItems = document.getElementById("cart-items");

  window.products = []; // products global

async function fetchProducts() {
  try {
    const res = await fetch('http://localhost:3001/api/products');
    window.products = await res.json();
    console.log("Produtos carregados:", window.products); // 👈 Aqui
    updateCart();
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
  }
}


  

  window.updateCart = function() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartItems.innerHTML = "";

    if (cart.length === 0) {
      cartItems.innerHTML = "<p>Seu carrinho está vazio.</p>";
      return;
    }

    let total = 0;
    let totalItems = 0;

    cart.forEach(item => {
      const product = window.products.find(p => p.id === item.id);
      if (!product) return;

      total += product.price * item.quantity;
      totalItems += item.quantity;

      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image" />
        <div class="cart-info">
          <p class="product-name">${product.name}</p>
          <p class="product-price">R$ ${product.price.toFixed(2)}</p>
        </div>
        <div class="quantity-controls">
          <button class="adjust-quantity" data-id="${product.id}" data-action="decrease">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="adjust-quantity" data-id="${product.id}" data-action="increase">+</button>
        </div>
        <p class="total">R$ ${(product.price * item.quantity).toFixed(2)}</p>
        <button class="remove-item" data-id="${product.id}">🗑️</button>
      `;

      cartItems.appendChild(div);
    });

    const totalDiv = document.createElement("div");
    totalDiv.innerHTML = `
      <hr>
      <p><strong>Total de Produtos: ${totalItems}</strong></p>
      <p><strong>Total: R$ ${total.toFixed(2)}</strong></p>
    `;
    cartItems.appendChild(totalDiv);

    const clearButton = document.createElement("button");
    clearButton.id = "clear-cart";
    clearButton.textContent = "🗑️ Limpar Carrinho";
    clearButton.style.marginTop = "20px";
    clearButton.style.backgroundColor = "#ff4d4d";
    clearButton.style.color = "white";
    clearButton.style.padding = "10px 16px";
    clearButton.style.border = "none";
    clearButton.style.borderRadius = "6px";
    clearButton.style.cursor = "pointer";
    clearButton.addEventListener("click", () => {
      localStorage.removeItem("cart");
      updateCart();
      showNotification("Carrinho Limpo", "sucesso");
    });
    cartItems.appendChild(clearButton);

    document.querySelectorAll(".adjust-quantity").forEach(button => {
      button.addEventListener("click", () => {
       const id = button.getAttribute("data-id");

        const action = button.getAttribute("data-action");
        adjustQuantity(id, action);
      });
    });

    document.querySelectorAll(".remove-item").forEach(button => {
      button.addEventListener("click", () => {
       const id = button.getAttribute("data-id");

        removeItem(id);
      });
    });
  };

  function adjustQuantity(productId, action) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    if (action === "increase") {
      item.quantity += 1;
    } else if (action === "decrease" && item.quantity > 1) {
      item.quantity -= 1;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
  }

  function removeItem(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
  }

  fetchProducts(); // chama fetch para carregar produtos e só depois atualiza carrinho
});
