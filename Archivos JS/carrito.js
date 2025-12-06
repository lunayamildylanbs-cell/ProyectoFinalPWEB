// cargar carrito
function cargarCarrito() {
    const contenedorCarrito = document.querySelector(".carrito-vacio");
    const metodosPago = document.getElementById("metodos-pago");

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        contenedorCarrito.style.display = "block";
        metodosPago.style.display = "none";
        return;
    }

    contenedorCarrito.style.display = "none";
    metodosPago.style.display = "block";

    let lista = document.getElementById("lista-carrito");
    if (!lista) {
        lista = document.createElement("div");
        lista.id = "lista-carrito";
        lista.classList.add("lista-carrito");
        contenedorCarrito.parentNode.insertBefore(lista, metodosPago);
    }

    lista.innerHTML = "";
    let total = 0;

    carrito.forEach((item, index) => {
        total += item.precio;

        const card = document.createElement("div");
        card.classList.add("carrito-item");

        card.innerHTML = `
            <img src="${item.img}" class="imagen-item" alt="${item.nombre}">

            <div class="info-item">
                <h3>${item.nombre}</h3>
                <p>género: ${item.genero}</p>
                <p class="precio">$${item.precio.toFixed(2)}</p>
            </div>

            <button class="btn-eliminar" data-index="${index}">🗑</button>
        `;

        lista.appendChild(card);
    });

    document.getElementById("total-pago").textContent = total.toFixed(2);
    activarBotonesEliminar();
}


function activarBotonesEliminar() {
    const botones = document.querySelectorAll(".btn-eliminar");

    botones.forEach(boton => {
        boton.onclick = () => {
            const index = boton.getAttribute("data-index");
            let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

            carrito.splice(index, 1);
            localStorage.setItem("carrito", JSON.stringify(carrito));

            cargarCarrito();
        };
    });
}

function activarPago() {
    const botonesPago = document.querySelectorAll(".btn-pago");

    botonesPago.forEach(boton => {
        boton.onclick = async () => {
            const metodo = boton.getAttribute("data-metodo");
            let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
            let total = carrito.reduce((s, j) => s + j.precio, 0);

            if (carrito.length === 0) return;

            // mostrar mensaje de procesamiento
            boton.textContent = "procesando...";
            boton.disabled = true;

            try {
                // api de prueba para simular pago
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

                alert(`✅ pago procesado correctamente con ${metodo.toUpperCase()}\nid de transacción: ${data.id}`);

                // vaciar carrito tras pago
                localStorage.removeItem("carrito");
                cargarCarrito();

            } catch (err) {
                alert("❌ error al procesar el pago");
                console.error(err);
            }

            boton.textContent = metodo === "tarjeta" ? "Tarjeta de credito" : "PayPal";
            boton.disabled = false;
        };
    });
}

document.addEventListener("DOMContentLoaded", () => {
    cargarCarrito();
    activarPago();
});
