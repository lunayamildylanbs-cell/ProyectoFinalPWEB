// config
const RAWG_KEY = "66d71aea9962478a92839e951481b374";
const RAWG_BASE = "https://api.rawg.io/api";
const YT_KEY = "AIzaSyBxKNB4izVzKqU4rznBLvZYChbUYOgfVL4";

async function rawgFetch(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error("Error RAWG");
    return r.json();
}

function getID() {
    const p = new URLSearchParams(location.search);
    return p.get("id");
}

function fakePrice() {
    const base = Math.round((14 + Math.random() * 50) * 100) / 100;
    const discount = Math.floor(Math.random() * 60);
    const final = Math.round((base * (1 - discount / 100)) * 100) / 100;
    return { initial: base, final, discount };
}

async function translate(text) {
    try {
        const res = await fetch("https://libretranslate.de/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                q: text,
                source: "en",
                target: "es"
            })
        });

        const data = await res.json();
        return data.translatedText || text;
    } catch {
        return text;
    }
}

async function getTrailer(query) {
    const q = encodeURIComponent(`${query} trailer oficial videojuego`);
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${q}&key=${YT_KEY}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        const id = data.items?.[0]?.id?.videoId;
        return id ? `https://www.youtube.com/watch?v=${id}` : null;
    } catch {
        return null;
    }
}

function generateRequirements(game) {
    const rating = game.metacritic || (game.rating * 20) || 60;

    if (rating >= 80) {
        return {
            min: { os: "Windows 10 64-bit", cpu: "Intel i5-8400", ram: "8 GB", gpu: "GTX 1060", storage: "50 GB" },
            rec: { os: "Windows 11", cpu: "Intel i7-10700K", ram: "16 GB", gpu: "RTX 2070", storage: "50 GB SSD" }
        };
    }

    if (rating >= 60) {
        return {
            min: { os: "Windows 10", cpu: "Intel i3-8100", ram: "8 GB", gpu: "GTX 960", storage: "35 GB" },
            rec: { os: "Windows 10", cpu: "Intel i5-8400", ram: "12 GB", gpu: "GTX 1650 Super", storage: "35 GB SSD" }
        };
    }

    return {
        min: { os: "Windows 7", cpu: "Intel Core i3", ram: "6 GB", gpu: "GTX 750 Ti", storage: "20 GB" },
        rec: { os: "Windows 10", cpu: "Intel Core i5", ram: "8 GB", gpu: "GTX 1050 Ti", storage: "25 GB" }
    };
}

function renderMiniGaleria(arr) {
    const gal = document.getElementById("mini-galeria");

    if (!arr || arr.length === 0) {
        gal.innerHTML = `<p>No hay imágenes disponibles</p>`;
        return;
    }

    gal.innerHTML = arr
        .map(s => `<div class="item-galeria rect" style="background-image:url('${s.image}')"></div>`)
        .join("");
}

async function renderSimilares(game) {
    const cont = document.getElementById("similares");

    const genres = game.genres.slice(0, 3).map(g => g.slug);
    let all = [];

    for (const g of genres) {
        const res = await rawgFetch(`${RAWG_BASE}/games?key=${RAWG_KEY}&genres=${g}&ordering=-rating&page_size=3`);
        all.push(...res.results);
    }

    all = [...new Map(all.map(j => [j.id, j])).values()].slice(0, 4);

    cont.innerHTML = all.map(j => {
        const price = fakePrice();
        return `
            <a href="juego.html?id=${j.id}" class="similar-card">
                <div class="sim-img" style="background-image:url('${j.background_image}')"></div>
                <div class="sim-info">
                    <h4>${j.name}</h4>
                    <p class="sim-genre">${j.genres?.[0]?.name || "—"}</p>
                    <p class="sim-price">$${price.final}</p>
                </div>
            </a>
        `;
    }).join("");
}

// agregar al carrito
function agregarAlCarrito(game, price) {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    carrito.push({
        id: game.id,
        nombre: game.name,
        genero: game.genres?.[0]?.name || "Videojuego",
        img: game.background_image,
        precio: price.final
    });

    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert("🛒 Juego agregado al carrito");
}

async function init() {
    const id = getID();
    if (!id) return;

    const game = await rawgFetch(`${RAWG_BASE}/games/${id}?key=${RAWG_KEY}`);
    const price = fakePrice();

    // titulo
    document.getElementById("titulo-juego").textContent = game.name;

    // info superior
    document.getElementById("valoracion-juego").textContent = `⭐ ${game.rating}`;
    document.getElementById("ano-juego").textContent = game.released?.substring(0, 4) || "—";

    // etiquetas
    document.getElementById("etiquetas-superiores").textContent =
        game.genres.map(g => g.name).join(" • ");

    // imagen
    const img = document.getElementById("imagen-juego");
    img.style.backgroundImage = `url('${game.background_image}')`;
    img.innerHTML = "";

    // informacion rapida
    document.querySelector(".informacion-rapida").innerHTML = `
        <p><strong>Fecha de lanzamiento:</strong> ${game.released}</p>
        <p><strong>Genero:</strong> ${game.genres.map(g => g.name).join(", ")}</p>
        <p><strong>Plataformas:</strong> ${game.platforms.map(p => p.platform.name).join(", ")}</p>
        <p><strong>Valoracion:</strong> ${game.rating}</p>
    `;

    // cuadros info
    document.getElementById("caja-valoracion").textContent = game.rating;
    document.getElementById("caja-ano").textContent = game.released?.substring(0, 4);
    document.getElementById("caja-plataformas").textContent = game.platforms.length;
    document.getElementById("caja-descuento").textContent = price.discount + "%";

    // descripcion traducida
    document.getElementById("descripcion-juego").textContent =
        await translate(game.description_raw || "Sin descripcion");

    // imagenes
    const shots = await rawgFetch(`${RAWG_BASE}/games/${id}/screenshots?key=${RAWG_KEY}`);
    renderMiniGaleria(shots.results);

    // caracteristicas
    document.getElementById("lista-caracteristicas").innerHTML =
        game.tags.slice(0, 6).map(t => `<li>${t.name}</li>`).join("");

    // requisitos
    const reqs = generateRequirements(game);

    document.getElementById("req-minimo").innerHTML = `
        <h3>MINIMO</h3>
        <p><strong>OS:</strong> ${reqs.min.os}</p>
        <p><strong>CPU:</strong> ${reqs.min.cpu}</p>
        <p><strong>RAM:</strong> ${reqs.min.ram}</p>
        <p><strong>GPU:</strong> ${reqs.min.gpu}</p>
        <p><strong>Almacenamiento:</strong> ${reqs.min.storage}</p>
    `;

    document.getElementById("req-recomendado").innerHTML = `
        <h3>RECOMENDADO</h3>
        <p><strong>OS:</strong> ${reqs.rec.os}</p>
        <p><strong>CPU:</strong> ${reqs.rec.cpu}</p>
        <p><strong>RAM:</strong> ${reqs.rec.ram}</p>
        <p><strong>GPU:</strong> ${reqs.rec.gpu}</p>
        <p><strong>Almacenamiento:</strong> ${reqs.rec.storage}</p>
    `;

    // juegos similares
    await renderSimilares(game);

    const btnComprar = document.querySelector(".btn-principal");
    const btnCarrito = document.querySelector(".btn-secundario");

    btnComprar.onclick = (e) => {
        e.preventDefault();
        agregarAlCarrito(game, price);
        window.location.href = "carrito.html";
    };

    btnCarrito.onclick = (e) => {
        e.preventDefault();
        agregarAlCarrito(game, price);
        alert("🛒 Juego agregado al carrito");
    };

    // trailer
    document.getElementById("btn-trailer").onclick = async () => {
        const url = await getTrailer(game.name);
        if (!url) return alert("No hay trailer disponible");
        window.open(url, "_blank");
    };
}

document.addEventListener("DOMContentLoaded", init);
