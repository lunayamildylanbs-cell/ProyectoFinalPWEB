// config rawg api
const RAWG_KEY = "66d71aea9962478a92839e951481b374";
const RAWG_BASE = "https://api.rawg.io/api";

// helper fetch con manejo de error
async function rawgFetch(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error("error rawg: " + r.status);
    return r.json();
}

// generar precio fake con descuento
function precioFake() {
    const base = Math.round((10 + Math.random() * 40) * 100) / 100;
    const desc = Math.floor(Math.random() * 70);
    const final = Math.round((base * (1 - desc / 100)) * 100) / 100;
    return { base, final, desc };
}

// evitar inyeccion html
function escapeHtml(str = "") {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

// quitar juegos adultos por rating o tags
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

// obtener juego principal destacado
async function cargarOfertaPrincipal() {
    let url = `${RAWG_BASE}/games?key=${RAWG_KEY}&ordering=-suggestions_count&page_size=10`;
    let data = await rawgFetch(url);

    let juegos = filtrarAdultos(data.results);

    // si no hay juegos limpios, busca otra pagina
    if (!juegos.length) {
        url = `${RAWG_BASE}/games?key=${RAWG_KEY}&ordering=-rating&page_size=10&page=2`;
        data = await rawgFetch(url);
        juegos = filtrarAdultos(data.results);
    }

    renderOfertaPrincipal(juegos[0]);
}

// pintar oferta principal en html
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

// render lista de tarjetas pequeñas
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

// cargar secciones iniciales
async function cargarOfertas() {
    try {
        await cargarOfertaPrincipal();

        // ofertas flash random
        const flash = await rawgFetch(`${RAWG_BASE}/games?key=${RAWG_KEY}&page_size=5`);
        renderLista(document.getElementById("ofertas-flash"), flash.results);

        // ofertas semana ordenadas por fecha
        const semana = await rawgFetch(`${RAWG_BASE}/games?key=${RAWG_KEY}&ordering=released&page_size=8`);
        renderLista(document.getElementById("ofertas-semana"), semana.results);

    } catch (e) {
        console.error(e);
    }
}

// iniciar al cargar pagina
document.addEventListener("DOMContentLoaded", cargarOfertas);
