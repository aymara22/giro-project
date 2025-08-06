document.addEventListener('DOMContentLoaded', function () {
    validarPerfil();
});

function validarPerfil(){
    let profile = localStorage.getItem("userProfile")
    if (profile == 'VIEWER') {
        window.location.href = "/admin/index.html"
    }
}