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