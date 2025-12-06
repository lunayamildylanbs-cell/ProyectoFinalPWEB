// ofertas.js - RAWG API

const RAWG_KEY = "66d71aea9962478a92839e951481b374";
const RAWG_BASE = "https://api.rawg.io/api";

// helpers
async function rawgFetch(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error("error rawg: " + r.status);
    return r.json();
}

function precioFake() {
    const base = Math.round((10 + Math.random() * 40) * 100) / 100;
    const desc = Math.floor(Math.random() * 70);
    const final = Math.round((base * (1 - desc / 100)) * 100) / 100;
    return { base, final, desc };
}

function escapeHtml(str = "") {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

// filtro no adultos
function filtrarAdultos(lista) {
    return lista.filter(j => {
        const rating = j.esrb_rating?.name?.toLowerCase() || "";
        const tags = (j.tags || []).map(t => t.name.toLowerCase());

        if (rating.includes("adult")) return false;
        if (tags.some(t =>
            t.includes("sexual") ||
            t.includes("nudity") ||
            t.includes("adult")
        )) return false;

        return true;
    });
}

// cargar oferta principal
async function cargarOfertaPrincipal() {
    let url = `${RAWG_BASE}/games?key=${RAWG_KEY}&ordering=-rating&page_size=10`;
    let data = await rawgFetch(url);

    let juegos = filtrarAdultos(data.results);

    // si no quedan → busca otra página
    if (!juegos.length) {
        url = `${RAWG_BASE}/games?key=${RAWG_KEY}&ordering=-rating&page_size=10&page=2`;
        data = await rawgFetch(url);
        juegos = filtrarAdultos(data.results);
    }

    renderOfertaPrincipal(juegos[0]);
}

// render oferta principal
function renderOfertaPrincipal(juego) {
    const precio = precioFake();
    const img = juego.background_image || "/Archivos IMG/noimg.png";

    document.getElementById("oferta-principal").innerHTML = `
        <a href="juego.html?id=${juego.id}" class="tarjeta-oferta">
            <div class="img" style="background-image:url('${img}')"></div>

            <div class="info">
                <h3>${escapeHtml(juego.name)}</h3>
                <p class="genero">${juego.genres?.[0]?.name || "Videojuego"}</p>

                <div class="precios">
                    <span class="precio-final">$${precio.final}</span>
                    <span class="precio-original">$${precio.base}</span>
                    <span class="descuento">-${precio.desc}%</span>
                </div>

                <button class="btn-comprar">Ver juego</button>
            </div>
        </a>
    `;
}

// render listas
function renderLista(container, juegos) {
    const filtrados = filtrarAdultos(juegos);

    container.innerHTML = filtrados.map(j => {
        const precio = precioFake();
        const img = j.background_image || "/Archivos IMG/noimg.png";

        return `
            <a href="juego.html?id=${j.id}" class="tarjeta-small">
                <div class="img-small" style="background-image:url('${img}')"></div>

                <div class="info-small">
                    <h4>${escapeHtml(j.name)}</h4>
                    <p class="gen">${j.genres?.[0]?.name || "—"}</p>

                    <div class="precios-small">
                        <span class="final">$${precio.final}</span>
                        <span class="orig">$${precio.base}</span>
                        <span class="desc">-${precio.desc}%</span>
                    </div>
                </div>
            </a>
        `;
    }).join("");
}

// carga inicial
async function cargarOfertas() {
    try {
        await cargarOfertaPrincipal();

        // ofertas flash
        const flash = await rawgFetch(`${RAWG_BASE}/games?key=${RAWG_KEY}&page_size=5`);
        renderLista(document.getElementById("ofertas-flash"), flash.results);

        // ofertas semana
        const semana = await rawgFetch(`${RAWG_BASE}/games?key=${RAWG_KEY}&ordering=-metacritic&page_size=8`);
        renderLista(document.getElementById("ofertas-semana"), semana.results);

    } catch (e) {
        console.error(e);
    }
}

document.addEventListener("DOMContentLoaded", cargarOfertas);
