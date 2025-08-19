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
                crearTablaCategoria(div, insumos[clave], clave);
            });

        } else {
            const div = document.getElementById("tablas");
            div.innerHTML = '<p>No se encontraron insumos para el punto de control Chacarita.</p>';
        }

    } catch (error) {
        console.error('Error al obtener los datos:', error);
        const div = document.getElementById("tablas");
        div.innerHTML = '<p>Error al cargar los datos. Por favor, intente nuevamente.</p>';
    }
}


function crearTablaCategoria(container, insumos, categoria) {
    const tabla = document.createElement("table");
    tabla.className = "tabla-insumos";

    const thead = document.createElement("thead");

    // Fila del título
    const tituloRow = document.createElement("tr");
    const tituloCell = document.createElement("th");
    tituloCell.colSpan = 5;
    tituloCell.textContent = categoria;
    tituloCell.className = "titulo-tabla";
    tituloRow.appendChild(tituloCell);
    thead.appendChild(tituloRow);

    // Fila del botón "Crear"
    const crearRow = document.createElement("tr");
    const crearCell = document.createElement("th");
    crearCell.colSpan = 5;
    crearCell.className = "crear-cell";

    if (localStorage.getItem("userProfile") == "ADMIN") {
        const botonCrear = document.createElement("button");
        botonCrear.textContent = "Agregar +";
        botonCrear.className = "btn-crear";
        botonCrear.title = "Crear nuevo registro";
        // botonCrear.dataset.categoria = titulo;

        botonCrear.addEventListener("click", () => {
            obtenerCategoriaId(categoria)
            saveOrUpdatePopUp(botonCrear)
        });

        crearCell.appendChild(botonCrear);
        crearRow.appendChild(crearCell);
        thead.appendChild(crearRow);
    }

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

        if (localStorage.getItem("userProfile") == "ADMIN") {

            const iconoEliminar = document.createElement("i");
            iconoEliminar.className = "fas fa-trash";
            iconoEliminar.style.cursor = "pointer";
            iconoEliminar.style.marginRight = "10px";
            iconoEliminar.title = "Eliminar";
            iconoEliminar.dataset.id = insumo.id;

            iconoEliminar.addEventListener("click", (e) => {
                e.preventDefault()
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: "Esta acción no se puede deshacer",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        user_id = localStorage.getItem("userSession")
                        eliminarProducto(insumo.id, insumo.punto_control_id, user_id)
                    }
                });
            })

            const iconoEditar = document.createElement("i");
            iconoEditar.className = "fas fa-edit";
            iconoEditar.style.cursor = "pointer";
            iconoEditar.title = "Editar";
            iconoEditar.dataset.id = insumo.id;

            iconoEditar.addEventListener("click", () => {
                saveOrUpdatePopUp(iconoEditar, insumo)
            })

            celdaAcciones.appendChild(iconoEliminar);
            celdaAcciones.appendChild(iconoEditar);
            fila.appendChild(celdaAcciones);

        }
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

async function eliminarProducto(id, punto_control_id, user_id) {
    try {
        const response = await fetch(`http://localhost:3000/api-giro/insumo/${id}/${punto_control_id}/${user_id}`, {
            method: "DELETE"
        });
        const result = await response.json();
        if (result.success == true) {
            Swal.fire({
                icon: 'success',
                title: result.result_message,
                text: 'El insumo ha sido eliminado con éxito!',
            }).then(() => {
                location.reload();
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: result.result_message,
                text: 'No fue posible eliminar el insumo',
            });
        }
    } catch (error) {
        console.error('Error al intentar eliminar insumo:', error);
    }
}

function saveOrUpdatePopUp(btn, insumo = null) {
    if (document.getElementById("popup")) return;

    let modalHTML = ``

    if (btn.className == 'btn-crear') {
        modalHTML = `
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
    }
    if (btn.className == 'fas fa-edit' && insumo) {
        modalHTML = `
        <div id="popup" class="modal-overlay active">
          <div class="modal">
            <h2>Actualizar Insumo</h2>
            <form id="formInsumo">
              <label for="producto">Producto</label>
              <input type="text" id="producto" name="producto" value="${insumo.nombre_insumo}" required>
  
              <label for="descripcion">Descripción</label>
              <input type="text" id="descripcion" name="descripcion" value="${insumo.descripcion}" required>
  
              <label for="cantidad">Cantidad</label>
              <input type="number" id="cantidad" name="cantidad"  value="${insumo.cantidad}" required min="1">
  
              <div class="btns">
                <button type="submit" class="btn-guardar">Editar</button>
                <button type="button" class="btn-cancelar" onclick="cerrarPopup()">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      `;
    }

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
        const user_id = localStorage.getItem("userSession")


        let dataInsumo = {
            nombre_insumo: producto,
            descripcion: descripcion,
            cantidad: cantidad,
            user_id
        }

        if (insumo && "id" in insumo) {
            dataInsumo.id = insumo.id
        } else {
            dataInsumo.punto_control_id = localStorage.getItem("puntoDeControlId")
            dataInsumo.categoria_id = localStorage.getItem("categoriaId")
            localStorage.removeItem("puntoDeControlId")
            localStorage.removeItem("categoriaId")
        }

        crearActualizarProducto(dataInsumo)
        // Aquí puedes hacer cosas como enviar a la base de datos, etc.

        cerrarPopup();
    });
}


async function crearActualizarProducto(insumo) {
    try {
        let id = "id" in insumo ? insumo.id : null
        let url = "http://localhost:3000/api-giro/insumo/"
        if (id) {
            url += insumo.id
            delete insumo.id;
        }
        const response = await fetch(url, {
            method: id ? "PUT" : "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(insumo)
        });
        const result = await response.json();
        if (result.success == true) {
            Swal.fire({
                icon: 'success',
                title: result.result_message,
                text: `El insumo ha sido ${id ? "actualizado" : "creado"} con éxito!`,
            }).then(() => {
                location.reload();
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: result.result_message,
                text: `No fue posible ${id ? "actualizar" : "crear"} el insumo`,
            });
        }
    } catch (error) {
        console.error(`Error al intentar ${id ? "actualizar" : "crear"} el insumo: ${error}`);
    }
}

async function obtenerCategoriaId(categoria) {
    try {
        const response = await fetch(`http://localhost:3000/api-giro/categoria/${categoria}`);
        const result = await response.json();
        if (result.success == true) {
            localStorage.setItem("categoriaId", result.result_data[0].id)
        } else {
            console.error(result.result_message)
        }
    } catch (error) {
        console.error('Error al intentar obtener la categoria:', error);
    }
}


async function crearCategoria() {
    try {
        if (document.getElementById("popup")) return;


        let modalHTML = `
        <div id="popup" class="modal-overlay active">
          <div class="modal">
            <h2>Nueva categoria</h2>
            <form id="formCategoria">
              <label for="nombre">Nombre categoria</label>
              <input type="text" id="nombre" name="nombre" required>
  
              <label for="descripcion">Descripción</label>
              <input type="text" id="descripcion" name="descripcion" required>
  
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

        document.getElementById("formCategoria").addEventListener("submit", async function (e) {
            e.preventDefault();


            const nombre = document.getElementById("nombre").value;
            const descripcion = document.getElementById("descripcion").value;
            const user_id = localStorage.getItem("userSession")


            let dataInsumo = {
                nombre: nombre,
                descripcion: descripcion,
                user_id
            }

            let url = "http://localhost:3000/api-giro/categoria"
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataInsumo)
            });

            const result = await response.json();
            if (result.success == true) {
                Swal.fire({
                    icon: 'success',
                    title: result.result_message,
                    text: `La categoria ha sido creado con éxito!`,
                }).then(() => {
                    location.reload();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: result.result_message,
                    text: `No fue posible crear la categoria`,
                });
            }
            cerrarPopup();
        });
    } catch (error) {
        console.error(`Error al intentar crear la categoria: ${error}`);
    }

}

function crearBotonCrearCategoria(){
    if(localStorage.getItem("userProfile") == 'ADMIN'){
        const contenedorBtnCrear = document.querySelector(".enlace-container")
        const a = document.createElement("a")
        a.className = 'registro-enlace'
        a.textContent = 'Crear Nueva Tabla de Insumos'
        contenedorBtnCrear.appendChild(a)
    }
    // let html= `<a href="#" class="registro-enlace">Crear Nueva Tabla de Insumos</a>`
}