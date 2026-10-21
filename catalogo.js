
const parametros = new URLSearchParams(window.location.search);
const categoriaSeleccionada = parametros.get("categoria") || "";

const titulo = document.getElementById("titulo-categoria");
const cantidad = document.getElementById("cantidad-productos");
const lista = document.getElementById("lista-productos");

const productosFiltrados = Object.entries(productos).filter(
    ([id, producto]) =>
        (producto.categoria || "").trim().toLowerCase() ===
        categoriaSeleccionada.trim().toLowerCase()
);

titulo.textContent = categoriaSeleccionada || "Todos los productos";

cantidad.textContent =
    `${productosFiltrados.length} productos encontrados`;

if (productosFiltrados.length === 0) {
    lista.innerHTML = "<p>No hay productos en esta categoría.</p>";
} else {
    lista.innerHTML = productosFiltrados.map(([id, producto]) => `
        <a href="producto.html?id=${encodeURIComponent(id)}"
           class="categoria">

            <img src="${producto.imagen}" alt="${producto.nombre}">

            <h3>${producto.nombre}</h3>

            <span>
                S/ ${Number(producto.precio).toFixed(2)} →
            </span>
        </a>
    `).join("");
}
