const hamburguesa = document.getElementById("hamburguesa");
const nav = document.querySelector(".navegacion-principal");

hamburguesa.addEventListener("click", () => {
  nav.style.display = nav.style.display === "flex" ? "none" : "flex";
});
