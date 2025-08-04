const API_URL = "https://sheetdb.io/api/v1/7yq6z1wefte7n";
let productos = [];
function obtenerProductos() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      productos = data.map(p => ({
        id: p.id,
        nombre: p.nombre,
        cantidad: parseInt(p.cantidad),
        precio: parseFloat(p.precio)
      }));
      renderProductos();
    });
}
function agregarProducto(nombre, cantidad, precio) {
  const nuevo = {
    data: {
      id: Date.now(),
      nombre,
      cantidad,
      precio
    }
  };

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevo)
  }).then(() => obtenerProductos());
}

function eliminarProducto(id) {
  fetch(`${API_URL}/id/${id}`, { method: "DELETE" }).then(() => obtenerProductos());
}

function actualizarProducto(id, data) {
  fetch(`${API_URL}/id/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data })
  }).then(() => obtenerProductos());
}

function cambiarCantidad(id, delta) {
  const producto = productos.find(p => p.id == id);
  if (!producto) return;
  const nuevaCantidad = Math.max(0, producto.cantidad + delta);
  actualizarProducto(id, { cantidad: nuevaCantidad });
}

function editarProducto(id) {
  const prod = productos.find(p => p.id == id);
  if (!prod) return;

  const nuevoNombre = prompt("Nuevo nombre:", prod.nombre);
  const nuevaCantidad = prompt("Nueva cantidad:", prod.cantidad);
  const nuevoPrecio = prompt("Nuevo precio:", prod.precio);

  if (nuevoNombre && nuevaCantidad && nuevoPrecio) {
    actualizarProducto(id, {
      nombre: nuevoNombre,
      cantidad: parseInt(nuevaCantidad),
      precio: parseFloat(nuevoPrecio)
    });
  }
}

function renderProductos(filtro = "") {
  const tbody = document.querySelector("#productTable tbody");
  tbody.innerHTML = "";

  productos.forEach(prod => {
    if (prod.nombre.toLowerCase().includes(filtro.toLowerCase())) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${prod.nombre}</td>
        <td>
          <button onclick="cambiarCantidad(${prod.id}, -1)">➖</button>
          ${prod.cantidad}
          <button onclick="cambiarCantidad(${prod.id}, 1)">➕</button>
        </td>
        <td>$${prod.precio.toFixed(2)}</td>
        <td>$${(prod.cantidad * prod.precio).toFixed(2)}</td>
        <td>
          <button onclick="editarProducto(${prod.id})">Editar</button>
          <button onclick="eliminarProducto(${prod.id})" style="background:red;">Eliminar</button>
        </td>
      `;
      tbody.appendChild(row);
    }
  });
}

function filtrarProductos() {
  const filtro = document.getElementById("buscador").value;
  renderProductos(filtro);
}

document.getElementById("productForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const cantidad = parseInt(document.getElementById("cantidad").value);
  const precio = parseFloat(document.getElementById("precio").value);

  agregarProducto(nombre, cantidad, precio);
  this.reset();
});

obtenerProductos();
function cerrarSesion() {
  localStorage.removeItem("logueado");
  window.location.href = "index.html";
}
