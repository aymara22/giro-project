function validarUsuario(datos) {
    const { nombre_completo, dni, nombre_usuario, email, tipo_usuario, password, activo } = datos;

    // Verificar que todos los campos estén presentes
    if (!nombre_completo || !dni || !nombre_usuario || !email || !tipo_usuario || !password || activo === undefined) {
        return { success: false, error: "Todos los campos son obligatorios." };
    }

    // Verificar que tipo_usuario sea "ADMIN" o "VIEWER"
    if (tipo_usuario !== "ADMIN" && tipo_usuario !== "VIEWER") {
        return { success: false, error: "El campo 'tipo_usuario' debe ser 'ADMIN' o 'VIEWER'." };
    }

    // Si todas las validaciones pasan
    return { success: true };
}


module.exports= {validarUsuario}