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

async function cargarInsumos() {
    try {
        const punto_control_id = localStorage.getItem("puntoDeControlId")
        const response = await fetch(`http://localhost:3000/api-giro/insumo/${punto_control_id}`); 
        const insumos = await response.json();

        const dataList = document.getElementById('insumos');
        dataList.innerHTML = '';

        insumos.result_data.forEach(insumo => {
            const option = document.createElement('option');
            option.value = insumo.nombre_insumo;
            option.setAttribute("data-id", insumo.id)
            dataList.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar insumos:', error);
    }
}

function añadirInsumo() {
    const insumoNombre = document.getElementById('buscarInsumo');
    const cantidad = document.getElementById('cantidadInsumo').value;
    if (insumoNombre || cantidad) {
        // alert("Por favor, ingrese el nombre y la cantidad del insumo.");
        // return;
        document.getElementById('insumosTable').hidden = false;
        const table = document.getElementById('insumosTable').querySelector('tbody');
        const row = document.createElement('tr');
        const dataList = document.getElementById("insumos")
        const option = Array.from(dataList.options).find(opt => opt.value === insumoNombre.value);
        console.log(option)
        row.innerHTML = `
            <tr>
                <th>${option.getAttribute('data-id')}</th>
                <th>${insumoNombre.value}</th>
                <th>${cantidad}</th>
                <td><button type="button" onclick="eliminarFila(this)">Eliminar</button></td>
            </tr>
        `

        // Añadir la fila a la tabla
        table.appendChild(row);

        // Limpiar campos de insumo
        document.getElementById('buscarInsumo').value = '';
        document.getElementById('cantidadInsumo').value = '';
    }

}

function eliminarFila(btn) {
    btn.closest("tr").remove();
}

function cancelarInsumos() {
    document.getElementById('insumoContainer').style.display = 'none';
    document.getElementById('insumosTable').querySelector('tbody').innerHTML = '';
}
