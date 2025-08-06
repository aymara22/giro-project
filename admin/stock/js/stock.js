async function obtenerInsumos(punto) {
    try {
        const response = await fetch(`http://localhost:3000/api-giro/insumo/?punto_control=${punto}`);
        const data = await response.json();

        if (data.success && data.result_data) {
            const div = document.getElementById("tablas");
            
            // Limpiar contenido anterior
            div.innerHTML = '';
            
            // Crear tabla para cada categoría
            let insumos = data.result_data 
            Object.keys(insumos).forEach(clave => {
                if (data.result_data[Object.keys(data.result_data)[0]].length) {
                    crearTablaCategoria(div, insumos[clave], clave);
                }
            });
            
        } else {
            const div = document.getElementById("tablas");
            div.innerHTML = '<p>No se encontraron insumos para el punto de control Chacarita.</p>';
        }
        
    } catch(error) {
        console.error('Error al obtener los datos:', error);
        const div = document.getElementById("tablas");
        div.innerHTML = '<p>Error al cargar los datos. Por favor, intente nuevamente.</p>';
    }
}

// function crearTablaCategoria(container, insumos, titulo) {
//     // Crear tabla principal
//     const tabla = document.createElement("table");
//     tabla.className = "tabla-insumos";
    
//     // Crear encabezado de la tabla
//     const thead = document.createElement("thead");
    
//     // Título de la tabla
//     const tituloRow = document.createElement("tr");
//     const tituloCell = document.createElement("th");
//     tituloCell.colSpan = 5; // Abarca todas las columnas
//     tituloCell.textContent = titulo;
//     tituloCell.className = "titulo-tabla";
//     tituloRow.appendChild(tituloCell);
//     thead.appendChild(tituloRow);
    
//     // Fila de encabezados
//     const headerRow = document.createElement("tr");
//     const headers = ["Producto", "Descripción", "Cantidad", "Acciones", "+"];
    
//     headers.forEach(headerText => {
//         const th = document.createElement("th");
//         th.textContent = headerText;
//         th.className = "header-cell";
//         headerRow.appendChild(th);
//     });
    
//     thead.appendChild(headerRow);
//     tabla.appendChild(thead);
    
//     // Crear cuerpo de la tabla
//     const tbody = document.createElement("tbody");
    
//     insumos.forEach(insumo => {
//         const fila = document.createElement("tr");
//         fila.className = "fila-insumo";
        
//         // Columna Producto
//         const celdaProducto = document.createElement("td");
//         celdaProducto.textContent = insumo.nombre_insumo;
//         celdaProducto.className = "celda-producto";
//         fila.appendChild(celdaProducto);
        
//         // Columna Descripción
//         const celdaDescripcion = document.createElement("td");
//         celdaDescripcion.textContent = insumo.descripcion;
//         celdaDescripcion.className = "celda-descripcion";
//         fila.appendChild(celdaDescripcion);
        
//         // Columna Cantidad
//         const celdaCantidad = document.createElement("td");
//         celdaCantidad.textContent = insumo.cantidad;
//         celdaCantidad.className = "celda-cantidad";
//         fila.appendChild(celdaCantidad);
        
//         // Columna Acciones
//         const celdaAcciones = document.createElement("td");
//         celdaAcciones.className = "celda-acciones";
        
//         // Crear iconos de acción
//         const iconoEliminar = document.createElement("i");
//         iconoEliminar.className = "fas fa-trash";
//         iconoEliminar.style.cursor = "pointer";
//         iconoEliminar.style.marginRight = "10px";
//         iconoEliminar.title = "Eliminar";
//         iconoEliminar.dataset.id = insumo.id; // Guardar el ID para futuras acciones
        
//         const iconoEditar = document.createElement("i");
//         iconoEditar.className = "fas fa-edit";
//         iconoEditar.style.cursor = "pointer";
//         iconoEditar.title = "Editar";
//         iconoEditar.dataset.id = insumo.id; // Guardar el ID para futuras acciones
        
//         celdaAcciones.appendChild(iconoEliminar);
//         celdaAcciones.appendChild(iconoEditar);
//         fila.appendChild(celdaAcciones);
        
//         tbody.appendChild(fila);
//     });
    
//     tabla.appendChild(tbody);
//     container.appendChild(tabla);
    
//     // Agregar espacio entre tablas
//     const br = document.createElement("br");
//     container.appendChild(br);
// }

function crearTablaCategoria(container, insumos, titulo) {
    const tabla = document.createElement("table");
    tabla.className = "tabla-insumos";

    const thead = document.createElement("thead");

    // Fila del título
    const tituloRow = document.createElement("tr");
    const tituloCell = document.createElement("th");
    tituloCell.colSpan = 5;
    tituloCell.textContent = titulo;
    tituloCell.className = "titulo-tabla";
    tituloRow.appendChild(tituloCell);
    thead.appendChild(tituloRow);

    // Fila del botón "Crear"
    const crearRow = document.createElement("tr");
    const crearCell = document.createElement("th");
    crearCell.colSpan = 5;
    crearCell.className = "crear-cell";

    const botonCrear = document.createElement("button");
    botonCrear.textContent = "Agregar +";
    botonCrear.className = "btn-crear";
    botonCrear.title = "Crear nuevo registro";
    botonCrear.dataset.categoria = titulo;

    botonCrear.addEventListener("click", () => {
        if (document.getElementById("popup")) return;

        const modalHTML = `
          <div id="popup" class="modal-overlay active">
            <div class="modal">
              <h2>Nuevo Insumo</h2>
              <form id="formInsumo">
                <label for="producto">Producto</label>
                <input type="text" id="producto" name="producto" required>
    
                <label for="descripcion">Descripción</label>
                <input type="text" id="descripcion" name="descripcion" required>
    
                <label for="cantidad">Cantidad</label>
                <input type="number" id="cantidad" name="cantidad" required min="1">
    
                <div class="btns">
                  <button type="submit" class="btn-guardar">Guardar</button>
                  <button type="button" class="btn-cancelar" onclick="cerrarPopup()">Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        `;
    
        // Crear un div contenedor temporal para insertar HTML
        const temp = document.createElement("div");
        temp.innerHTML = modalHTML;
    
        // Agregar solo el nodo real (div.modal-overlay)
        document.body.appendChild(temp.firstElementChild);

        document.getElementById("formInsumo").addEventListener("submit", function (e) {
            e.preventDefault();
      
            const producto = document.getElementById("producto").value;
            const descripcion = document.getElementById("descripcion").value;
            const cantidad = document.getElementById("cantidad").value;
      
            console.log("Nuevo insumo:", { producto, descripcion, cantidad });
      
            // Aquí puedes hacer cosas como enviar a la base de datos, etc.
      
            cerrarPopup();
          });

    });

    crearCell.appendChild(botonCrear);
    crearRow.appendChild(crearCell);
    thead.appendChild(crearRow);

    // Fila de encabezados
    const headerRow = document.createElement("tr");
    const headers = ["Producto", "Descripción", "Cantidad", "Acciones"];

    headers.forEach(headerText => {
        const th = document.createElement("th");
        th.textContent = headerText;
        th.className = "header-cell";
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    tabla.appendChild(thead);

    const tbody = document.createElement("tbody");

    insumos.forEach(insumo => {
        const fila = document.createElement("tr");
        fila.className = "fila-insumo";

        const celdaProducto = document.createElement("td");
        celdaProducto.textContent = insumo.nombre_insumo;
        fila.appendChild(celdaProducto);

        const celdaDescripcion = document.createElement("td");
        celdaDescripcion.textContent = insumo.descripcion;
        fila.appendChild(celdaDescripcion);

        const celdaCantidad = document.createElement("td");
        celdaCantidad.textContent = insumo.cantidad;
        fila.appendChild(celdaCantidad);

        const celdaAcciones = document.createElement("td");

        const iconoEliminar = document.createElement("i");
        iconoEliminar.className = "fas fa-trash";
        iconoEliminar.style.cursor = "pointer";
        iconoEliminar.style.marginRight = "10px";
        iconoEliminar.title = "Eliminar";
        iconoEliminar.dataset.id = insumo.id;

        const iconoEditar = document.createElement("i");
        iconoEditar.className = "fas fa-edit";
        iconoEditar.style.cursor = "pointer";
        iconoEditar.title = "Editar";
        iconoEditar.dataset.id = insumo.id;

        celdaAcciones.appendChild(iconoEliminar);
        celdaAcciones.appendChild(iconoEditar);
        fila.appendChild(celdaAcciones);

        const celdaVacia = document.createElement("td");
        fila.appendChild(celdaVacia);

        tbody.appendChild(fila);
    });

    tabla.appendChild(tbody);
    container.appendChild(tabla);

    const br = document.createElement("br");
    container.appendChild(br);
}


function cerrarPopup() {
    const modal = document.getElementById("popup");
    if (modal) modal.remove();
}