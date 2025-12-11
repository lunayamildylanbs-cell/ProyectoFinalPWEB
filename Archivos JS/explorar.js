<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KFCZONE - Explorar</title>
    <link rel="stylesheet" href="../Archivos CSS/global.css">
    <link rel="stylesheet" href="../Archivos CSS/explorar.css">
</head>
<body>

<header class="encabezado">
  <div class="contenedor encabezado-interno">
    <a href="tienda.html" class="logo">
      <img src="../Archivos IMG/logo.png" alt="KFCZONE Logo" class="logo-KFCZONE">
    </a>

    <!-- navegacion principal -->
    <nav class="navegacion-principal">
      <a href="tienda.html" class="enlace-nav">TIENDA</a>
      <a href="explorar.html" class="enlace-nav">EXPLORAR</a>
      <a href="ofertas.html" class="enlace-nav">OFERTAS</a>
    </nav>

    <div class="zona-acciones">
      
      <input name="q" type="search" class="buscar" placeholder="Buscar juegos">
        <button type="button" class="btn-icon buscar-btn">🔎</button>

        <a href="carrito.html" class="btn-icon">🛒</a>
        <button type="button" class="btn-icon">👤</button>
    </div>

    <!-- boton hamburguesa -->
    <button class="hamburguesa" id="hamburguesa">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </div>
</header>

<main class="contenedor">

  <!-- encabezado de la pagina explorar -->
  <div class="header-explorar">
    <div>
      <h1 class="titulo-pagina">Explorar juegos</h1>
      <p class="subtitulo">Filtra por genero, plataforma y ordenar resultados</p>
    </div>
  </div>

  <div class="layout-explorar">

    <!-- seccion de filtros -->
    <section class="filtros">
      <form action="#" method="get" class="form-filtros" aria-label="Formulario de filtros">

        <!-- filtro por genero -->
        <fieldset class="grupo-filtro">
          <legend>Genero</legend>
          <label><input type="checkbox" name="genero" value="accion"> Accion</label>
          <label><input type="checkbox" name="genero" value="aventura"> Aventura</label>
          <label><input type="checkbox" name="genero" value="rpg"> RPG</label>
          <label><input type="checkbox" name="genero" value="shooter"> Shooter</label>
          <label><input type="checkbox" name="genero" value="simulacion"> Estrategia</label>
          <label><input type="checkbox" name="genero" value="casual"> Casual</label>
        </fieldset>

        <!-- filtro por plataforma -->
        <fieldset class="grupo-filtro">
          <legend>Plataforma</legend>
          <label><input type="checkbox" name="plataforma" value="switch"> Nintendo Switch</label>
          <label><input type="checkbox" name="plataforma" value="pc"> PC</label>
          <label><input type="checkbox" name="plataforma" value="ps4"> PS4</label>
          <label><input type="checkbox" name="plataforma" value="ps5"> PS5</label>
          <label><input type="checkbox" name="plataforma" value="xbox-one"> Xbox</label>
        </fieldset>

        <button type="submit" class="btn-principal">Aplicar filtros</button>
      </form>
    </section>

    <!-- rejilla donde se mostraran los juegos -->
    <section class="rejilla-juegos" id="contenedor-juegos">
      <div class="placeholder">
        <h4>No se encontraron juegos</h4>
        <p>No se pudo cargar la lista de juegos</p>
      </div>
    </section>

  </div>

</main>

<footer class="pie-pagina">
  <div class="contenedor pie-grid">

    <!-- columna informacion -->
    <div class="col">
      <h4>Sobre KFCZONE</h4>
      <p>Tu tienda de videojuegos de confianza</p>
      <p>© 2025 KFCZONE - Derechos reservados</p>
    </div>

    <!-- columna enlaces -->
    <div class="col">
      <h4>Tienda</h4>
      <a href="tienda.html">Catalogo</a><br>
      <a href="explorar.html">Explorar</a><br>
      <a href="ofertas.html">Ofertas</a><br>
      <a href="carrito.html">Carrito</a>
    </div>

    <!-- columna soporte -->
    <div class="col">
      <h4>Soporte</h4>
      <span>Centro de Ayuda</span><br>
      <span>Contacto</span><br>
    </div>

    <!-- columna legal -->
    <div class="col">
      <h4>Legal</h4>
      <span>Terminos</span><br>
      <span>Politica de Privacidad</span><br>
    </div>

  </div>
</footer>

<!-- scripts -->
<script src="../Archivos JS/explorar.js"></script>
<script src="../Archivos JS/global.js"></script>

</body>
</html>
