// script.js — safe, static-only version

document.addEventListener("DOMContentLoaded", () => {
  const productGrid = document.getElementById("product-grid");
  const newGrid = document.getElementById("new-grid");
  const cartBtn = document.getElementById("btn-cart");
  const cart = document.getElementById("cart");
  const cartClose = document.getElementById("cart-close");
  const overlay = document.getElementById("overlay");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartSubtotal = document.getElementById("cart-subtotal");
  const clearBtn = document.getElementById("btn-clear");
  const checkoutBtn = document.getElementById("btn-checkout");
  const menuBtn = document.getElementById("btn-menu");
  const menuCloseBtn = document.getElementById("btn-menu-close");
  const mobileMenu = document.getElementById("mobile-menu");
  const yearSpan = document.getElementById("year");

  const products = [
    { id: 1, title: "Atomic Habits", price: 15.99, rating: 4.8, category: "self-help", img: "assets/atomic_habits.jpg" },
    { id: 2, title: "Deep Work", price: 12.50, rating: 4.7, category: "productivity", img: "assets/deep_work.jpg" },
    { id: 3, title: "The Lean Startup", price: 18.00, rating: 4.6, category: "business", img: "assets/lean_startup.jpg" },
    { id: 4, title: "Clean Code", price: 22.00, rating: 4.9, category: "tech", img: "assets/clean_code.jpg" },
    { id: 5, title: "Zero to One", price: 14.00, rating: 4.5, category: "business", img: "assets/zero_to_one.jpg" },
    { id: 6, title: "The Pragmatic Programmer", price: 25.00, rating: 4.9, category: "tech", img: "assets/pragmatic_programmer.jpg" }
  ];

  let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  // Render product cards
  function renderProducts(grid, items) {
    grid.innerHTML = "";
    items.forEach(p => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${p.img}" alt="${p.title}" class="card__img"/>
        <div class="card__body">
          <h3 class="card__title">${p.title}</h3>
          <p class="card__price">$${p.price.toFixed(2)}</p>
          <p class="card__rating">⭐ ${p.rating}</p>
          <button class="btn btn--primary btn--small" data-id="${p.id}">Add to Cart</button>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  renderProducts(productGrid, products);
  renderProducts(newGrid, products.slice(-3));

  // Cart helpers
  function updateCart() {
    cartItemsContainer.innerHTML = "";
    let subtotal = 0;

    cartItems.forEach(item => {
      subtotal += item.price * item.qty;
      const row = document.createElement("div");
      row.className = "cart__item";
      row.innerHTML = `
        <div>
          <strong>${item.title}</strong><br>
          $${item.price.toFixed(2)} × ${item.qty}
        </div>
        <button class="btn__icon btn__remove" data-id="${item.id}" aria-label="Remove item">✖</button>
      `;
      cartItemsContainer.appendChild(row);
    });

    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    cartCount.textContent = cartItems.reduce((a, b) => a + b.qty, 0);
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }

  function addToCart(id) {
    const product = products.find(p => p.id == id);
    const existing = cartItems.find(item => item.id == id);
    if (existing) {
      existing.qty += 1;
    } else {
      cartItems.push({ ...product, qty: 1 });
    }
    updateCart();
  }

  // Event delegation
  document.body.addEventListener("click", e => {
    if (e.target.matches("[data-id]")) {
      addToCart(e.target.dataset.id);
    }
    if (e.target.matches(".btn__remove")) {
      const id = e.target.dataset.id;
      cartItems = cartItems.filter(i => i.id != id);
      updateCart();
    }
  });

  // Cart toggles
  cartBtn.addEventListener("click", () => {
    cart.classList.add("open");
    overlay.classList.add("active");
  });
  cartClose.addEventListener("click", () => {
    cart.classList.remove("open");
    overlay.classList.remove("active");
  });
  overlay.addEventListener("click", () => {
    cart.classList.remove("open");
    overlay.classList.remove("active");
    mobileMenu.classList.remove("active");
  });

  // Clear & checkout
  clearBtn.addEventListener("click", () => {
    cartItems = [];
    updateCart();
  });
  checkoutBtn.addEventListener("click", () => {
    alert("Checkout not implemented. This is a demo.");
  });

  // Mobile menu
  menuBtn.addEventListener("click", () => mobileMenu.classList.add("active"));
  menuCloseBtn.addEventListener("click", () => mobileMenu.classList.remove("active"));

  // Footer year
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  updateCart();
});
