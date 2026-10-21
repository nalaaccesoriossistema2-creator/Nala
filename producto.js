
const parametros = new URLSearchParams(window.location.search);
const idProducto = parametros.get("id");

const producto = window.productos?.[idProducto];

if (!producto) {
    document.querySelector("main").innerHTML = `
        <section class="seccion-producto">
            <h2>Producto no encontrado</h2>
            <p>Selecciona un producto de nuestro catálogo.</p>
            <a href="index.html#categorias">Volver al inicio</a>
        </section>
    `;
} else {
    document.title = `${producto.nombre} | Nala Accesorios`;

    // SECCIÓN 1: DESCRIPCIÓN GENERAL
    document.getElementById("nombre-producto").textContent =
        producto.nombre;

    document.getElementById("material-producto").textContent =
        producto.material || "";

    document.getElementById("descripcion-texto").textContent =
        producto.descripcion || "";

    document.getElementById("precio-producto").textContent =
        `S/ ${Number(producto.precio).toFixed(2)}`;

    // MENSAJE PERSONALIZADO SEGÚN EL TIPO DE ANILLO
    const tipoProducto = (producto.tipo || "").trim().toLowerCase();
    const elementoTipo = document.getElementById("tipo-producto");

    if (elementoTipo) {
        if (tipoProducto === "talla") {
            elementoTipo.innerHTML = `
                <div class="mensaje-tipo-anillo">
                    <strong>💍 ¡Tu anillo perfecto te espera!</strong>
                    <p>
                        ✨ Este anillo es a medida y necesita una tallita.
                        ¿No sabes cuál es la tuya? 💖
                        ¡No te preocupes! Te ayudaremos a calcularla
                        fácilmente. 🥰
                    </p>
                </div>
            `;
        } else if (tipoProducto === "ajustable") {
            elementoTipo.innerHTML = `
                <div class="mensaje-tipo-anillo">
                    <strong>💖 ¡Se adapta a ti!</strong>
                    <p>
                        💍 Este anillo es ajustable y se adapta
                        cómodamente a tu dedo.
                        ✨ ¡No necesitas saber tu talla!
                    </p>
                </div>
            `;
        } else {
            elementoTipo.textContent = "";
        }
    }

    // ENLACE AL CATÁLOGO DE LA MISMA CATEGORÍA
    const enlaceCatalogo = document.getElementById("enlace-catalogo");

    if (enlaceCatalogo) {
        enlaceCatalogo.href =
            `productos.html?categoria=${encodeURIComponent(producto.categoria)}`;
    }

    // SECCIÓN 2 Y 3: VIDEOS
    function mostrarVideo(contenedorId, ruta, mensaje) {
        const contenedor = document.getElementById(contenedorId);

        if (!contenedor) return;

        if (!ruta) {
            contenedor.textContent = mensaje;
            return;
        }

        const video = document.createElement("video");
        video.src = ruta;
        video.controls = true;
        video.playsInline = true;
        video.preload = "metadata";

        video.addEventListener("error", () => {
            contenedor.textContent =
                "No se pudo cargar el video. Revisa el nombre y la ruta del archivo.";
        });

        contenedor.replaceChildren(video);
    }

    mostrarVideo(
        "contenedor-video-real",
        producto.video,
        "Próximamente estará disponible el video del producto real."
    );

    mostrarVideo(
        "contenedor-video-grabado",
        producto.grabado,
        "Próximamente estará disponible el video del grabado personalizado."
    );
}

// WHATSAPP: MENSAJE PERSONALIZADO CON EL PRODUCTO
if (producto) {
    const nombre = producto.nombre;

    const mensaje =
        `Hola, estoy interesado en ${nombre}. Quisiera más información.`;

    const enlaceWhatsApp =
        `https://wa.me/51946900860?text=${encodeURIComponent(mensaje)}`;

    // BOTÓN DORADO: CONSULTA POR WHATSAPP
    const botonConsulta = document.getElementById("whatsapp-producto");

    if (botonConsulta) {
        botonConsulta.href = enlaceWhatsApp;
    }

    // BOTÓN FLOTANTE VERDE: WHATSAPP
    const botonFlotante = document.querySelector(".boton-whatsapp");

    if (botonFlotante) {
        botonFlotante.href = enlaceWhatsApp;
    }
}
