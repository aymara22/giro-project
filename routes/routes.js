const express = require("express");
const router = express.Router();
const pool = require("../config/db")
const {
    validarUsuario
} = require("../utils/utils")
const bcrypt = require('bcrypt');
const {
    response
} = require("express");


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

router.get("/usuario/:id", async (req, res, next) => {
    const id = req.params.id;

    let query = 'select * from usuario where id = $1';
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

    let SQL = 'select id, nombre_completo, nombre_usuario, tipo_usuario, activo from usuario';

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
        activo
    } = req.body;
    const validacion = validarUsuario(req.body)

    try {
        if (validacion.success === false) {
            const error = new Error(validacion.error);
            error.statusCode = 400;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let query = 'INSERT INTO usuario (nombre_completo ,dni ,nombre_usuario ,email , tipo_usuario ,password , activo) values ($1,$2,$3,$4,$5,$6,$7) returning *';
        user = await pool.query(query, [nombre_completo, dni, nombre_usuario, email, tipo_usuario, hashedPassword, activo]);

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

        // Si no se encontró el usuario para eliminar, enviamos un error
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

router.get('/interdeposito', async (req, res) => {
    try {
        let result = await pool.query(`
            SELECT i.id, i.telefono, i.insumos, i.origen, i.destino, i.fecha_creacion, u.nombre_usuario
            FROM interdeposito i 
            INNER JOIN usuario u ON u.id = i.usuario_id
            ORDER BY id DESC
        `);
        
        if (result.rowCount == 0) {
            const error = new Error(`No se encontraron registros`);
            error.statusCode = 404;
            throw error;
        }

        // Cambia forEach por map
        const response = await Promise.all(result.rows.map(async registro => {
            try {
                // Parsear los insumos y mapear cada insumo_id
                const insumos = await Promise.all(JSON.parse(registro.insumos).map(async (insumo_id) => {
                    const insumoResult = await pool.query(`
                        SELECT nombre_insumo FROM insumo WHERE id = $1
                    `, [parseInt(insumo_id)]);

                    if (insumoResult.rowCount == 0) {
                        const error = new Error(`No se encontró un insumo con el id ${insumo_id}`);
                        error.statusCode = 404;
                        throw error;
                    }
                    
                    return insumoResult.rows[0].nombre_insumo;
                }));

                registro.insumos = insumos;
                return registro;
            } catch (error) {
                throw error; 
            }
        }));

        // Envía la respuesta final después de que todas las promesas se resuelvan
        res.json({
            success: true,
            result_message: 'Historial obtenido!',
            result_rows: result.rowCount,
            result_proceso: 'GET HISTORIAL INTERDEPOSITO',
            result_data: response,
        });

    } catch (error) {
        // Maneja el error aquí
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






// router.get("/insumo/:ID",async(req,res)=>
//     {
//         const ID = req.params.ID;

//         let SQL = 'select * from insumo where idinsumo = $1';

//         let Resultado = '';

//         try {

//             Resultado = await pool.query(SQL,[ID]);

//             Salida = 
//             {
//                 result_estado:'ok',
//                 result_message:'insumo recuperado por ID',
//                 result_rows:Resultado.rowCount,
//                 result_proceso:'GET INSUMO POR ID',
//                 result_data:Resultado.rows[0] 
//             }          

//         } catch (error) 
//         {
//             Salida = 
//             {
//                 result_estado:'error',
//                 result_message:error.message,
//                 result_rows:0,
//                 result_proceso:'GET INSUMO POR ID',
//                 result_data:''
//             }        
//         }
//         res.json(Salida);
//     })


// /***************************************************************************************/
// /* Segundo => END POINT => Servicio WEB => Servicio REST => Get por (CATEGORIA INSUMO) */
// /***************************************************************************************/

// router.get("/categoria/",async(req,res)=>
//     {
//         const CATEGORIA = req.query.categoria;

//         let SQL = 'select * from insumo where categoria like $1 limit 50';

//         let Resultado = '';

//         try {

//             Resultado = await pool.query(SQL,[`%${CATEGORIA}%`]);

//             Salida = 
//             {
//                 result_estado:'ok',
//                 result_message:'Insumo recuperado por categoria',
//                 result_rows:Resultado.rowCount,
//                 result_proceso:'GET INSUMO POR CATEGORIA',
//                 result_data:Resultado.rows
//             }        

//         } catch (error) 
//         {
//             Salida = 
//             {
//                 result_estado:'error',
//                 result_message:error.message,
//                 result_rows:0,
//                 result_proceso:'GET INSUMO POR CATEGORIA',
//                 result_data:''
//             }        
//         }
//         res.json(Salida);
//     })

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