document.addEventListener('DOMContentLoaded', function () {
    cerrarSesion();
    validarSesion();
});

function cerrarSesion() {
    let cerrarSesion = document.querySelector(".logOut")
    cerrarSesion.addEventListener("click", function () {
        localStorage.clear()
        window.location.href = "/admin/auth/login.html"
    })
}

function validarSesion() {
    let sesion = localStorage.getItem("isLoggedIn")
    let userSession = localStorage.getItem("userSession")
    if (!sesion || !userSession) {
        window.location.href = "/admin/auth/login.html"   
    }
}

async function obtenerPuntoDeControl(punto) {
    try {
        const response = await fetch(`http://localhost:3000/api-giro/punto_de_control/${punto}`);
        const result = await response.json();
        if (result.success == true) {
            localStorage.setItem("puntoDeControlId", result.result_data[0].id)
        } else {
            console.error(result.result_message)
        }
    } catch (error) {
        console.error('Error al intentar obtener el punto de control:', error);
    }
}