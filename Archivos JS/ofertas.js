// ==========================
// CONFIG RAWG API
// ==========================
const RAWG_KEY = "66d71aea9962478a92839e951481b374";
const RAWG_BASE = "https://api.rawg.io/api";

// ==========================
// FETCH RAWG con manejo de error
// ==========================
async function rawgFetch(url) {
    try {
        const r = await fetch(url);
        if (!r.ok) throw new Error("RAWG error " + r.status);
        return r.json();
    } catch (e) {
        console.warn("⚠ RAWG FALLÓ:", e);
        return null; // ← importantísimo
    }
}

// ==========================
// Cargar JSON local si RAWG falla
// ==========================
async function cargarLocal() {
    try {
        const r = await fetch("./Archivos_JSON/ofertas.json");
        return r.json();
    } catch (e) {
        console.error("⚠ Error cargando JSON local:", e);
        return null;
    }
}

// ==========================
// Generar precio fake
// ==========================
function precioFake() {
    const base = +(10 + Math.random() * 40).toFixed(2);
    const desc = Math.floor(Math.random() * 70);
    const final = +(base * (1 - desc / 100)).toFixed(2);
    return { base, final, desc };
}

// ==========================
// Evitar inyección HTML
// ==========================
function escapeHtml(str = "") {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

// ==========================
// Filtrar juegos adultos
// ==========================
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

// ==========================
// OFERTA PRINCIPAL
// ==========================
async function cargarOfertaPrincipal() {
    // ---- 1) INTENTAR RAWG ----
    let data = await rawgFetch(
        `${RAWG_BASE}/games?key=${RAWG_KEY}&ordering=-suggestions_count&page_size=10`
    );

    if (data && data.results?.length) {
        const juegos = filtrarAdultos(data.results);
        if (juegos.length) return renderOfertaPrincipal(juegos[0]);
    }

    // ---- 2) SI RAWG FALLA → JSON LOCAL ----
    const local = await cargarLocal();
    if (local?.destacado?.length) {
        return renderOfertaPrincipal(local.destacado[0]);
    }

    console.error("❌ No se encontró ni RAWG ni JSON local.");
}

function renderOfertaPrincipal(juego) {
    const precio = precioFake();
    const img = juego.background_image || "./Archivos_IMG/noimg.png";

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

// ==========================
// LISTAS (flash/semana)
// ==========================
function renderLista(container, juegos) {
    const filtrados = filtrarAdultos(juegos);

    container.innerHTML = filtrados.map(j => {
        const precio = precioFake();
        const img = j.background_image || "./Archivos_IMG/noimg.png";

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

// ==========================
// Cargar ofertas completas
// ==========================
async function cargarOfertas() {
    // Siempre intentar cargar RAWG primero
    await cargarOfertaPrincipal();

    // ---------- FLASH ----------
    let flash = await rawgFetch(`${RAWG_BASE}/games?key=${RAWG_KEY}&page_size=5`);
    if (!flash) {
        const local = await cargarLocal();
        flash = { results: local.flash };
    }
    renderLista(document.getElementById("ofertas-flash"), flash.results);

    // ---------- SEMANA ----------
    let semana = await rawgFetch(`${RAWG_BASE}/games?key=${RAWG_KEY}&ordering=released&page_size=8`);
    if (!semana) {
        const local = await cargarLocal();
        semana = { results: local.semana };
    }
    renderLista(document.getElementById("ofertas-semana"), semana.results);
}

// ==========================
// INICIAR
// ==========================
document.addEventListener("DOMContentLoaded", cargarOfertas);
