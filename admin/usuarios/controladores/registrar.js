const btnRegistrarUsuario = document.querySelector("#btnRegistrarUsuario");

btnRegistrarUsuario.addEventListener("click", async () => {
   
let nombre_completo = txtNombreCompleto.value;
let dni = txtDNIUsuario.value;
let nombre_usuario = txtNombreUsuario.value;
let email = txtEmailUsuario.value;
let tipo_rol = txtTipoRolUsuario.value;
let password = txtContraseñaUsuario.value;
let habilitado = document.querySelector('input[name="habilitado"]:checked').value;

const usuarioData = {
    nombrecompletousuario: nombre_completo,
    dniusuario: dni,
    usuarionombre: nombre_usuario,
    gmailusuario: email,
    tipousuario: tipo_rol,
    contraseña: password,
    habilitado: habilitado
};


    try {
        
        const response = await fetch('http://localhost:3000/usuario/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuarioData)
        });

        const result = await response.json();

        if (result.result_estado === 'ok') {
            alert('Usuario agregado exitosamente.');
            
            txtNombreCompleto.value = '';
            txtNombreUsuario.value = '';
            txtDNIUsuario.value = '';
            txtEmailUsuario.value = '';
            txtTipoRolUsuario.value = '';
            txtContraseñaUsuario.value = '';
            document.querySelector('input[name="habilitado"]:checked').checked = false;
            
        } else {
            alert(`Error al agregar usuario: ${result.result_message}`);
        }
    } catch (error) {
        alert(`Se produjo un error: ${error.message}`);
    }
});


