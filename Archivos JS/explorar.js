// config rawg
const RAWG_KEY = "66d71aea9962478a92839e951481b374";
const RAWG_BASE = "https://api.rawg.io/api";

// helpers
async function rawgFetch(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error("Error RAWG: " + r.status);
  return r.json();
}

function fakePrice() {
  const base = Math.round((12 + Math.random() * 40) * 100) / 100;
  const discount = Math.floor(Math.random() * 60);
  const final = Math.round((base * (1 - discount / 100)) * 100) / 100;
  return { base, final, discount };
}

function getParams() {
  return new URLSearchParams(location.search);
}

// renders
function renderTarjetas(container, games) {
  container.innerHTML = "";

  games.forEach(g => {
    const p = g.priceObj || fakePrice();
    const img = g.background_image || "/Archivos IMG/noimg.png";

    const card = document.createElement("article");
    card.className = "juego-card";

    card.innerHTML = `
      <a href="juego.html?id=${g.id}" class="juego-enlace">
        <div class="juego-img" style="background-image:url('${img}')"></div>
        <div class="juego-info">
          <h3 class="juego-nombre">${escapeHtml(g.name)}</h3>
          <p class="juego-detalles">
            ⭐ ${g.rating ?? "—"} • ${g.genres?.map(x => x.name).join(", ") || "—"}
          </p>
          <div class="juego-precio">
            ${
              p.discount > 0
                ? `<span class="precio-tachado">$${p.base.toFixed(2)}</span>
                   <span class="precio-final">$${p.final.toFixed(2)}</span>
                   <span class="precio-desc">${p.discount}%</span>`
                : `<span class="precio-final">$${p.final.toFixed(2)}</span>`
            }
          </div>
        </div>
      </a>
    `;

    container.appendChild(card);
  });
}

function mostrarPlaceholder(container, title = "No se encontraron juegos", text = "Intenta cambiar los filtros") {
  container.innerHTML = `
    <div class="placeholder">
      <h4>${title}</h4>
      <p>${text}</p>
    </div>
  `;
}

// construir url rawg para filtros
function construirURL() {
  const params = getParams();
  let url = `${RAWG_BASE}/games?key=${RAWG_KEY}&page_size=10`;

  // orden
  if (params.get("orden") === "ventas") url += "&ordering=-ratings_count";
  if (params.get("orden") === "puntuacion") url += "&ordering=-rating";

  // generos
  const generos = params.getAll("genero");
  if (generos.length > 0) {
    const traducidos = generos.map(g => {
      if (g === "accion") return "action";
      if (g === "aventura") return "adventure";
      if (g === "rpg") return "role-playing-games-rpg";
      if (g === "shooter") return "shooter";
      if (g === "simulacion") return "strategy";
      return g;
    }).filter(Boolean);
    if (traducidos.length) url += `&genres=${traducidos.join(",")}`;
  }

  // plataformas
  const plataformas = params.getAll("plataforma");
  if (plataformas.length > 0) {
    const tra = plataformas.map(p => {
      if (p === "switch") return "7";
      if (p === "pc") return "4";
      if (p === "ps4") return "18";
      if (p === "ps5") return "187";
      if (p === "xbox-one") return "1";
      return null;
    }).filter(Boolean);
    if (tra.length) url += `&platforms=${tra.join(",")}`;
  }

  return url;
}

// init explorar (carga inicial con filtros)
async function initExplorar(container) {
  const url = construirURL();

  try {
    const data = await rawgFetch(url);
    const juegos = data.results || [];

    if (!juegos.length) {
      mostrarPlaceholder(container, "No se encontraron juegos", "Intenta cambiar los filtros");
      return;
    }

    juegos.forEach(j => j.priceObj = fakePrice());
    renderTarjetas(container, juegos);
  } catch (err) {
    console.error("initExplorar error:", err);
    mostrarPlaceholder(container, "Error al cargar", "Vuelve a intentarlo mas tarde");
  }
}

// buscador (usa rawg search y apunta a juego.html?id=ID)
async function buscarJuegosRAWG(query, container) {
  if (!query || !query.trim()) return;
  container.innerHTML = `<p style="color:white">Buscando juegos...</p>`;

  try {
    const url = `${RAWG_BASE}/games?key=${RAWG_KEY}&search=${encodeURIComponent(query)}&page_size=12`;
    const data = await rawgFetch(url);
    const results = data.results || [];

    if (!results.length) {
      mostrarPlaceholder(container, "No se encontraron juegos", "Prueba con otro nombre");
      return;
    }

    results.forEach(j => j.priceObj = fakePrice());
    renderTarjetas(container, results);
  } catch (err) {
    console.error("buscarJuegosRAWG error:", err);
    mostrarPlaceholder(container, "Error al buscar", "Intenta de nuevo mas tarde");
  }
}

// escape simple para evitar inyeccion en nombres
function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// inicializador global (adjuntar eventos y cargar)
document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("contenedor-juegos");
  if (!contenedor) {
    console.error("No se encontro #contenedor-juegos en el dom");
    return;
  }

  // ejecutar carga inicial basada en query string
  initExplorar(contenedor);

  // selectores del buscador
  const inputBuscar = document.querySelector(".buscar");
  const botonBuscar = document.querySelector(".buscar-btn") || document.querySelector(".btn-icon");

  // si no hay inputBuscar, salir
  if (!inputBuscar) {
    console.warn("No se encontro el input .buscar");
    return;
  }

  // funciones de evento
  const onBuscar = () => {
    const q = inputBuscar.value.trim();
    if (!q) return;
    buscarJuegosRAWG(q, contenedor);
  };

  if (botonBuscar) {
    botonBuscar.addEventListener("click", (e) => {
      e.preventDefault();
      onBuscar();
    });
  } else {
    console.warn("No se encontro boton de busqueda (.buscar-btn ni .btn-icon)");
  }

  inputBuscar.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onBuscar();
    }
  });
});
