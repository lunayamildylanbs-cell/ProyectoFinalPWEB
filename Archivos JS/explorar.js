// config rawg
const RAWG_KEY = "66d71aea9962478a92839e951481b374";
const RAWG_BASE = "https://api.rawg.io/api";

// fetch con fallback json local (misma logica que tienda)
const pedirJson = url => fetch(url).then(r => {
  if (!r.ok) throw new Error(r.status);
  return r.json();
});

// precio random (igual al tuyo)
const precioAleatorio = () => {
  const base = +(Math.random() * 40 + 12).toFixed(2);
  if (Math.random() < .45) {
    const d = Math.floor(Math.random() * 60) + 5;
    return {
      final: +(base * (1 - d / 100)).toFixed(2),
      inicial: base,
      descuento: d
    };
  }
  return { final: base, inicial: base, descuento: 0 };
};

// utilidades
function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function getParams() {
  return new URLSearchParams(location.search);
}

function renderHtml(node, html) {
  node.innerHTML = html;
}

// render tarjetas
function renderTarjetas(container, juegos) {
  renderHtml(container, "");

  juegos.forEach(j => {
    const p = j.precio || precioAleatorio();
    const img = j.background_image || "/Archivos IMG/noimg.png";

    container.innerHTML += `
      <article class="juego-card">
        <a href="juego.html?id=${j.id}" class="juego-enlace">
          <div class="juego-img" style="background-image:url('${img}')"></div>

          <div class="juego-info">
            <h3 class="juego-nombre">${escapeHtml(j.name)}</h3>
            <p class="juego-detalles">
              ⭐ ${j.rating ?? "—"} • ${j.genres?.map(g=>g.name).join(", ") ?? "—"}
            </p>

            <div class="juego-precio">
              ${
                p.descuento
                ? `
                  <span class="precio-tachado">Bs. ${p.inicial.toFixed(2)}</span>
                  <span class="precio-final">Bs. ${p.final.toFixed(2)}</span>
                  <span class="precio-desc">${p.descuento}%</span>
                `
                : `<span class="precio-final">Bs. ${p.final.toFixed(2)}</span>`
              }
            </div>
          </div>
        </a>
      </article>
    `;
  });
}

function placeholder(c) {
  renderHtml(c, `
    <div class="placeholder">
      <h4>No se encontraron juegos</h4>
      <p>Intenta cambiar los filtros o buscar otro nombre</p>
    </div>
  `);
}

// construir url rawg segun filtros
function construirURL() {
  const p = getParams();
  let url = `${RAWG_BASE}/games?key=${RAWG_KEY}&page_size=20`;

  if (p.get("orden") === "ventas") url += "&ordering=-ratings_count";
  if (p.get("orden") === "puntuacion") url += "&ordering=-rating";

  const gen = p.getAll("genero");
  if (gen.length) {
    const tr = gen.map(g => ({
      accion: "action",
      aventura: "adventure",
      rpg: "role-playing-games-rpg",
      shooter: "shooter",
      simulacion: "strategy",
      casual: "casual"
    }[g] || null)).filter(Boolean);

    if (tr.length) url += `&genres=${tr.join(",")}`;
  }

  const plat = p.getAll("plataforma");
  if (plat.length) {
    const tr = plat.map(x => ({
      switch: "7",
      pc: "4",
      ps4: "18",
      ps5: "187",
      "xbox-one": "1"
    }[x] || null)).filter(Boolean);

    if (tr.length) url += `&platforms=${tr.join(",")}`;
  }

  return url;
}

// carga explorar con fallback json (misma logica que tienda)
async function initExplorar() {
  const cont = document.getElementById("contenedor-juegos");
  if (!cont) return;

  const url = construirURL();

  try {
    const data = await pedirJson(url);
    let juegos = data.results || [];

    if (!juegos.length) return placeholder(cont);

    juegos = juegos.map(j => ({ ...j, precio: precioAleatorio() }));

    renderTarjetas(cont, juegos);

  } catch (e) {
    console.warn("rawg fallo. cargando json local /Archivos JSON/explorar.json");

    try {
      const local = await fetch("/Archivos JSON/explorar.json").then(r => r.json());

      let juegos = local.results || [];
      if (!juegos.length) return placeholder(cont);

      juegos = juegos.map(j => ({ ...j, precio: precioAleatorio() }));
      renderTarjetas(cont, juegos);

    } catch (err) {
      console.error("no hay rawg ni json local");
      placeholder(cont);
    }
  }
}

// buscador rawg con fallback local
async function buscar(query) {
  const cont = document.getElementById("contenedor-juegos");
  if (!query.trim()) return;

  renderHtml(cont, `<p style="color:white">Buscando...</p>`);

  const url =
    `${RAWG_BASE}/games?key=${RAWG_KEY}&search=${encodeURIComponent(query)}&page_size=12`;

  try {
    const data = await pedirJson(url);
    let juegos = data.results || [];

    if (!juegos.length) return placeholder(cont);

    juegos = juegos.map(j => ({ ...j, precio: precioAleatorio() }));
    renderTarjetas(cont, juegos);

  } catch {
    console.warn("buscador rawg fallo. usando explorar.json local");

    const local = await fetch("/Archivos JSON/explorar.json").then(r => r.json());
    let juegos = local.results.filter(x =>
      x.name.toLowerCase().includes(query.toLowerCase())
    );

    if (!juegos.length) return placeholder(cont);

    juegos = juegos.map(j => ({ ...j, precio: precioAleatorio() }));
    renderTarjetas(cont, juegos);
  }
}

// eventos
document.addEventListener("DOMContentLoaded", () => {
  initExplorar();

  const input = document.querySelector(".buscar");
  const btn = document.querySelector(".buscar-btn") || document.querySelector(".btn-icon");

  if (!input) return;

  const hacerBusqueda = () => buscar(input.value.trim());

  if (btn) btn.onclick = e => {
    e.preventDefault();
    hacerBusqueda();
  };

  input.onkeydown = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      hacerBusqueda();
    }
  };
});
