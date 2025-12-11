// carga el carrito desde localstorage y genera el html
function cargarCarrito() {
    const contenedorCarrito = document.querySelector(".carrito-vacio");
    const metodosPago = document.getElementById("metodos-pago");

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // si el carrito esta vacio muestra mensaje y oculta metodos de pago
    if (carrito.length === 0) {
        contenedorCarrito.style.display = "block";
        metodosPago.style.display = "none";
        return;
    }

    // si existen productos se muestra la lista y los metodos de pago
    contenedorCarrito.style.display = "none";
    metodosPago.style.display = "block";

    let lista = document.getElementById("lista-carrito");
    if (!lista) {
        // contenedor de lista
        lista = document.createElement("div");
        lista.id = "lista-carrito";
        lista.classList.add("lista-carrito");
        contenedorCarrito.parentNode.insertBefore(lista, metodosPago);
    }

    lista.innerHTML = "";
    let total = 0;

    carrito.forEach((item, index) => {
        total += item.precio;

        // tarjeta del juego dentro del carrito
        const card = document.createElement("div");
        card.classList.add("carrito-item");

        card.innerHTML = `
            <img src="${item.img}" class="imagen-item" alt="${item.nombre}">
            <div class="info-item">
                <h3>${item.nombre}</h3>
                <p>Genero: ${item.genero}</p>
                <p class="precio">Bs. ${item.precio.toFixed(2)}</p>
            </div>
            <button class="btn-eliminar" data-index="${index}">🗑</button>
        `;

        lista.appendChild(card);
    });

    document.getElementById("total-pago").textContent = total.toFixed(2);
    activarBotonesEliminar();

    // seguir comprando
    let seguirBtn = document.getElementById("seguir-comprando");
    if (!seguirBtn) {
        seguirBtn = document.createElement("button");
        seguirBtn.id = "seguir-comprando";
        seguirBtn.classList.add("btn-principal");
        seguirBtn.textContent = "Seguir Comprando";

        metodosPago.parentNode.insertBefore(seguirBtn, metodosPago);

        seguirBtn.onclick = () => {
            window.location.href = "explorar.html";
        };
    }
}

// activa los botones para eliminar productos individuales del carrito
function activarBotonesEliminar() {
    const botones = document.querySelectorAll(".btn-eliminar");

    botones.forEach(boton => {
        boton.onclick = () => {
            const index = boton.getAttribute("data-index");
            let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

            // elimina el producto por indice
            carrito.splice(index, 1);
            localStorage.setItem("carrito", JSON.stringify(carrito));
            cargarCarrito();
        };
    });
}

// activa los botones de pago y procesa la simulacion de transaccion
function activarPago() {
    const botonesPago = document.querySelectorAll(".btn-pago");

    botonesPago.forEach(boton => {
        boton.onclick = async () => {
            const metodo = boton.getAttribute("data-metodo");
            let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
            let total = carrito.reduce((s, j) => s + j.precio, 0);

            // evita procesar si el carrito esta vacio
            if (carrito.length === 0) return;

            boton.textContent = "Procesando...";
            boton.disabled = true;

            try {
                // simulacion de envio de datos a api
                const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        metodo,
                        total,
                        juegos: carrito
                    })
                });

                const data = await res.json();
                console.log("respuesta del pago:", data);

                // confirmacion de pago simulado
                alert(`Pago procesado correctamente con ${metodo.toUpperCase()}\nID de transaccion: ${data.id}`);

                // vacia el carrito
                localStorage.removeItem("carrito");
                cargarCarrito();

            } catch (err) {
                alert("Error al procesar el pago");
                console.error(err);
            }

            // restablece estado del boton luego del proceso
            boton.textContent = metodo === "tarjeta" ? "Tarjeta de Credito" : "PayPal";
            boton.disabled = false;
        };
    });
}

// inicializacion general al cargar la pagina
document.addEventListener("DOMContentLoaded", () => {
    cargarCarrito();
    activarPago();
});
