/* Helpers & DOM refs */
const $ = (s, c = document) => c.querySelector(s);
const $all = (s, c = document) => Array.from(c.querySelectorAll(s));

const overlay = $("#overlay");
const mobileMenu = $("#mobile-menu");
const btnMenu = $("#btn-menu");
const btnMenuClose = $("#btn-menu-close");

const cartDrawer = $("#cart");
const btnCart = $("#btn-cart");
const btnCartClose = $("#cart-close");
const cartItemsEl = $("#cart-items");
const cartSubtotalEl = $("#cart-subtotal");
const cartCountEl = $("#cart-count");
const btnClear = $("#btn-clear");

const productGrid = $("#product-grid");
const newGrid = $("#new-grid");
const sortSelect = $("#sort");
const chipButtons = $all(".chip");
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* Catalog (GitHub-hosted images) */
const BASE = "https://raw.githubusercontent.com/YSayaovong/E-Commerce-Book-Store/main/assets/";

const CATALOG = [
  { id:"ctci", title:"Cracking the Coding Interview", price:14.95, oldPrice:59.95, rating:4.7, reviews:1243, img: BASE+"crack%20the%20coding%20interview.png", category:"tech", badge:"Sale" },
  { id:"atomic", title:"Atomic Habits", price:14.95, oldPrice:59.95, rating:4.8, reviews:1821, img: BASE+"atomic%20habits.jpg", category:"self-help", badge:"Bestseller" },
  { id:"goggins", title:"Can't Hurt Me", price:14.95, oldPrice:59.95, rating:4.6, reviews:976, img: BASE+"david%20goggins.jpeg", category:"self-help" },
  { id:"deepwork", title:"Deep Work", price:14.95, oldPrice:59.95, rating:4.7, reviews:1432, img: BASE+"deep%20work.jpeg", category:"productivity" },
  { id:"b1", title:"The 10X Rule", price:14.95, oldPrice:59.95, rating:4.5, reviews:512, img: BASE+"book-1.jpeg", category:"business" },
  { id:"b2", title:"Be Obsessed or Be Average", price:14.95, oldPrice:59.95, rating:4.3, reviews:288, img: BASE+"book-2.jpeg", category:"business" },
  { id:"b3", title:"Rich Dad Poor Dad", price:14.95, oldPrice:59.95, rating:4.6, reviews:2211, img: BASE+"book-3.jpeg", category:"business" },
  { id:"b4", title:"Cashflow Quadrant", price:14.95, oldPrice:59.95, rating:4.5, reviews:962, img: BASE+"book-4.jpeg", category:"business" },
  { id:"b5", title:"48 Laws of Power", price:14.95, oldPrice:59.95, rating:4.4, reviews:3044, img: BASE+"book-5.jpeg", category:"business" },
  { id:"b6", title:"The 5 Second Rule", price:14.95, oldPrice:59.95, rating:4.2, reviews:713, img: BASE+"book-6.jpeg", category:"self-help" },
  { id:"b7", title:"Your Next Five Moves", price:14.95, oldPrice:59.95, rating:4.5, reviews:533, img: BASE+"book-7.jpg", category:"business" },
  { id:"b8", title:"Mastery", price:14.95, oldPrice:59.95, rating:4.6, reviews:1240, img: BASE+"book-8.jpeg", category:"productivity" },
];

const NEW_IDS = ["b8","b7","b6","b5","b4","b3"];

/* Render */
function productCard(p){
  return `
  <article class="card" data-id="${p.id}" data-category="${p.category}">
    <div class="card__media">
      ${p.badge ? `<span class="badge">${p.badge}</span>` : ``}
      <img src="${p.img}" alt="${p.title}">
    </div>
    <div class="card__body">
      <div class="card__title">${p.title}</div>
      <div class="stars">
        ${'<i class="fas fa-star"></i>'.repeat(Math.floor(p.rating))}
        ${p.rating - Math.floor(p.rating) >= .5 ? '<i class="fas fa-star-half-alt"></i>' : ''}
        <span class="muted small">(${p.reviews.toLocaleString()})</span>
      </div>
      <div class="price">
        <span class="price__old">$${p.oldPrice.toFixed(2)}</span>
        <strong>$${p.price.toFixed(2)}</strong>
      </div>
      <div class="card__actions">
        <button class="btn btn--primary btn--small add-to-cart">Add to Cart</button>
        <button class="btn btn--ghost btn--small">Details</button>
      </div>
    </div>
  </article>`;
}
function renderProducts(list){ productGrid.innerHTML = list.map(productCard).join(""); }
function renderNewArrivals(){
  const items = CATALOG.filter(c => NEW_IDS.includes(c.id));
  newGrid.innerHTML = items.map(productCard).join("");
}

/* Sort & Filter */
function applySort(list, mode){
  const a=[...list];
  if(mode==="price-asc") a.sort((x,y)=>x.price-y.price);
  if(mode==="price-desc") a.sort((x,y)=>y.price-x.price);
  if(mode==="rating-desc") a.sort((x,y)=>y.rating-x.rating);
  return a;
}
function filterByCategory(list, cat){ return cat==="all" ? list : list.filter(p=>p.category===cat); }

/* Cart */
const CART_KEY = "bookstack_cart_v1";
const cart = {
  items: JSON.parse(localStorage.getItem(CART_KEY) || "[]"),
  save(){ localStorage.setItem(CART_KEY, JSON.stringify(this.items)); },
  add(id){ const f=this.items.find(i=>i.id===id); f?f.qty++:this.items.push({id,qty:1}); this.save(); updateCartUI(); },
  remove(id){ this.items=this.items.filter(i=>i.id!==id); this.save(); updateCartUI(); },
  qty(id,d){ const it=this.items.find(i=>i.id===id); if(!it) return; it.qty=Math.max(1,it.qty+d); this.save(); updateCartUI(); },
  clear(){ this.items=[]; this.save(); updateCartUI(); },
  count(){ return this.items.reduce((n,i)=>n+i.qty,0); },
  subtotal(){ return this.items.reduce((s,i)=>{ const p=CATALOG.find(c=>c.id===i.id); return s+(p?p.price*i.qty:0); },0); }
};
function updateCartUI(){
  cartCountEl.textContent = cart.count();
  cartSubtotalEl.textContent = `$${cart.subtotal().toFixed(2)}`;
  cartItemsEl.innerHTML = cart.items.map(i=>{
    const p = CATALOG.find(c=>c.id===i.id); if(!p) return "";
    return `
      <div class="cart__item">
        <img class="cart__thumb" src="${p.img}" alt="${p.title}">
        <div>
          <div class="cart__title">${p.title}</div>
          <div class="cart__meta">$${p.price.toFixed(2)} • ${p.category}</div>
          <div class="qty">
            <button data-action="dec" data-id="${i.id}">−</button>
            <input value="${i.qty}" readonly>
            <button data-action="inc" data-id="${i.id}">+</button>
          </div>
        </div>
        <button class="btn__icon" data-action="remove" data-id="${i.id}"><i class="fas fa-trash"></i></button>
      </div>`;
  }).join("");
}

/* Drawers & Menu */
function openDrawer(){ cartDrawer.classList.add("open"); overlay.classList.add("open"); }
function closeDrawer(){ cartDrawer.classList.remove("open"); overlay.classList.remove("open"); }
if (btnCart) btnCart.addEventListener("click", openDrawer);
if (btnCartClose) btnCartClose.addEventListener("click", closeDrawer);
overlay?.addEventListener("click", ()=>{ closeDrawer(); closeMenu(); });

function openMenu(){ mobileMenu.classList.add("open"); overlay.classList.add("open"); }
function closeMenu(){ mobileMenu.classList.remove("open"); overlay.classList.remove("open"); }
btnMenu?.addEventListener("click", openMenu);
btnMenuClose?.addEventListener("click", closeMenu);

/* Events */
document.addEventListener("click", e=>{
  if(e.target.closest(".add-to-cart")){
    const id = e.target.closest(".card")?.dataset.id;
    if(id) cart.add(id);
  }
  const action = e.target.dataset.action;
  const id = e.target.dataset.id;
  if(action==="remove") cart.remove(id);
  if(action==="inc") cart.qty(id,+1);
  if(action==="dec") cart.qty(id,-1);
});

sortSelect?.addEventListener("change", ()=>{
  const mode = sortSelect.value;
  const cat = $(".chip.active")?.dataset.filter || "all";
  renderProducts(applySort(filterByCategory(CATALOG, cat), mode));
});

chipButtons.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    chipButtons.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    const mode = sortSelect?.value || "featured";
    renderProducts(applySort(filterByCategory(CATALOG, btn.dataset.filter), mode));
  });
});
const allChip = chipButtons.find(b=>b.dataset.filter==="all");
allChip?.classList.add("active");

btnClear?.addEventListener("click", ()=>cart.clear());
$("#btn-checkout")?.addEventListener("click", ()=>{
  if(cart.items.length===0) return alert("Your cart is empty.");
  alert("Demo checkout not implemented.");
});

/* Initial render */
renderProducts(CATALOG);
renderNewArrivals();
updateCartUI();
