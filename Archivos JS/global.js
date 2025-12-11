// boton hamburguesa
const hamburguesa = document.getElementById("hamburguesa");
const nav = document.querySelector(".navegacion-principal");
hamburguesa.addEventListener("click", () => {

  // alternar si el menu se muestra o se oculta
  nav.style.display = nav.style.display === "flex" ? "none" : "flex";
});


// Abrir manual 
<a href="#" onclick="openPDF('MANUAL_TECNICO_PW_1.pdf')">KFCZONE - MANUAL TECNICO PW 1.pdf</a><br>
<a href="#" onclick="openPDF('MANUAL_USUARIO_PW_1.pdf')">KFCZONE - MANUAL USUARIO PW 1.pdf</a>

<!-- Contenedor para el iframe -->
<div id="pdf-container" style="display: none;">
    <iframe id="pdf-frame" src="" width="100%" height="600px"></iframe>
</div>

<script>
    function openPDF(pdfFile) {
        var iframe = document.getElementById("pdf-frame");
        iframe.src = pdfFile;
        document.getElementById("pdf-container").style.display = "block"; // Muestra el iframe
    }
</script>
