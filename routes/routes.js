const express = require("express");
const router = express.Router();
const pool = require("../config/db")
const {
    validarUsuario
} = require("../utils/utils")
const bcrypt = require('bcrypt');


router.post("/login", async (req, res) => {
    const {
        nombre_usuario,
        password
    } = req.body
    try {
        if (!nombre_usuario || !password) {
            const error = new Error("Campos vacios");
            error.statusCode = 401;
            throw error;
        }
        const query = "SELECT * FROM usuario WHERE nombre_usuario = $1"
        let usuario = await pool.query(query, [nombre_usuario]);

        if (usuario.rows.length < 1) {
            const error = new Error("Usuario inexistente");
            error.statusCode = 404;
            throw error;
        }
        const isMatch = await bcrypt.compare(password, usuario.rows[0].password);
        if (isMatch) {
            res.json({
                success: true,
                status: 200,
                result_message: 'Inicio de sesion exitoso',
                result_rows: usuario.rowCount,
                result_proceso: 'GET USUARIO POR ID',
                result_data: usuario.rows[0],
            })
        } else {
            const error = new Error("Datos incorrectos!");
            error.statusCode = 401;
            throw error;
        }
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            status: error.statusCode || 500,
            result_message: error.message,
            result_rows: 0,
            result_proceso: 'LOGIN',
            result_data: []
        })
    }

});

// REST USERS 

router.get("/usuario/:id", async (req, res) => {
    const id = req.params.id;

    let query = 'select u.*, pdc.nombre AS punto_de_control from usuario u INNER JOIN punto_de_control pdc ON u.punto_de_control_id = pdc.id where u.id = $1 ';
    try {
        let usuario = await pool.query(query, [id]);

        if (usuario.rows.length < 1) {
            const error = new Error("No se ha encontrado un usuario con el id proporcionado");
            error.statusCode = 404;
            throw error;
        }

        res.json({
            success: true,
            status: 200,
            result_message: 'usuario recuperado por ID',
            result_rows: usuario.rowCount,
            result_proceso: 'GET USUARIO POR ID',
            result_data: usuario.rows,
        })
    } catch (error) {

        res.status(error.statusCode || 500).json({
            success: false,
            status: error.statusCode || 500,
            result_message: error.message,
            result_rows: 0,
            result_proceso: 'GET USUARIO POR ID',
            result_data: []
        })

    }
});

router.get("/usuario/", async (req, res) => {

    let SQL = 'SELECT u.id, u.nombre_completo, u.nombre_usuario, u.tipo_usuario, pdc.nombre AS punto_de_control FROM usuario u INNER JOIN punto_de_control pdc ON u.punto_de_control_id = pdc.id ';

    try {
        users = await pool.query(SQL);

        if (users.rows.length == 0) {
            const error = new Error("No se encontraron usuarios por mostrar");
            error.statusCode = 404;
            throw error;
        } else {

            res.json({
                success: true,
                status: 200,
                result_message: 'LISTA DE USUARIOS',
                result_rows: users.rowCount,
                result_proceso: 'GET USUARIO POR ID',
                result_data: users.rows
            })
        }

    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            status: error.statusCode || 500,
            result_message: error.message,
            result_rows: 0,
            result_proceso: 'GET ALL USERS',
            result_data: []
        })
    }
});

router.post("/usuario/", async (req, res) => {
    const {
        nombre_completo,
        dni,
        nombre_usuario,
        email,
        tipo_usuario,
        password,
        activo,
        punto_de_control_id
    } = req.body;
    const validacion = validarUsuario(req.body)

    try {
        if (validacion.success === false) {
            const error = new Error(validacion.error);
            error.statusCode = 400;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let query = 'INSERT INTO usuario (nombre_completo ,dni ,nombre_usuario ,email , tipo_usuario ,password , activo, punto_de_control_id) values ($1,$2,$3,$4,$5,$6,$7,$8) returning *';
        user = await pool.query(query, [nombre_completo, dni, nombre_usuario, email, tipo_usuario, hashedPassword, activo, punto_de_control_id]);

        res.json({
            success: true,
            status: 200,
            result_message: 'Usuario guardado de forma exitosa!',
            result_rows: user.rowCount,
            result_proceso: 'POST USUARIO',
            result_data: user.rows[0]
        })

    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            status: error.statusCode || 500,
            result_message: error.message,
            result_rows: 0,
            result_proceso: 'POST',
            result_data: ''
        })
    }
})

router.put('/usuario/:id', async (req, res) => {
    const {
        id
    } = req.params;
    const campos = req.body;

    let query = 'UPDATE usuario SET ';
    const valores = [];
    let contador = 1;

    for (const campo in campos) {
        if (campos[campo] !== undefined) {
            query += `${campo} = $${contador}, `;
            valores.push(campos[campo]);
            contador++;
        }
    }

    query = query.slice(0, -2); // Remueve la última coma
    query += ` WHERE id = $${contador} RETURNING *`;
    valores.push(id);

    try {
        const result = await pool.query(query, valores);

        if (result.rowCount === 0) {
            const error = new Error('No se encontró el usuario para actualizar');
            error.statusCode = 404;
            throw error;
        }

        res.json({
            success: true,
            result_message: 'Usuario actualizado de forma exitosa!',
            result_rows: result.rowCount,
            result_proceso: 'PUT ACTUALIZAR USUARIO',
            result_data: result.rows[0],
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            status: error.statusCode || 500,
            result_message: error.message,
            result_rows: 0,
            result_proceso: 'PUT ACTUALIZAR USUARIO',
            result_data: '',
        });
    }
});


router.delete('/usuario/:id', async (req, res) => {
    const {
        id
    } = req.params;

    try {
        // Ejecutamos la consulta DELETE en PostgreSQL
        const result = await pool.query('DELETE FROM usuario WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            const error = new Error('No se encontró el usuario para eliminar');
            error.statusCode = 404;
            throw error;
        }

        // Si se elimina exitosamente, enviamos la respuesta
        res.json({
            success: true,
            result_message: 'Usuario eliminado de forma exitosa!',
            result_rows: result.rowCount,
            result_proceso: 'DELETE ELIMINAR USUARIO',
            result_data: result.rows[0], // Retornamos el usuario eliminado como confirmación
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            status: error.statusCode || 500,
            result_message: error.message,
            result_rows: 0,
            result_proceso: 'DELETE ELIMINAR USUARIO',
            result_data: '',
        });
    }
});


// INTERDEPOSITO 

router.get('/interdeposito/:id', async (req, res) => {
    const id = req.params.id
    try {
        let result = await pool.query(` SELECT * from interdeposito where id = $1`, [id]);

        if (result.rowCount == 0) {
            const error = new Error('Interdeposito inexistente');
            error.statusCode = 404;
            throw error;
        }

        if (result.rows[0].estado == "rechazado" || result.rows[0].estado == "aceptado") {
            return res.json({
                success: true,
                result_message: 'Este interdeposito ya ha sido procesado!',
                result_rows: result.rowCount,
                result_proceso: 'GET ONE INTERDEPOSITO',
                result_data: result.rows[0],
            });
        }


        // Envía la respuesta final después de que todas las promesas se resuelvan
        res.json({
            success: true,
            result_message: 'Interdeposito obtenido!',
            result_rows: result.rowCount,
            result_proceso: 'GET ONE INTERDEPOSITO',
            result_data: result.rows[0],
        });

    } catch (error) {
        // Maneja el error aquí
        res.status(error.statusCode || 500).json({
            success: false,
            status: error.statusCode || 500,
            result_message: error.message,
            result_rows: 0,
            result_proceso: 'GET ONE INTERDEPOSITO',
            result_data: '',
        });
    }
});

router.get('/interdeposito/', async (req, res) => {
    try {
        const user_id = req.query.user_id;

        let result = await pool.query(`
            SELECT 
                i.id,
                i.usuario_id,
                i.fecha_creacion,
                i.telefono,
                i.estado, 
                p_origen.nombre AS origen, 
                p_destino.nombre AS destino,
                u.nombre_usuario
            FROM 
                interdeposito i
            INNER JOIN 
                usuario u ON u.id = i.usuario_id AND (u.punto_de_control_id = i.origen OR u.punto_de_control_id = i.destino) 
            INNER JOIN 
                punto_de_control p_origen ON i.origen = p_origen.id
            INNER JOIN 
                punto_de_control p_destino ON i.destino = p_destino.id
            WHERE u.id = $1
            ORDER BY 
                i.id DESC;
        `, [user_id]);

        if (result.rowCount === 0) {
            return res.json({
                success: true,
                result_message: 'Historial vacio!',
                result_rows: 0,
                result_proceso: 'GET HISTORIAL INTERDEPOSITO',
                result_data: [],
            });
        }

        const response = await Promise.all(
            result.rows.map(async (registro) => {
                if (registro.estado === "aceptado") {
                    let insumos = await pool.query(
                        `SELECT r.*, i.nombre_insumo FROM remito r INNER JOIN insumo i ON i.id = r.insumo_id WHERE interdeposito_id = $1`,
                        [registro.id]
                    );
                    registro.insumos = insumos.rows;
                } else {
                    registro.insumos = [];
                }
                return registro;
            })
        );

        // Filtrar cualquier posible `undefined` y enviar solo registros válidos
        res.json({
            success: true,
            result_message: 'Historial obtenido!',
            result_rows: response.length,
            result_proceso: 'GET HISTORIAL INTERDEPOSITO',
            result_data: response.filter(Boolean),
        });
        
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            status: error.statusCode || 500,
            result_message: error.message,
            result_rows: 0,
            result_proceso: 'GET HISTORIAL INTERDEPOSITO',
            result_data: '',
        });
    }
});

router.post("/interdeposito/", async (req, res) => {
    const {
        origen,
        destino,
        telefono,
        usuario_id,
        insumos
    } = req.body;

    try {

        if (!origen || !destino || !telefono || !usuario_id || !insumos || insumos.length === 0) {
            const error = new Error("Campos vacios!");
            error.statusCode = 400;
            throw error;
        }

        let query = `INSERT INTO interdeposito (usuario_id, insumos, origen, destino, telefono)
            VALUES ($1, $2, $3, $4, $5) returning *;`;
        interdeposito = await pool.query(query, [usuario_id, JSON.stringify(insumos), origen, destino, telefono]);

        res.json({
            success: true,
            status: 200,
            result_message: 'Interdeposito guardado de forma exitosa!',
            result_rows: interdeposito.rowCount,
            result_proceso: 'POST INTERDEPOSITO',
            result_data: interdeposito.rows[0]
        })

    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            status: error.statusCode || 500,
            result_message: error.message,
            result_rows: 0,
            result_proceso: 'POST INTERDEPOSITO',
            result_data: ''
        })
    }
})


router.get("/insumo/", async (req, res) => {

    let query = 'select * from insumo';

    let result = '';

    try {

        result = await pool.query(query);

        if (result.rows.length == 0) {
            const error = new Error("No se encontraron insumos por mostrar");
            error.statusCode = 404;
            throw error;
        } else {
            res.json({
                success: true,
                status: 200,
                result_message: 'LISTA DE INSUMOS OBTENIDA',
                result_rows: result.rowCount,
                result_proceso: 'GET ALL INSUMOS',
                result_data: result.rows
            })
        }

    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            status: error.statusCode || 500,
            result_message: error.message,
            result_rows: 0,
            result_proceso: 'GET ALL INSUMOS',
            result_data: []
        })
    }
})

router.put('/interdeposito/:id', async (req, res) => {
    const {
        id
    } = req.params;

    const {
        estado,
        insumos,
        user_id
    } = req.body;

    try {

        if (!estado || estado ==! "rechazado" || estado ==! "aceptado") {
            const error = new Error('El estado no es valido');
            error.statusCode = 400;
            throw error;
        }

        if(insumos.length == 0){
            const error = new Error('Los insumos son obligatorios!');
            error.statusCode = 400;
            throw error;
        }

        // await pool.query('BEGIN');

        const queryValidation = "SELECT * FROM usuario u INNER JOIN interdeposito i ON i.destino = u.punto_de_control_id WHERE u.id= $1 AND i.id= $2"
        const validation = await pool.query(queryValidation, [user_id, id]);

        if (validation.rowCount === 0) {
            const error = new Error('Su usuario no tiene permitido editar este interdeposito');
            error.statusCode = 404;
            throw error;
        }


        let query = 'UPDATE interdeposito SET estado = $1 WHERE id= $2';
        const result = await pool.query(query, [estado, id]);


        if (estado == "aceptado" && Array.from(insumos).length) {

            try {

                let query = 'UPDATE insumo SET cantidad = cantidad + $1 WHERE id= $2 AND punto_control_id = $3'
                response = await Promise.all(Array.from(insumos).map(async (insumo) => {
                    if(insumo.estado ==! "apto" || insumo.estado ==! "no_apto"){
                        const error = new Error(`El estado del insumo con id ${insumo.id} no es valido`);
                        error.statusCode = 400;
                        throw error;
                    }
                    if (insumo.estado == "apto") {
                        const updatedInsumo = await pool.query(query, [parseInt(insumo.cantidad), insumo.id, validation.rows[0].punto_de_control_id]);
                        if (updatedInsumo.rowCount === 0) {
                            const error = new Error(`El insumo con id ${insumo.id} no existe o el punto de control no corresponde con el de tu usuario`);
                            error.statusCode = 400;
                            throw error;
                        }
                    }

                }))
            } catch (error) {
                const err = new Error(error.message);
                throw err;
            }

            try {
                let query = 'INSERT INTO remito (interdeposito_id, insumo_id, cantidad, estado) VALUES ($1, $2, $3, $4);'
                response = await Promise.all(Array.from(insumos).map(async (insumo) => {
                    await pool.query(query, [id, insumo.id, insumo.cantidad, insumo.estado]);
                }))

            } catch (error) {
                const err = new Error(error.message);
                throw err;
            }

            // await pool.query('COMMIT')

            res.json({
                success: true,
                result_message: 'interdeposito y stock actualizados de forma exitosa!',
                result_rows: result.rowCount,
                result_proceso: 'PUT ACTUALIZAR INTERDEPOSITO',
                result_data: result.rows[0],
            });


        } else {
            // await pool.query('COMMIT')

            res.json({
                success: true,
                result_message: 'interdeposito actualizado de forma exitosa!',
                result_rows: result.rowCount,
                result_proceso: 'PUT ACTUALIZAR INTERDEPOSITO',
                result_data: result.rows,
            });
        }

    } catch (error) {

        // await pool.query('ROLLBACK')

        res.status(error.statusCode || 500).json({
            success: false,
            status: error.statusCode || 500,
            result_message: error.message,
            result_rows: 0,
            result_proceso: 'PUT ACTUALIZAR INTERDEPOSITO',
            result_data: '',
        });
    }
});


// /************************************************************************************/
// /* Segundo => END POINT => Servicio WEB => Servicio REST => Get por (NOMBRE INSUMO) */
// /************************************************************************************/

// router.get("/nombreinsumo/",async(req,res)=>
// {
//     const NOMBRE = req.query.nombre;

//     let SQL = 'select * from insumo where nombreinsumo like $1 limit 50';

//     let Resultado = '';

//     try {

//         Resultado = await pool.query(SQL,[`%${NOMBRE}%`]);

//         Salida = 
//         {
//             result_estado:'ok',
//             result_message:'Insumo recuperado por Nombre',
//             result_rows:Resultado.rowCount,
//             result_proceso:'GET INSUMO POR NOMBRE',
//             result_data:Resultado.rows
//         }        

//     } catch (error) 
//     {
//         Salida = 
//         {
//             result_estado:'error',
//             result_message:error.message,
//             result_rows:0,
//             result_proceso:'GET INSUMO POR NOMBRE ',
//             result_data:''
//         }        
//     }
//     res.json(Salida);
// })




// /*****************************************************************************************/
// /* Segundo => END POINT => Servicio WEB => Servicio REST => Get por (DESCRIPCION INSUMO) */
// /*****************************************************************************************/

// router.get("/descripcion/",async(req,res)=>
//     {
//         const descripcion = req.query.descripcion;

//         let SQL = 'select * from insumo where descripcion like $1 limit 50';

//         let Resultado = '';

//         try {

//             Resultado = await pool.query(SQL,[`%${descripcion}%`]);

//             Salida = 
//             {
//                 result_estado:'ok',
//                 result_message:'Insumo recuperado por Descripcion',
//                 result_rows:Resultado.rowCount,
//                 result_proceso:'GET INSUMO POR DESCRIPCION',
//                 result_data:Resultado.rows
//             }        

//         } catch (error) 
//         {
//             Salida = 
//             {
//                 result_estado:'error',
//                 result_message:error.message,
//                 result_rows:0,
//                 result_proceso:'GET INSUMO POR DESCRIPCION',
//                 result_data:''
//             }        
//         }
//         res.json(Salida);
//     })


// /**************************************************************************************/
// /* Segundo => END POINT => Servicio WEB => Servicio REST => Get por (CANTIDAD INSUMO) */
// /**************************************************************************************/

// router.get("/cantidad/",async(req,res)=>
//     {
//         const cantidad = req.query.cantidad;

//         let SQL = 'select * from insumo where cantidad like $1 limit 50';

//         let Resultado = '';

//         try {

//             Resultado = await pool.query(SQL,[`%${cantidad}%`]);

//             Salida = 
//             {
//                 result_estado:'ok',
//                 result_message:'Insumo recuperado por cantidad',
//                 result_rows:Resultado.rowCount,
//                 result_proceso:'GET INSUMO POR CANTIDAD',
//                 result_data:Resultado.rows
//             }        

//         } catch (error) 
//         {
//             Salida = 
//             {
//                 result_estado:'error',
//                 result_message:error.message,
//                 result_rows:0,
//                 result_proceso:'GET INSUMO POR CANTIDAD',
//                 result_data:''
//             }        
//         }
//         res.json(Salida);
//     })


//     //************************ END POINT DE MOVIMIENTO *************************/

// /************************************************************************************/
// /* Segundo => END POINT => Servicio WEB => Servicio REST => Get por (ID MOVIMIENTO) */
// /************************************************************************************/

// router.get("/idmovimiento/:ID",async(req,res)=>
//     {
//         const ID = req.params.ID;

//         let SQL = 'select * from movimiento where idmovimiento = $1';

//         let Resultado = '';

//         try {

//             Resultado = await pool.query(SQL,[ID]);

//             Salida = 
//             {
//                 result_estado:'ok',
//                 result_message:'movimiento recuperado por ID',
//                 result_rows:Resultado.rowCount,
//                 result_proceso:'GET MOVIMIENTO POR ID',
//                 result_data:Resultado.rows[0] 
//             }          

//         } catch (error) 
//         {
//             Salida = 
//             {
//                 result_estado:'error',
//                 result_message:error.message,
//                 result_rows:0,
//                 result_proceso:'GET MOVIMIENTO POR ID',
//                 result_data:''
//             }        
//         }
//         res.json(Salida);
//     })

// /**************************************************************************************/
// /* Segundo => END POINT => Servicio WEB => Servicio REST => Get por (TIPO MOVIMIENTO) */
// /***************************************************************************************/


// router.get("/tipomovimiento/",async(req,res)=>
//     {
//         const tipomovimiento = req.query.tipomovimiento;

//         let SQL = 'select * from movimiento where tipomovimiento like $1 limit 50';

//         let Resultado = '';

//         try {

//             Resultado = await pool.query(SQL,[`%${tipomovimiento}%`]);

//             Salida = 
//             {
//                 result_estado:'ok',
//                 result_message:'Movimiento recuperado por tipo',
//                 result_rows:Resultado.rowCount,
//                 result_proceso:'GET MOVIMIENTO POR TIPO',
//                 result_data:Resultado.rows
//             }        

//         } catch (error) 
//         {
//             Salida = 
//             {
//                 result_estado:'error',
//                 result_message:error.message,
//                 result_rows:0,
//                 result_proceso:'GET MOVIMIENTO POR TIPO',
//                 result_data:''
//             }        
//         }
//         res.json(Salida);
//     })

// /********************************************************************************************/
// /* Segundo => END POINT => Servicio WEB => Servicio REST => Get por (FECHA/HORA MOVIMIENTO) */
// /********************************************************************************************/

// router.get("/fechahora/",async(req,res)=>
//     {
//         const fechahora = req.query.fechahora;

//         let SQL = 'select * from movimiento where fechahora like $1 limit 50';

//         let Resultado = '';

//         try {

//             Resultado = await pool.query(SQL,[`%${fechahora}%`]);

//             Salida = 
//             {
//                 result_estado:'ok',
//                 result_message:'Movimiento recuperado por fecha y hora',
//                 result_rows:Resultado.rowCount,
//                 result_proceso:'GET MOVIMIENTO POR FECHA Y HORA',
//                 result_data:Resultado.rows
//             }        

//         } catch (error) 
//         {
//             Salida = 
//             {
//                 result_estado:'error',
//                 result_message:error.message,
//                 result_rows:0,
//                 result_proceso:'GET MOVIMIENTO POR FECHA Y HORA',
//                 result_data:''
//             }        
//         }
//         res.json(Salida);
//     })


// /*********************************************************************************************/
// /* Segundo => END POINT => Servicio WEB => Servicio REST => Get por (OBSERVACION MOVIMIENTO) */
// /*********************************************************************************************/

// router.get("/observacion /",async(req,res)=>
//     {
//         const observacion = req.query.observacion;

//         let SQL = 'select * from movimiento where observacion like $1 limit 50';

//         let Resultado = '';

//         try {

//             Resultado = await pool.query(SQL,[`%${observacion}%`]);

//             Salida = 
//             {
//                 result_estado:'ok',
//                 result_message:'Movimiento recuperado por observacion',
//                 result_rows:Resultado.rowCount,
//                 result_proceso:'GET MOVIMIENTO POR OBSERVACION',
//                 result_data:Resultado.rows
//             }        

//         } catch (error) 
//         {
//             Salida = 
//             {
//                 result_estado:'error',
//                 result_message:error.message,
//                 result_rows:0,
//                 result_proceso:'GET MOVIMIENTO POR OBSERVACION',
//                 result_data:''
//             }        
//         }
//         res.json(Salida);
//     })


// /******************************************************************************************/
// /* Segundo => END POINT => Servicio WEB => Servicio REST => Get por (EMPLEADO MOVIMIENTO) */
// /******************************************************************************************/

// router.get("/empleado/",async(req,res)=>
//     {
//         const empleado = req.query.empleado;

//         let SQL = 'select * from movimiento where empleado like $1 limit 50';

//         let Resultado = '';

//         try {

//             Resultado = await pool.query(SQL,[`%${empleado}%`]);

//             Salida = 
//             {
//                 result_estado:'ok',
//                 result_message:'Movimiento recuperado por empleado',
//                 result_rows:Resultado.rowCount,
//                 result_proceso:'GET MOVIMIENTO POR EMPLEADO',
//                 result_data:Resultado.rows
//             }        

//         } catch (error) 
//         {
//             Salida = 
//             {
//                 result_estado:'error',
//                 result_message:error.message,
//                 result_rows:0,
//                 result_proceso:'GET MOVIMIENTO POR EMPLEADO',
//                 result_data:''
//             }        
//         }
//         res.json(Salida);
//     })


// /****************************************************************************************/
// /* Segundo => END POINT => Servicio WEB => Servicio REST => Get por (ESTADO MOVIMIENTO) */
// /****************************************************************************************/

// router.get("/estado/",async(req,res)=>
//     {
//         const estado = req.query.estado;

//         let SQL = 'select * from movimiento where estado like $1 limit 50';

//         let Resultado = '';

//         try {

//             Resultado = await pool.query(SQL,[`%${estado}%`]);

//             Salida = 
//             {
//                 result_estado:'ok',
//                 result_message:'Movimiento recuperado por estado',
//                 result_rows:Resultado.rowCount,
//                 result_proceso:'GET MOVIMIENTO POR ESTADO',
//                 result_data:Resultado.rows
//             }        

//         } catch (error) 
//         {
//             Salida = 
//             {
//                 result_estado:'error',
//                 result_message:error.message,
//                 result_rows:0,
//                 result_proceso:'GET MOVIMIENTO POR ESTADO',
//                 result_data:''
//             }        
//         }
//         res.json(Salida);
//     })


// /********************************************************************************************/
// /* Segundo => END POINT => Servicio WEB => Servicio REST => Get por (AUTORIZADO MOVIMIENTO) */
// /********************************************************************************************/

// router.get("/autorizacion/",async(req,res)=>
//     {
//         const autorizacion = req.query.autorizacion;

//         let SQL = 'select * from movimiento where autorizacion like $1 limit 50';

//         let Resultado = '';

//         try {

//             Resultado = await pool.query(SQL,[`%${autorizacion}%`]);

//             Salida = 
//             {
//                 result_estado:'ok',
//                 result_message:'Movimiento recuperado por autorizacion',
//                 result_rows:Resultado.rowCount,
//                 result_proceso:'GET MOVIMIENTO POR AUTORIZACION',
//                 result_data:Resultado.rows
//             }        

//         } catch (error) 
//         {
//             Salida = 
//             {
//                 result_estado:'error',
//                 result_message:error.message,
//                 result_rows:0,
//                 result_proceso:'GET MOVIMIENTO POR AUTORIZACION',
//                 result_data:''
//             }        
//         }
//         res.json(Salida);
//     })

// /*****************************************************************************************************/
// /* Segundo => END POINT => Servicio WEB => Servicio REST => Get por (NOMBRE DESTINATARIO MOVIMIENTO) */
// /*****************************************************************************************************/

// router.get("/nombredestinatario/",async(req,res)=>
//     {
//         const nombredestinatario = req.query.nombredestinatario;

//         let SQL = 'select * from movimiento where nombredestinatario like $1 limit 50';

//         let Resultado = '';

//         try {

//             Resultado = await pool.query(SQL,[`%${nombredestinatario}%`]);

//             Salida = 
//             {
//                 result_estado:'ok',
//                 result_message:'Movimiento recuperado por nombre destinatario',
//                 result_rows:Resultado.rowCount,
//                 result_proceso:'GET MOVIMIENTO POR NOMBRE DESTINATARIO',
//                 result_data:Resultado.rows
//             }        

//         } catch (error) 
//         {
//             Salida = 
//             {
//                 result_estado:'error',
//                 result_message:error.message,
//                 result_rows:0,
//                 result_proceso:'GET MOVIMIENTO POR NOMBRE DESTINATARIO',
//                 result_data:''
//             }        
//         }
//         res.json(Salida);
//     })

// /*******************************************************************************************************/
// /* Segundo => END POINT => Servicio WEB => Servicio REST => Get por (TELEFONO DESTINATARIO MOVIMIENTO) */
// /*******************************************************************************************************/

// router.get("/telefonodestinatario/",async(req,res)=>
//     {
//         const telefonodestinatario = req.query.telefonodestinatario;

//         let SQL = 'select * from movimiento where telefonodestinatario like $1 limit 50';

//         let Resultado = '';

//         try {

//             Resultado = await pool.query(SQL,[`%${telefonodestinatario}%`]);

//             Salida = 
//             {
//                 result_estado:'ok',
//                 result_message:'Movimiento recuperado por telefono destinatario',
//                 result_rows:Resultado.rowCount,
//                 result_proceso:'GET MOVIMIENTO POR TELEFONO DESTINATARIO',
//                 result_data:Resultado.rows
//             }        

//         } catch (error) 
//         {
//             Salida = 
//             {
//                 result_estado:'error',
//                 result_message:error.message,
//                 result_rows:0,
//                 result_proceso:'GET MOVIMIENTO POR TELEFONO DESTINATARIO ',
//                 result_data:''
//             }        
//         }
//         res.json(Salida);
//     })



module.exports = router