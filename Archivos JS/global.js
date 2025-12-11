// boton hamburguesa
const hamburguesa = document.getElementById("hamburguesa");
const nav = document.querySelector(".navegacion-principal");
hamburguesa.addEventListener("click", () => {

  // alternar si el menu se muestra o se oculta
  nav.style.display = nav.style.display === "flex" ? "none" : "flex";
});


// Abrir manual 
document.addEventListener("DOMContentLoaded", function () {
    const pdfLinks = document.querySelectorAll(".pdf-link");
    const pdfContainer = document.getElementById("pdf-container");
    const pdfFrame = document.getElementById("pdf-frame");

    pdfLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault(); 
            const pdfPath = this.getAttribute("data-pdf");
            pdfFrame.src = pdfPath;
            pdfContainer.style.display = "block";
        });
    });
});
