window.productos = [
  { id: 1, nombre: "Sweter pilf", precio: 35000, genero: "unisex", oferta: 20, tipo: "remera", img: "assets/sweter.webp", imagenes: [
      "assets/sweter.webp",
      "assets/sweater.webp",
    ] },
  { id: 2, nombre: "Campera denim", precio: 55000, genero: "mujer", oferta: 20, tipo: "campera", img: "assets/campera.webp", imagenes: [
      "assets/campera.webp",
      "assets/camperaM.webp",
    ] },
  { id: 3, nombre: "Remera cultura", precio: 45000, genero: "hombre", oferta: 20, tipo: "remera", img: "assets/remera.webp", imagenes: [
      "assets/remera.webp",
      "assets/remeraV.webp",
    ]},
  { id: 4, nombre: "Skinny jean", precio: 40000, genero: "unisex", tipo: "pantalon", img: "assets/pantalonuni.webp", imagenes: [
      "assets/pantalonuni.webp",
      "assets/pantalonM (2).webp",
    ] },
  { id: 5, nombre: "Remera beach", precio: 20000, genero: "mujer", tipo: "remera", img: "assets/remeraM.webp", imagenes: [
      "assets/remeraM.webp",
      "assets/MujerMM.webp",
    ] },
  { id: 6, nombre: "Pantalon oxford", precio: 22000, genero: "hombre", tipo: "pantalon", img: "assets/pantalones.webp", imagenes: [
      "assets/pantalones.webp",
      "assets/pantalñonV.webp",
    ] }
];

document.addEventListener('DOMContentLoaded', () => {

  const grid = document.getElementById('productos-grid');
  const cartCountEl = document.getElementById('cart-count');
  const searchToggle = document.getElementById('search-toggle');
  const searchBar = document.getElementById('search-bar');
  const searchInput = document.getElementById('search-input');
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');
  const cartBtn = document.getElementById('cart-btn');


  const linkOfertas = document.querySelector('a[href="#ofertas"]');
  const seccionDestacados = document.getElementById('productos-destacados');

  if (linkOfertas && seccionDestacados) {
    linkOfertas.addEventListener('click', (e) => {
      e.preventDefault();
      seccionDestacados.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  let cartCount = 0;

  // Render productos
  function renderProductos(list){
    grid.innerHTML = '';
    list.forEach((p, i) => {
      const card = document.createElement('article');
      card.className = 'card fade-in';
      card.innerHTML = `
        <div class="card-img-container">
          ${p.oferta ? `<span class="badge-oferta">-${p.oferta}%</span>` : ""}
          <img src="${p.img}" alt="${p.nombre}">
        </div>
        <h3>${p.nombre}</h3>
        <p class="price">
          ${p.oferta
            ? `<span class="precio-tachado">$${p.precio.toFixed(2)}</span> $${(p.precio * (1 - p.oferta / 100)).toFixed(2)}`
            : `$${p.precio.toFixed(2)}`
          }
        </p>
        <div class="card-actions">
          <button class="btn-sm add-cart" data-id="${p.id}">Agregar al carrito</button>
          <button class="btn-sm">Ver</button>
        </div>
      `;
      grid.appendChild(card);
      // simple stagger
      card.style.animationDelay = `${i * 60}ms`;
    });
    attachAddCartListeners();
  }

  function attachAddCartListeners(){
    const addBtns = document.querySelectorAll('.add-cart');
    addBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        cartCount++;
        updateCartCount();
        btn.textContent = '✓ Agregado';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = 'Agregar al carrito';
          btn.disabled = false;
        }, 900);
      });
    });
  }

  function updateCartCount(){
    cartCountEl.textContent = cartCount;
  }

  searchToggle?.addEventListener('click', () => {
    if (!searchBar) return;
    const isHidden = getComputedStyle(searchBar).display === 'none';
    searchBar.style.display = isHidden ? 'block' : 'none';
    if (isHidden) searchInput.focus();
  });

  searchInput?.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    if (!q) {
      renderProductos(productos);
      return;
    }
    const filtered = productos.filter(p => p.nombre.toLowerCase().includes(q));
    renderProductos(filtered);
  });

  menuToggle?.addEventListener('click', () => {
    const shown = mainNav.style.display === 'block';
    mainNav.style.display = shown ? 'none' : 'block';
  });

  cartBtn?.addEventListener('click', () => {
    alert(`Tienes ${cartCount} artículo(s) en el carrito.`);
  });

  document.getElementById('year').textContent = new Date().getFullYear();
  const esIndex = window.location.pathname.includes("index.html") || window.location.pathname.endsWith("/");

  if (esIndex) {
    const ofertas = productos.filter(p => p.oferta && p.oferta > 0);
    renderProductos(ofertas);
  } else {
    renderProductos(productos);
  }
});

/* MODALES: CARRITO Y PRODUCTO */
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const productos = window.productos || [];

  body.insertAdjacentHTML('beforeend', `
  <!-- MODAL CARRITO -->
  <div class="modal fade" id="cartModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title">🛒 Tu carrito</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div id="cart-items" class="list-group mb-3"></div>
          <div class="d-flex justify-content-between align-items-center">
            <h5>Total: <span id="cart-total">$0.00</span></h5>
            <button id="btn-finalizar" class="btn btn-success">Finalizar compra</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- MODAL PRODUCTO -->
  <div class="modal fade" id="productModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body p-0">
          <div id="product-carousel" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner" id="product-images"></div>
            <button class="carousel-control-prev" type="button" data-bs-target="#product-carousel" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#product-carousel" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
          <div class="p-4">
            <h3 id="product-title" class="mb-2"></h3>
            <p id="product-price" class="fw-bold"></p>
            <button id="btn-add-cart-modal" class="btn btn-primary mb-2">Agregar al carrito</button>
            <p id="product-desc" class="text-muted small"></p>
          </div>
        </div>
      </div>
    </div>
  </div>
  `);

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const cartCountEl = document.getElementById("cart-count");

  function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarritoUI();
  }

  function actualizarCarritoUI() {
    const cont = carrito.length;
    if (cartCountEl) cartCountEl.textContent = cont;

    const cartList = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");
    if (!cartList || !totalEl) return;

    cartList.innerHTML = "";
    let total = 0;

    carrito.forEach((item, index) => {
      total += item.precio;
      const div = document.createElement("div");
      div.className = "list-group-item d-flex justify-content-between align-items-center";
      div.innerHTML = `
        <div class="d-flex align-items-center gap-2">
          <img src="${item.img}" alt="${item.nombre}" width="60" height="60" class="rounded">
          <div>
            <h6 class="mb-0">${item.nombre}</h6>
            <small>$${item.precio.toFixed(2)}</small>
          </div>
        </div>
        <button class="btn btn-sm btn-danger" data-index="${index}">✕</button>
      `;
      div.querySelector("button").addEventListener("click", () => {
        carrito.splice(index, 1);
        guardarCarrito();
      });
      cartList.appendChild(div);
    });

    totalEl.textContent = `$${total.toFixed(2)}`;
  }

  function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id == id);
    if (!producto) return;
    carrito.push(producto);
    guardarCarrito();
  }

function mostrarProducto(id) {
  const p = productos.find(p => p.id == id);
  if (!p) return;

  const imgsEl = document.getElementById("product-images");
  const imagenesExtra = p.imagenes || [
    p.img,
    p.img.replace('.webp', '2.webp'),
    p.img.replace('.webp', '3.webp')
  ];

  imgsEl.innerHTML = imagenesExtra
    .map((src, i) => `
      <div class="carousel-item ${i === 0 ? 'active' : ''}">
        <img src="${src}" class="d-block" alt="${p.nombre}">
      </div>
    `)
    .join('');

  document.getElementById("product-title").textContent = p.nombre;
  document.getElementById("product-price").textContent = `$${p.precio.toLocaleString()}`;
  document.getElementById("product-desc").textContent =
    "Explorá los detalles de nuestra prenda seleccionada, con materiales de alta calidad y estilo exclusivo de Cultura.";

  const addBtn = document.getElementById("btn-add-cart-modal");
  addBtn.onclick = () => agregarAlCarrito(p.id);

  const modal = new bootstrap.Modal(document.getElementById("productModal"));
  modal.show();
}

  document.body.addEventListener("click", e => {
    if (e.target.id === "btn-finalizar") {
      if (carrito.length === 0) {
        alert("Tu carrito está vacío 💔");
        return;
      }
      alert("¡Gracias por tu compra! 🧡");
      carrito = [];
      guardarCarrito();
      const modal = bootstrap.Modal.getInstance(document.getElementById("cartModal"));
      modal.hide();
    }
  });

  document.body.addEventListener("click", e => {
    if (e.target.classList.contains("add-cart")) {
      const id = e.target.dataset.id;
      agregarAlCarrito(id);
    }
    if (e.target.textContent.trim() === "Ver") {
      const card = e.target.closest(".card");
      const id = card.querySelector(".add-cart").dataset.id;
      mostrarProducto(id);
    }
  });

  const cartBtn = document.getElementById("cart-btn");
  if (cartBtn) {
    cartBtn.addEventListener("click", () => {
      const modal = new bootstrap.Modal(document.getElementById("cartModal"));
      modal.show();
      actualizarCarritoUI();
    });
  }

  actualizarCarritoUI();
});