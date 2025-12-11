// boton hamburguesa
const hamburguesa = document.getElementById("hamburguesa");
const nav = document.querySelector(".navegacion-principal");
hamburguesa.addEventListener("click", () => {

  // alternar si el menu se muestra o se oculta
  nav.style.display = nav.style.display === "flex" ? "none" : "flex";
});
