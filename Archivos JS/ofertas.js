// config rawg api
const RAWG_KEY = "66d71aea9962478a92839e951481b374";
const RAWG_BASE = "https://corsproxy.io/?https://api.rawg.io/api";

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


// obtener juego principal destacado
async function cargarOfertaPrincipal() {
    let url = `${URL_API}/games?key=${RAWG_KEY}&ordering=-suggestions_count&page_size=10`;
    let data = await rawgFetch(url);

    let juegos = data.results;

    // si viene vacío busca otra página
    if (!juegos.length) {
        url = `${URL_API}/games?key=${RAWG_KEY}&ordering=-rating&page_size=10&page=2`;
        data = await rawgFetch(url);
        juegos = data.results;
    }

    renderOfertaPrincipal(juegos[0]);
}


// pintar oferta principal
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
                    <span class="precio-final">Bs. ${precio.final}</span>
                    <span class="precio-original">Bs. ${precio.base}</span>
                    <span class="descuento">-${precio.desc}%</span>
                </div>

                <button class="btn-comprar">Ver juego</button>
            </div>
        </a>
    `;
}


// render lista pequeña
function renderLista(container, juegos) {
    container.innerHTML = juegos.map(j => {
        const precio = precioFake();
        const img = j.background_image || "/Archivos IMG/noimg.png";

        return `
            <a href="juego.html?id=${j.id}" class="tarjeta-small">
                <div class="img-small" style="background-image:url('${img}')"></div>

                <div class="info-small">
                    <h4>${escapeHtml(j.name)}</h4>
                    <p class="gen">${j.genres?.[0]?.name || "—"}</p>

                    <div class="precios-small">
                        <span class="final">Bs. ${precio.final}</span>
                        <span class="orig">Bs. ${precio.base}</span>
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

        const flash = await rawgFetch(`${URL_API}/games?key=${RAWG_KEY}&page_size=5`);
        renderLista(document.getElementById("ofertas-flash"), flash.results);

        const semana = await rawgFetch(`${URL_API}/games?key=${RAWG_KEY}&ordering=released&page_size=8`);
        renderLista(document.getElementById("ofertas-semana"), semana.results);

    } catch (e) {
        console.warn("Error RAWG. Cargando datos locales...", e);

        // Fallback
        const local = await fetch("../Archivos JSON/ofertas.json").then(r => r.json());

        renderOfertaPrincipal(local.destacado[0]);

        renderLista(document.getElementById("ofertas-flash"), local.flash);
        renderLista(document.getElementById("ofertas-semana"), local.semana);
    }
}


// iniciar
document.addEventListener("DOMContentLoaded", cargarOfertas);
