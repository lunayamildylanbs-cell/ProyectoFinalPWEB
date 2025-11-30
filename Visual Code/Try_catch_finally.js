/* LUNA QUISPE YAMIL DYLAN */

async function main() {
    /* 1. REGISTRO DE ESTUDIANTES */
    console.log("----REGISTRO DE ESTUDIANTES----")

    const estudiantes = [];

    async function registrarEstudiante(est) {
        try{
            if (!est.nombre || est.nombre.length < 3){
                throw new Error("Nombre invalido");
            }
            if (isNaN(est.edad) || est.edad < 4 || est.edad > 80) {
                throw new Error("Edad fuera de rango");
            } 
            if (!est.carrera.includes("Ingenieria")) {
                throw new Error("Carrera debe incluir 'Ingenieria'");
            }

            estudiantes.push(est);
            console.log("REGISTRADO: ", est.nombre);
        } catch (e) {
            console.log("ERROR: ", e.message);
        } finally {
            console.log("Total de Estudiantes: ", estudiantes.length);
        }
    }
    await registrarEstudiante ({nombre: "Katari", edad: 21, carrera: "Ingenieria de Sistemas"});
    await registrarEstudiante ({nombre: "Di", edad: 18, carrera: "Arquitectura"});
    await registrarEstudiante ({nombre: "Alberto", edad: 18, carrera: "Arquitectura"});
    await registrarEstudiante ({nombre: "Owen", edad: 81, carrera: "Ingenieria Industrial"});
    await registrarEstudiante ({nombre: "Fabiana", edad: 21, carrera: "Ingenieria Civil"});

    /* 2. PROCESO DE COMPRA */
    console.log("----PROCESO DE COMPRA----");

    async function procesarCompra(items) {
        try {
            if (!items.length) {
                throw new Error("Carrito vacio");
            }

            let total = 0;
            for (let i of items) {
                if (isNaN(i.precio) || i.precio <= 0) {
                    throw new Error("Precio invalido");
                }
                if (isNaN(i.cantidad) || i.cantidad < 1) {
                    throw new Error("Cantidad invalida");
                }
                total += i.precio * i.cantidad;
            }
            if (total > 500) {
                throw new Error("Monto excede Bs 500");
            }

            console.log("Compra valida, total de: ",total);
        } catch (e) {
            console.error("ERROR: ",e.message);
        } finally {
            console.log("Compra finalizada");
        }
    }
    await procesarCompra([{producto: "Teclado",precio: 150, cantidad: 2}]);
    await procesarCompra([{producto: "Teclado",precio: 150, cantidad: 0}]);
    await procesarCompra([{producto: "PC",precio: 1500, cantidad: 2}]);


    /* 3. INICIO DE SESION  */
    console.log("----INICIO DE SESION----")

    const usuarios = [
        { user: "KatariYork", pass: "1234"},
        { user: "DesktopL2455sd", pass: "abcd"}
    ];

    async function login(usuario, contraseña) {
        try {
            if (!usuario || !contraseña) {
                throw new Error("Campo vacio");
            }
            
            const u = usuarios.find(x =>x.user === usuario);
            if (!u) {
                throw new Error("Usuario no existe");
            }
            if (u.pass !== contraseña) {
                throw new Error("Contraseña Incorrecta");
            }

            console.log("Bienvenido", usuario)
        } catch (e) {
            console.error("ERROR: ",e.message);
        } finally {
            console.log("Iniciando sesion");
        }        
    }
    await login("KatariYork", "1234");
    await login("DesktopL2455sd", "xyzv");
    await login("Shikanoko", "9876");

    /* 4. ASISTENCIA DE ESTUDIANTES */
    console.log("----REGISTRO DE ASISTENCIA----");

    const asistencia = [];

    async function registrarAsistencia(nombre, presente) {
        try {
            if (!nombre || nombre.length < 3) {
                throw new Error("Nombre invalido");
            }
            if (typeof presente !== "boolean") {
                throw new Error("Debe ser true o false");
            }

            asistencia.push({ nombre, presente });
            console.log("Asistencia registrada: ",nombre);
        } catch (e) {
            console.error("Error:", e.message);
        } finally {
            console.log("Registros: ",asistencia.length);
        }

    }
    await registrarAsistencia("Alina Alvarez", true);
    await registrarAsistencia("Di", "si");
    await registrarAsistencia("Diana", "true");

    /* 5. BANCO */
    console.log("----BANCO----");
    const cuentas = [
        { titular: "Cesar Nina", saldo: 5500},
        { titular: "Madeleyne Laura", saldo: 750}
    ];

    async function moverDinero(titular, monto) {
        try {
            const cuenta = cuentas.find(c => c.titular === titular);
            if (!cuenta) {
                throw new Error("Cuenta no encontrada");
            }
            if (cuenta.saldo + monto < 0) {
                throw new Error("Saldo insuiciente");
            }
            cuenta.saldo += monto;
        } catch (e) {
            console.error("Error: ",e.message);
        } finally {
            console.log("Cuentas registradas: ", cuentas.length);
            console.log("Estado de cuentas: ",cuentas);
        }
    }

    await moverDinero("Cesar Nina", -200);
    await moverDinero("Madeleyne Laura", 500);
    await moverDinero("Rita Higueras", 100);
        
}
main();