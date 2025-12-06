// RAWG y YOUTUBE
const API = "66d71aea9962478a92839e951481b374";
const URL_API = "https://api.rawg.io/api";

const pedirJson = url => fetch(url).then(r => {
  if (!r.ok) throw new Error(r.status);
  return r.json();
});

// STEAM
const obtenerIdSteam = (tiendas = []) =>
  tiendas.find(t => t.url?.match(/app\/(\d+)/))
    ?.url.match(/app\/(\d+)/)?.[1] || null;

async function obtenerPrecioSteam(id) {
  if (!id) return null;

  try {
    const data = await pedirJson(
      `https://store.steampowered.com/api/appdetails?appids=${id}&cc=US&l=en`
    );
    const p = data[id]?.data?.price_overview;
    if (!p) return null;

    return {
      final: p.final / 100,
      inicial: p.initial / 100,
      descuento: p.discount_percent
    };
  } catch {
    return null;
  }
}

const precioAleatorio = () => {
  const base = +(Math.random() * 40 + 8).toFixed(2);

  if (Math.random() < .4) {
    const d = Math.floor(Math.random() * 60) + 10;
    return {
      final: +(base * (1 - d / 100)).toFixed(2),
      inicial: base,
      descuento: d
    };
  }
  return { final: base, inicial: base, descuento: 0 };
};


const el = (sel) => document.getElementById(sel);

const renderHtml = (node, html) => node.innerHTML = html;

// DESTACADO
function mostrarDestacado(box, j) {
  renderHtml(box, `
    <div class="destacado-inner" style="background-image:url('${j.background_image}')">
      <div class="dest-overlay"></div>
      <div class="dest-content">
        <span class="dest-etiqueta">Destacado</span>
        <h2 class="dest-titulo">${j.name}</h2>
        <p class="dest-descripcion">${(j.description_raw||"").slice(0,200)}...</p>
        <div class="dest-info">
          <span class="dest-badge">⭐ ${j.rating}</span>
          <span class="dest-badge">${j.genres?.[0]?.name || ""}</span>
        </div>
        <a href="juego.html?id=${j.id}" class="dest-boton">Ver más →</a>
      </div>
    </div>
  `);
}

// OFERTAS / NUEVOS / TOP 
const tplOferta = j => {
  const p = j.precio;
  return `
    <article class="oferta-card">
      <a href="juego.html?id=${j.id}" class="oferta-enlace">
        <div class="oferta-img" style="background-image:url('${j.background_image}')"></div>
        <div class="oferta-info">
          <div class="oferta-nombre">${j.name}</div>
          <small class="oferta-genero">${j.genres?.[0]?.name || ""}</small>

          <div class="oferta-precio">
            ${p.descuento ? `
              <span class="precio-tachado">$${p.inicial.toFixed(2)}</span>
              <span class="precio-final">$${p.final.toFixed(2)}</span>
              <span class="precio-desc">${p.descuento}%</span>
            ` : `
              <span class="precio-final">$${p.final.toFixed(2)}</span>
            `}
          </div>
        </div>
      </a>
    </article>
  `;
};

const tplNuevo = j => {
  const p = j.precio;
  return `
    <div class="nuevo-item">
      <div class="nuevo-info">
        <div class="nuevo-img" style="background-image:url('${j.background_image}')"></div>
        <div>
          <a href="juego.html?id=${j.id}" class="nuevo-nombre">${j.name}</a>
          <small class="nuevo-detalles">
            ⭐ ${j.rating} • ${j.genres?.map(x => x.name).join(", ")} • ${j.released?.slice(0,4)}
          </small>
        </div>
      </div>

      <div class="nuevo-precio">
        ${p.descuento ? `<span class="precio-tachado">$${p.inicial.toFixed(2)}</span>` : ""}
        <span class="precio-final">$${p.final.toFixed(2)}</span>
      </div>
    </div>
  `;
};

const tplTop = j => `
  <li class="top-item">
    <a href="juego.html?id=${j.id}" class="top-nombre">${j.name} — ⭐ ${j.rating}</a>
    <span class="top-precio">$${j.precio.final.toFixed(2)}</span>
  </li>
`;


async function cargarPrecio(j) {
  const det = await pedirJson(`${URL_API}/games/${j.id}?key=${API}`);
  const id = obtenerIdSteam(det.stores);
  j.precio = await obtenerPrecioSteam(id) || precioAleatorio();
}

async function cargarLista(url, size) {
  const r = await pedirJson(`${url}&page_size=${size}`);
  const juegos = r.results;
  for (const j of juegos) await cargarPrecio(j);
  return juegos;
}


async function iniciarTienda() {
  try {
    // DESTACADO
    let [top] = (await cargarLista(`${URL_API}/games?key=${API}&ordering=-metacritic`, 1));
    const det = await pedirJson(`${URL_API}/games/${top.id}?key=${API}`);
    top.description_raw = det.description_raw || "";
    top.precio = await obtenerPrecioSteam(obtenerIdSteam(det.stores)) || precioAleatorio();
    mostrarDestacado(el("seccion-destacado"), top);

    // OFERTAS
    const ofertas = await cargarLista(`${URL_API}/games?key=${API}&ordering=-added`, 6);
    renderHtml(el("lista-ofertas"), `<div class="ofertas-grid">${ofertas.slice(0,3).map(tplOferta).join("")}</div>`);

    // NUEVOS
    const nuevos = await cargarLista(`${URL_API}/games?key=${API}&ordering=-released`, 6);
    renderHtml(el("lista-nuevos"), nuevos.slice(0,4).map(tplNuevo).join(""));

    // TOP
    const topV = await cargarLista(`${URL_API}/games?key=${API}&ordering=-ratings_count`, 8);
    renderHtml(el("lista-top"), topV.map(tplTop).join(""));
  } catch (e) {
    console.error("Tienda error:", e);
  }
}

document.addEventListener("DOMContentLoaded", iniciarTienda);



