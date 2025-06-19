let cart = []; // Carrito de productos
let totalPrice = 0;

// Función para agregar productos al carrito
function addToCart(product, price) {
  const productIndex = cart.findIndex(item => item.product === product);
  if (productIndex > -1) {
    cart[productIndex].quantity += 1; // Aumentar cantidad si el producto ya está en el carrito
  } else {
    cart.push({ product, price, quantity: 1 });
  }
  updateCart(); // Actualizar la vista del carrito
}

// Función para actualizar la vista del carrito
function updateCart() {
  const cartItems = document.getElementById('float-cart-items');
  const cartTotal = document.getElementById('float-cart-total');
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Actualizar el número de artículos y el total en el carrito flotante
  cartItems.textContent = totalItems;
  cartTotal.textContent = `$${totalPrice.toFixed(2)}`;

  // Mostrar u ocultar el botón flotante del carrito
  const cartFloat = document.getElementById('cart-float');
  if (totalItems > 0) {
    cartFloat.classList.remove('empty');
    cartFloat.style.cursor = 'pointer';
  } else {
    cartFloat.classList.add('empty');
    cartFloat.style.cursor = 'not-allowed';
  }

  // Actualizar el modal del carrito
  updateCartModal();
}

// Función para actualizar la vista del carrito en el modal
function updateCartModal() {
  const cartItemsContainer = document.getElementById('cart-items-container');
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  let cartHTML = '';
  totalPrice = 0;

  cart.forEach((item, index) => {
    totalPrice += item.price * item.quantity;
    cartHTML += `
      <div class="cart-item">
        <span>${item.product} - $${item.price.toFixed(2)}</span>
        <div class="quantity-controls">
          <button onclick="decreaseQuantity(${index})">-</button>
          <span>${item.quantity}</span>
          <button onclick="increaseQuantity(${index})">+</button>
        </div>
        <button class="delete-button" onclick="removeFromCart(${index})">🗑️</button>
      </div>
    `;
  });

  cartItemsContainer.innerHTML = cartHTML;
  document.getElementById('total-price').textContent = `$${totalPrice.toFixed(2)}`;
  document.getElementById('total-items').textContent = totalItems;
}

// Función para incrementar la cantidad de un producto
function increaseQuantity(index) {
  cart[index].quantity += 1;
  updateCart();
}

// Función para disminuir la cantidad de un producto
function decreaseQuantity(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    cart.splice(index, 1); // Eliminar el producto si la cantidad es 1
  }
  updateCart();
}

// Función para eliminar un producto del carrito
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

// Función para mostrar el modal del carrito
function openCartForm() {
  if (cart.length > 0) { // Solo abre el modal si hay productos en el carrito
    const modal = document.getElementById('cart-modal');
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.style.opacity = '1';
    }, 10);
  }
}

// Función para cerrar el modal del carrito
function closeCartModal() {
  const modal = document.getElementById('cart-modal');
  modal.style.opacity = '0';
  setTimeout(() => {
    modal.style.display = 'none';
  }, 300);
}

// Función para enviar el pedido a WhatsApp
function sendOrderToWhatsApp() {
  const cartDetails = cart.map(item => `${item.product} x${item.quantity}`).join(', ');
  const totalMessage = `Pedido: ${cartDetails}\nTotal: $${totalPrice.toFixed(2)}`;
  const whatsappLink = `https://wa.me/1234567890?text=${encodeURIComponent(totalMessage)}`;
  window.open(whatsappLink, '_blank');
}

// Cargar productos dinámicamente
document.addEventListener('DOMContentLoaded', () => {
  const products = [
    { id: 1, category: 'alitas', name: 'Alitas Picantes', price: 80, description: 'Deliciosas alitas cubiertas con salsa picante.', image: 'alita1.jpg' },
    { id: 2, category: 'alitas', name: 'Alitas BBQ', price: 90, description: 'Alitas jugosas bañadas en salsa barbacoa.', image: 'alita2.jpg' },
    { id: 3, category: 'boneless', name: 'Boneless Picantes', price: 75, description: 'Boneless crujientes cubiertos con salsa picante.', image: 'boneless1.jpg' },
    { id: 4, category: 'boneless', name: 'Boneless BBQ', price: 85, description: 'Boneless suaves bañados en salsa barbacoa.', image: 'boneless2.jpg' },
    { id: 5, category: 'hamburguesas', name: 'Hamburguesa Clásica', price: 100, description: 'Hamburguesa de carne de res con lechuga, tomate y cebolla.', image: 'hamburguesa1.jpg' },
    { id: 6, category: 'hamburguesas', name: 'Hamburguesa BBQ', price: 110, description: 'Hamburguesa jugosa con salsa BBQ, queso y bacon.', image: 'hamburguesa2.jpg' },
    { id: 7, category: 'papas', name: 'Papas Fritas', price: 50, description: 'Papas fritas crujientes con salsa especial.', image: 'papas1.jpg' },
    { id: 8, category: 'papas', name: 'Papas con Queso', price: 60, description: 'Papas fritas cubiertas con queso derretido.', image: 'papas2.jpg' },
  ];

  // Función para cargar productos en una categoría
  function loadProducts(categoryId, products) {
    const productContainer = document.querySelector(`#${categoryId} .product-container`);
    products.forEach(product => {
      const productHTML = `
        <div class="product">
          <div class="product-info">
            <div class="product-title">${product.name}</div>
            <div class="product-price">$${product.price}</div>
            <div class="product-description">${product.description}</div>
          </div>
          <div class="product-img-container">
            <img src="${product.image}" alt="${product.name}">
            <button class="add-button" onclick="addToCart('${product.name}', ${product.price})">Agregar</button>
          </div>
        </div>
      `;
      productContainer.innerHTML += productHTML;
    });
  }

  // Cargar productos por categoría
  loadProducts('alitas', products.filter(p => p.category === 'alitas'));
  loadProducts('boneless', products.filter(p => p.category === 'boneless'));
  loadProducts('hamburguesas', products.filter(p => p.category === 'hamburguesas'));
  loadProducts('papas', products.filter(p => p.category === 'papas'));
});