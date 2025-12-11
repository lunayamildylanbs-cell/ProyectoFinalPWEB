// config rawg y youtube
const API = "66d71aea9962478a92839e951481b374";
const RAWG_BASE = "https://corsproxy.io/?https://api.rawg.io/api";

// helper fetch json con error
const pedirJson = url => fetch(url).then(r => {
  if (!r.ok) throw new Error(r.status);
  return r.json();
});

// precio random
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

// atajo dom
const el = (sel) => document.getElementById(sel);

// render html directo
const renderHtml = (node, html) => node.innerHTML = html;

// pintar destacado grande
function mostrarDestacado(box, j) {
  renderHtml(box, `
    <div class="destacado-inner" style="background-image:url('${j.background_image}')">
      <div class="dest-overlay"></div>
      <div class="dest-content">
        <span class="dest-etiqueta">DESTACADO</span>
        <h2 class="dest-titulo">${j.name}</h2>
        <p class="dest-descripcion">${(j.description_raw || "").slice(0,200)}...</p>
        <div class="dest-info">
          <span class="dest-badge">⭐ ${j.rating}</span>
          <span class="dest-badge">${j.genres?.[0]?.name || ""}</span>
        </div>
        <a href="juego.html?id=${j.id}" class="dest-boton">Ver mas →</a>
      </div>
    </div>
  `);
}

// plantilla tarjetas de ofertas
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
              <span class="precio-tachado">Bs. ${p.inicial.toFixed(2)}</span>
              <span class="precio-final">Bs. ${p.final.toFixed(2)}</span>
              <span class="precio-desc">${p.descuento}%</span>
            ` : `
              <span class="precio-final">Bs. ${p.final.toFixed(2)}</span>
            `}
          </div>
        </div>
      </a>
    </article>
  `;
};

// plantilla lista nuevos lanzamientos
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
        ${p.descuento ? `<span class="precio-tachado">Bs. ${p.inicial.toFixed(2)}</span>` : ""}
        <span class="precio-final">Bs. ${p.final.toFixed(2)}</span>
      </div>
    </div>
  `;
};

// plantilla top lista simple
const tplTop = j => `
  <li class="top-item">
    <a href="juego.html?id=${j.id}" class="top-nombre">${j.name} — ⭐ ${j.rating}</a>
    <span class="top-precio">Bs. ${j.precio.final.toFixed(2)}</span>
  </li>
`;

// cargar precio
async function cargarPrecio(j) {
  try {
    const det = await pedirJson(`${URL_API}/games/${j.id}?key=${API}`);
    j.description_raw = det.description_raw;
    j.precio = precioAleatorio();
  } catch {
    j.precio = precioAleatorio();
  }
}

// cargar lista de juegos
async function cargarLista(url, size) {
  const r = await pedirJson(`${url}&page_size=${size}`);
  const juegos = r.results;

  await Promise.all(juegos.map(cargarPrecio));

  return juegos;
}

// iniciar tienda
async function iniciarTienda() {
  try {
    const [top] = await cargarLista(`${URL_API}/games?key=${API}&ordering=-suggestions_count`, 1);

    mostrarDestacado(el("seccion-destacado"), top);

    const [ofertas, nuevos, topV] = await Promise.all([
      cargarLista(`${URL_API}/games?key=${API}&ordering=-added`, 6),
      cargarLista(`${URL_API}/games?key=${API}&ordering=rating`, 6),
      cargarLista(`${URL_API}/games?key=${API}&ordering=-playtime`, 8)
    ]);

    renderHtml(el("lista-ofertas"), `<div class="ofertas-grid">${ofertas.slice(0,3).map(tplOferta).join("")}</div>`);
    renderHtml(el("lista-nuevos"), nuevos.slice(0,4).map(tplNuevo).join(""));
    renderHtml(el("lista-top"), topV.map(tplTop).join(""));

  } catch (e) {
    console.warn("ERROR RAWG. Cargando datos locales...");

    const local = await fetch("../Archivos JSON/tienda.json").then(r => r.json());

    const destacado = local.destacado[0];
    destacado.precio = precioAleatorio();

    mostrarDestacado(el("seccion-destacado"), destacado);

    const ofertas = local.ofertas.map(j => ({ ...j, precio: precioAleatorio() }));
    const nuevos = local.nuevos.map(j => ({ ...j, precio: precioAleatorio() }));
    const top = local.top.map(j => ({ ...j, precio: precioAleatorio() }));

    renderHtml(el("lista-ofertas"), `<div class="ofertas-grid">${ofertas.slice(0,3).map(tplOferta).join("")}</div>`);
    renderHtml(el("lista-nuevos"), nuevos.slice(0,4).map(tplNuevo).join(""));
    renderHtml(el("lista-top"), top.map(tplTop).join(""));
  }
}


document.addEventListener("DOMContentLoaded", iniciarTienda);
