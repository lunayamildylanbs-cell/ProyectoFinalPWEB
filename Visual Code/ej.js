// Registro de estudiantes con múltiples validaciones
const estudiantes = [];

// Validar estudiante
function validarEstudiante(obj) {
    if (!obj.nombre || obj.nombre.length < 3) {
        throw new Error("Nombre invalido (debe tener al menos 3 caracteres)");
    }

    if (isNaN(obj.edad) || obj.edad < 4 || obj.edad > 80) {
        throw new Error("Edad invalida (rango permitido: 4 a 80)");
    }

    if (!obj.carrera.includes("Ing")) {
        throw new Error("Carrera invalida (debe incluir 'Ing')");
    }

    return true;
}

// Guardar estudiante
async function registrarEstudiante(est) {
    try {
        console.log("Intentando registrar estudiante...", est);

        validarEstudiante(est);
        estudiantes.push(est);

        console.log("✅ Estudiante registrado:", est);

    } catch (e) {
        console.error("❌ Fallo en registro:", e.message);
    } finally {
        console.log("📌 Registro procesado, estudiantes actuales:", estudiantes.length);
        console.log("Proceso de registro finalizado\n");
    }
}

registrarEstudiante({ nombre: "Ana", edad: 21, carrera: "Ing de Sistemas" });
registrarEstudiante({ nombre: "Li", edad: 18, carrera: "Arquitectura" });
registrarEstudiante({ nombre: "Carlos", edad: "veinte", carrera: "Ing Comercial" });



/* Procesar compra con varios pasos y throw personalizados */
const carrito = [
    { producto: "Teclado", precio: 120, cantidad: 1 },
    { producto: "Mouse Gamer", precio: 90, cantidad: 2 }
];

async function procesarCompra(items) {
    try {
        console.log("🛒 Analizando carrito...");

        if (!items || items.length === 0) {
            throw new Error("El carrito esta vacio ❌");
        }

        let total = 0;
        for (let item of items) {
            console.log(`Producto: ${item.producto}, Precio: ${item.precio}, Cantidad: ${item.cantidad}`);

            if (item.precio <= 0 || isNaN(item.precio)) {
                throw new Error("Precio invalido en producto: " + item.producto);
            }
            if (item.cantidad < 1 || isNaN(item.cantidad)) {
                throw new Error("Cantidad invalida en producto: " + item.producto);
            }

            total += item.precio * item.cantidad;
        }

        console.log("✅ Carrito valido. Total a pagar: $", total);

        if (total > 300) {
            throw new Error("El monto excede el limite permitido de $300 ❌");
        }

        console.log("✅ Compra exitosa, preparando entrega...");

    } catch (error) {
        console.error("⚠️ Error en el proceso de compra:", error.message);
    } finally {
        console.log("📦 Operación de compra finalizada\n");
    }
}

procesarCompra(carrito);
procesarCompra([{ producto: "PC", precio: 1500, cantidad: 1 }]);


/* Sistema de inicio de sesión con errores controlados */
const usuarios = [
    { user: "admin", pass: "1234" },
    { user: "juan", pass: "abcd" }
];

async function login(usuario, contrasena) {
    try {
        console.log(`🔐 Intentando login de usuario: ${usuario}`);

        if (!usuario || !contrasena) {
            throw new Error("Debe ingresar usuario y contraseña");
        }

        const encontrado = usuarios.find(u => u.user === usuario);

        if (!encontrado) {
            throw new Error("Usuario no registrado");
        }

        if (contrasena !== encontrado.pass) {
            throw new Error("Contraseña incorrecta");
        }

        console.log("✅ Acceso exitoso. Bienvenido", usuario);

    } catch (err) {
        console.error("❌ Error de login:", err.message);
    } finally {
        console.log("🔚 Fin de proceso de inicio de sesión\n");
    }
}

login("admin", "1234");
login("juan", "xyz");
login("", "123");





// Control de asistencia de estudiantes
const asistenciaEstudiantes = [];

async function registrarAsistencia(nombre, presente) {
    try {
        console.log("📋 Registrando asistencia para:", nombre);

        if (!nombre || nombre.trim().length < 3) {
            throw new Error("Nombre inválido ❌");
        }

        if (presente !== true && presente !== false) {
            throw new Error("Debe indicar si el estudiante está presente o ausente");
        }

        const registro = {
            nombre: nombre.trim(),
            presente: presente,
            fecha: new Date().toLocaleDateString()
        };

        asistenciaEstudiantes.push(registro);
        console.log("✅ Asistencia registrada:", registro);

    } catch (error) {
        console.error("⚠️ Error en registro de asistencia:", error.message);
    } finally {
        console.log("📌 Proceso de asistencia finalizado. Total registros:", asistenciaEstudiantes.length, "\n");
    }
}

// Pruebas
registrarAsistencia("Ana López", true);
registrarAsistencia("Li", false);
registrarAsistencia("Carlos", "sí");





// Biblioteca: préstamo y devolución de libros
const libros = [
    { titulo: "El Quijote", disponible: true },
    { titulo: "Cien años de soledad", disponible: true }
];

async function gestionarLibro(titulo, accion, usuario) {
    try {
        console.log(`📚 Usuario: ${usuario} - Acción: ${accion} - Libro: ${titulo}`);

        if (!titulo || titulo.trim() === "") {
            throw new Error("Debe indicar el título del libro");
        }

        if (!usuario || usuario.trim() === "") {
            throw new Error("Debe ingresar el nombre del usuario");
        }

        const libro = libros.find(l => l.titulo === titulo);
        if (!libro) {
            throw new Error("Libro no encontrado en la biblioteca");
        }

        if (accion === "prestar") {
            if (!libro.disponible) {
                throw new Error("El libro ya está prestado");
            }
            libro.disponible = false;
            console.log("✅ Libro prestado exitosamente:", libro.titulo);

        } else if (accion === "devolver") {
            if (libro.disponible) {
                throw new Error("El libro ya está disponible en la biblioteca");
            }
            libro.disponible = true;
            console.log("✅ Libro devuelto correctamente:", libro.titulo);

        } else {
            throw new Error("Acción inválida (usar 'prestar' o 'devolver')");
        }

    } catch (err) {
        console.error("⚠️ Error en gestión de libros:", err.message);
    } finally {
        console.log("📌 Operación de biblioteca finalizada\n");
    }
}

// Pruebas
gestionarLibro("El Quijote", "prestar", "Ana");
gestionarLibro("El Quijote", "prestar", "Pedro");
gestionarLibro("El Quijote", "devolver", "Ana");
gestionarLibro("Cien años de soledad", "prestar", "Carlos");
