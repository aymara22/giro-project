document.addEventListener("DOMContentLoaded", ()=>{
    cargarPuntoDeControl();
    agregarMaterial();
    cargarInsumos();
})

async function cargarPuntoDeControl(){
    try {
        const user_id = localStorage.getItem("userSession")
        const response = await fetch(`http://localhost:3000/api-giro/punto_de_control/user/${user_id}`);

        const punto_de_control = await response.json();

        const origenSelect = document.getElementById('punto_control');
        const option= document.createElement("option");
        option.value = punto_de_control.result_data[0].id;
        option.textContent = punto_de_control.result_data[0].punto_de_control;
        origenSelect.appendChild(option)
        localStorage.setItem("puntoDeControlId", punto_de_control.result_data[0].id )
    } catch (error) {
        console.error('Error al cargar punto de control:', error);
    }

}

function agregarMaterial() {
    const select = document.getElementById("materialSelect");
    const material = select.value;

    if (material){
        document.getElementById('materialTable').hidden = false;
        const tableBody = document.querySelector("#materialTable tbody");
        const newRow = document.createElement("tr");
    
        newRow.innerHTML = `
            <td class="material-nombre">${material}</td>
            <td><input type="number" class="material-cantidad" name="cantidad_${material}" placeholder="0" min="0"></td>
            <td>
                <select class="material-unidad" name="unidad_${material}">
                    <option value="" disabled selected>Selecciona una opción</option>
                    <option value="unidad">Unidad</option>
                    <option value="bolsa">Bolsa</option>
                    <option value="bolson">Bolsón</option>
                    <option value="contenedor">Contenedor</option>
                    <option value="volquete">Volquete</option>
                    <option value="kg">Kg</option>
                    <option value="litros">Litros</option>
                </select>
            </td>
            <td><button type="button" class="btnEliminar" onclick="eliminarFila(this)">Eliminar</button></td>
        `;
    
        tableBody.appendChild(newRow);
        select.selectedIndex = 0;
    }

}



document.getElementById("form-certificado").addEventListener("submit", async function (e) {
    e.preventDefault(); // Evita que se recargue la página

    // Obtener valores de campos principales
    const puntoGiro = document.getElementById("punto_control").value;
    const categoria = document.getElementById("categorias").value;
    const nombreEmpresa = document.getElementById("nombreEmpresa").value;
    const nombreRepresentante = document.getElementById("nombreRepresentante").value;
    const dni = document.getElementById("dni").value;
    const telefono = document.getElementById("contacto").value;

    // Obtener materiales seleccionados dinámicamente desde la tabla
    const materiales = [];
    document.querySelectorAll("#materialTable tbody tr").forEach(row => {
        const material = row.querySelector(".material-nombre").textContent;
        const cantidad = row.querySelector(".material-cantidad").value;
        const unidad = row.querySelector(".material-unidad").value;

        materiales.push({
            material,
            cantidad,
            unidad_material: unidad
        });
    });

    const insumos = [];
    document.querySelectorAll("#insumosTable tbody tr").forEach(row => {
        insumos.push({
            id: row.children[0].textContent,
            nombre_insumo: row.children[1].textContent,
            cantidad: row.children[2].textContent
        });
    });

    // Crear objeto con toda la información
    const data = {
        punto_control_id: puntoGiro,
        categoria,
        nombre_empresa: nombreEmpresa,
        nombre_representante: nombreRepresentante,
        dni,
        telefono,
        materiales,
        insumos
    };
    console.log(data)

    try {
        // Llamada al endpoint inventado
        const response = await fetch("http://localhost:3000/api-giro/movimiento", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success == true) {
            Swal.fire({
                icon: "success",
                title: "¡Formulario guardado con exito!",
                text: result.result_message
            }).then(() => {
                if(localStorage.getItem("userProfile") == 'ADMIN'){   
                    window.location.href = "historial.html";
                }else{
                    window.location.href = "movimiento.html";
                }
            });;
        } else {
            Swal.fire({
                icon: "error",
                title: "!Error al guardar el movimiento!",
                text: result.result_message
            });
        }
    } catch (error) {
        throw new Error("Error al guardar los datos: " ,error);
    }
});

async function cargarMovimientos() {
    const API_LISTADO = "http://localhost:3000/api-giro/movimiento";
    const tbody = document.querySelector("#tablaMovimientos tbody");
    try {
        const response = await fetch(API_LISTADO);
        const data = await response.json();

        if (!data.success) {
            alert("Error cargando movimientos");
            return;
        }

        data.result_data.forEach(mov => {
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${mov.id}</td>
                <td>${mov.punto_control}</td>
                <td>${mov.categoria}</td>
                <td>${new Date(mov.fecha_creacion).toLocaleDateString()}</td>
                <td>${mov.nombre_empresa}</td>
                <td>${mov.nombre_representante}</td>
                <td>${mov.dni}</td>
                <td>${mov.telefono}</td>
            `;

            fila.addEventListener("click", () => cargarDetalle(mov.id));
            tbody.appendChild(fila);
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

// Función para cargar los detalles de un movimiento
async function cargarDetalle(id) {
    try {
        const API_DETALLE = "http://localhost:3000/api-giro/movimiento/";
        const detalleDiv = document.getElementById("detalle");
        const response = await fetch(API_DETALLE + id);
        const data = await response.json();

        if (!data.success) {
            Swal.fire({
                icon: "info",
                title: "!No fue posible obtener el detalle!",
                text: data.result_message
            });
            return
        }

        const mov = data.result_data;

        document.getElementById("detalleId").textContent = mov.id;
        document.getElementById("detalleCategoria").textContent = mov.categoria;
        document.getElementById("detalleFecha").textContent = new Date(mov.fecha_creacion).toLocaleDateString();
        document.getElementById("detalleEmpresa").textContent = mov.nombre_empresa;
        document.getElementById("detalleRepresentante").textContent = mov.nombre_representante;
        document.getElementById("detalleDni").textContent = mov.dni;
        document.getElementById("detalleTelefono").textContent = mov.telefono;
        document.getElementById("detallePuntoControl").textContent = mov.punto_control;

        // Mostrar insumos
        const insumosDiv = document.getElementById("detalleInsumos");
        insumosDiv.innerHTML = "";
        mov.insumos.forEach(insumo => {
            insumosDiv.innerHTML += `
                <div class="insumo">
                    <strong>${insumo.nombre_insumo}</strong> - Cantidad: ${insumo.cantidad}
                </div>
            `;
        });

        // Mostrar materiales
        const materialesDiv = document.getElementById("detalleMateriales");
        materialesDiv.innerHTML = "";
        mov.materiales.forEach(material => {
            materialesDiv.innerHTML += `
                <div class="material">
                    <strong>${material.material}</strong> (${material.unidad_material}) - Cantidad: ${material.cantidad}
                </div>
            `;
        });

        detalleDiv.style.display = "block";
        detalleDiv.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
        console.error("Error:", error);
    }
}



