const PORT = 3000;
const ClaseExpress = require("express");
const ServidorWeb = ClaseExpress();
const cors = require("cors");

// Middleware
ServidorWeb.use(cors()); // Habilitar CORS
ServidorWeb.use(ClaseExpress.static("FrontEnd")); 
ServidorWeb.use(ClaseExpress.json());
ServidorWeb.use(ClaseExpress.text());
ServidorWeb.use(ClaseExpress.urlencoded({ extended: false }));

// PostgreSQL pool
const { Pool } = require("pg");

const ConexionDB = new Pool({
    host: 'localhost',
    port: '5432',
    database: 'dbgiro',
    user: 'postgres',
    password: '12345678'
});

// Conexión a la base de datos con manejo de errores
ConexionDB.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.stack);
    } else {
        console.log('Conexión a la base de datos establecida.');
    }
});

// Rutas de ejemplo
ServidorWeb.get("/", (req, res) => {
    res.send("Servidor funcionando correctamente");
});


module.exports = { ConexionDB };



//************************ END POINT DE REGISTRAR USUARIOS *************************/

/*********************************************************************************/
/* PRIMERO => END POINT => Servicio WEB => Servicio REST => Get por (ID USUARIO) */
/*********************************************************************************/

// http://localhost:3000/usuario/2

ServidorWeb.get("/usuario/:ID", async (req, res) => {
    const ID = req.params.ID;

    let SQL = 'select * from usuario where usuarioid = $1';

    let Resultado = '';

    try {
        Resultado = await ConexionDB.query(SQL, [ID]);

        Salida = {
            result_estado: 'ok',
            result_message: 'usuario recuperado por ID',
            result_rows: Resultado.rowCount,
            result_proceso: 'GET USUARIO POR ID',
            result_data: Resultado.rows[0]
        };

    } catch (error) {
        Salida = {
            result_estado: 'error',
            result_message: error.message,
            result_rows: 0,
            result_proceso: 'GET USUARIO POR ID',
            result_data: ''
        };
    }
    res.json(Salida);
});


/**********************************************************************************************/
/* Segundo => END POINT => Servicio WEB => Servicio REST => Get por (NOMBRE COMPLETO USUARIO) */
/**********************************************************************************************/
/*ServidorWeb.get("/nombrecompletousuario/:nombrecompletousuario",async(req,res)=>
    {
        const nombrecompletousuario = req.params.nombrecompletousuario;
    
        let SQL = 'select * from usuario where nombrecompletousuario = $1';
    
        let Resultado = '';
    
        try {
            
            Resultado = await ConexionDB.query(SQL,[nombrecompletousuario]);
    
            Salida = 
            {
                result_estado:'ok',
                result_message:'usuario recuperado por nombrecompletousuario',
                result_rows:Resultado.rowCount,
                result_proceso:'GET COMPRA POR NOMBRE COMPLETO USUARIO',
                result_data:Resultado.rows[0]
            }          
    
        } catch (error) 
        {
            Salida = 
            {
                result_estado:'error',
                result_message:error.message,
                result_rows:0,
                result_proceso:'GET USUARIO POR  NOMBRE COMPLETO USUARIO',
                result_data:''
            }        
        }
        res.json(Salida);
    })


/**********************************************************************************/
/* Segundo => END POINT => Servicio WEB => Servicio REST => Get por (DNI USUARIO) */
/**********************************************************************************/
/*ServidorWeb.get("/dniusuario/:dniusuario",async(req,res)=>
    {
        const usuariocuit = req.params.dniusuario;
    
        let SQL = 'select * from usuario where dniusuario = $1';
    
        let Resultado = '';
    
        try {
            
            Resultado = await ConexionDB.query(SQL,[dniusuario]);
    
            Salida = 
            {
                result_estado:'ok',
                result_message:'usuario recuperado por dniusuario',
                result_rows:Resultado.rowCount,
                result_proceso:'GET COMPRA POR  USUARIO DNI',
                result_data:Resultado.rows[0]
            }          
    
        } catch (error) 
        {
            Salida = 
            {
                result_estado:'error',
                result_message:error.message,
                result_rows:0,
                result_proceso:'GET USUARIO POR  USUARIO DNI',
                result_data:''
            }        
        }
        res.json(Salida);
    })    


/*************************************************************************************/
/* Segundo => END POINT => Servicio WEB => Servicio REST => Get por (NOMBRE USUARIO) */
/*************************************************************************************/
/*ServidorWeb.get("/nombreusuario/",async(req,res)=>
    {
        const NOMBRE = req.query.nombre;
    
        let SQL = 'select * from usuario where nombreusuario like $1 limit 50';
    
        let Resultado = '';
    
        try {
            
            Resultado = await ConexionDB.query(SQL,[`%${NOMBRE}%`]);
    
            Salida = 
            {
                result_estado:'ok',
                result_message:'Usuario recuperado por Nombre Usuario',
                result_rows:Resultado.rowCount,
                result_proceso:'GET USUARIO POR NOMBRE USUARIO',
                result_data:Resultado.rows
            }        
    
        } catch (error) 
        {
            Salida = 
            {
                result_estado:'error',
                result_message:error.message,
                result_rows:0,
                result_proceso:'GET USUARIO POR NOMBRE USUARIO',
                result_data:''
            }        
        }
        res.json(Salida);
    })

    
/************************************************************************************/
/* Segundo => END POINT => Servicio WEB => Servicio REST => Get por (GMAIL USUARIO) */
/************************************************************************************/
/*ServidorWeb.get("/gmailusuario/", async (req, res) => {
    const gmailusuario = req.query.gmailusuario;

    let SQL = 'select * from usuario where gmailusuario like $1 limit 50';

    let Resultado = '';

    try {
        Resultado = await ConexionDB.query(SQL, [`%${gmailusuario}%`]);

        Salida = {
            result_estado: 'ok',
            result_message: 'Libro recuperado por gmail',
            result_rows: Resultado.rowCount,
            result_proceso: 'GET LIBRO POR GMAIL',
            result_data: Resultado.rows
        };

    } catch (error) {
        Salida = {
            result_estado: 'error',
            result_message: error.message,
            result_rows: 0,
            result_proceso: 'GET LIBRO POR GMAIL',
            result_data: ''
        };
    }
    res.json(Salida);
});


/***********************************************************************************/
/* Segundo => END POINT => Servicio WEB => Servicio REST => Get por (TIPO USUARIO) */
/***********************************************************************************/
/*ServidorWeb.get("/tipousuario/",async(req,res)=>
    {
        const tipousuario = req.params.tipousuario;
    
        let SQL = 'select * from usuario where tipoususrio = $1';
    
        let Resultado = '';
    
        try {
            
            Resultado = await ConexionDB.query(SQL,[tipousuario]);
    
            Salida = 
            {
                result_estado:'ok',
                result_message:'usuario recuperado por tipo usuario',
                result_rows:Resultado.rowCount,
                result_proceso:'GET COMPRA POR TIPO USUARIO ',
                result_data:Resultado.rows[0]
            }          
    
        } catch (error) 
        {
            Salida = 
            {
                result_estado:'error',
                result_message:error.message,
                result_rows:0,
                result_proceso:'GET USUARIO POR TIPO USUARIO',
                result_data:''
            }        
        }
        res.json(Salida);
    })    
    

/*****************************************************************************************/
/* Segundo => END POINT => Servicio WEB => Servicio REST => Get por (CONTRASEÑA USUARIO) */
/*****************************************************************************************/
/*ServidorWeb.get("/contraseña/",async(req,res)=>
    {
        const contraseña = req.params.contraseña;
    
        let SQL = 'select * from usuario where contraseña = $1';
    
        let Resultado = '';
    
        try {
            
            Resultado = await ConexionDB.query(SQL,[contraseña]);
    
            Salida = 
            {
                result_estado:'ok',
                result_message:'usuario recuperado por contraseña',
                result_rows:Resultado.rowCount,
                result_proceso:'GET COMPRA POR  USUARIO CONTRASEÑA',
                result_data:Resultado.rows[0]
            }          
    
        } catch (error) 
        {
            Salida = 
            {
                result_estado:'error',
                result_message:error.message,
                result_rows:0,
                result_proceso:'GET USUARIO POR  USUARIO CONTRASEÑA',
                result_data:''
            }        
        }
        res.json(Salida);
    })    


/**********************************************************************************************/
/* Segundo => END POINT => Servicio WEB => Servicio REST => Get por (HABILITADO USUARIO) */
/**********************************************************************************************/
/*ServidorWeb.get("/habilitado/",async(req,res)=>
    {
        const habilitado = req.params.habilitado;
    
        let SQL = 'select * from usuario where habilitado = $1';
    
        let Resultado = '';
    
        try {
            
            Resultado = await ConexionDB.query(SQL,[habilitado]);
    
            Salida = 
            {
                result_estado:'ok',
                result_message:'usuario recuperado por habilitado',
                result_rows:Resultado.rowCount,
                result_proceso:'GET COMPRA POR  USUARIO HABILITADO',
                result_data:Resultado.rows[0]
            }          
    
        } catch (error) 
        {
            Salida = 
            {
                result_estado:'error',
                result_message:error.message,
                result_rows:0,
                result_proceso:'GET USUARIO POR  USUARIO HABILITADO',
                result_data:''
            }        
        }
        res.json(Salida);
    })    



    //************************ END POINT DE REGISTRAR INSUMO *************************/




/********************************************************************************/
/* Segundo => END POINT => Servicio WEB => Servicio REST => Get por (ID INSUMO) */
/********************************************************************************/

ServidorWeb.get("/insumo/:ID",async(req,res)=>
    {
        const ID = req.params.ID;
    
        let SQL = 'select * from insumo where idinsumo = $1';
    
        let Resultado = '';
    
        try {
            
            Resultado = await ConexionDB.query(SQL,[ID]);
    
            Salida = 
            {
                result_estado:'ok',
                result_message:'insumo recuperado por ID',
                result_rows:Resultado.rowCount,
                result_proceso:'GET INSUMO POR ID',
                result_data:Resultado.rows[0] 
            }          
    
        } catch (error) 
        {
            Salida = 
            {
                result_estado:'error',
                result_message:error.message,
                result_rows:0,
                result_proceso:'GET INSUMO POR ID',
                result_data:''
            }        
        }
        res.json(Salida);
    })
    

/***************************************************************************************/
/* Segundo => END POINT => Servicio WEB => Servicio REST => Get por (CATEGORIA INSUMO) */
/***************************************************************************************/

ServidorWeb.get("/categoria/",async(req,res)=>
    {
        const CATEGORIA = req.query.categoria;
    
        let SQL = 'select * from insumo where categoria like $1 limit 50';
    
        let Resultado = '';
    
        try {
            
            Resultado = await ConexionDB.query(SQL,[`%${CATEGORIA}%`]);
    
            Salida = 
            {
                result_estado:'ok',
                result_message:'Insumo recuperado por categoria',
                result_rows:Resultado.rowCount,
                result_proceso:'GET INSUMO POR CATEGORIA',
                result_data:Resultado.rows
            }        
    
        } catch (error) 
        {
            Salida = 
            {
                result_estado:'error',
                result_message:error.message,
                result_rows:0,
                result_proceso:'GET INSUMO POR CATEGORIA',
                result_data:''
            }        
        }
        res.json(Salida);
    })

/************************************************************************************/
/* Segundo => END POINT => Servicio WEB => Servicio REST => Get por (NOMBRE INSUMO) */
/************************************************************************************/

ServidorWeb.get("/nombreinsumo/",async(req,res)=>
{
    const NOMBRE = req.query.nombre;

    let SQL = 'select * from insumo where nombreinsumo like $1 limit 50';

    let Resultado = '';

    try {
        
        Resultado = await ConexionDB.query(SQL,[`%${NOMBRE}%`]);

        Salida = 
        {
            result_estado:'ok',
            result_message:'Insumo recuperado por Nombre',
            result_rows:Resultado.rowCount,
            result_proceso:'GET INSUMO POR NOMBRE',
            result_data:Resultado.rows
        }        

    } catch (error) 
    {
        Salida = 
        {
            result_estado:'error',
            result_message:error.message,
            result_rows:0,
            result_proceso:'GET INSUMO POR NOMBRE ',
            result_data:''
        }        
    }
    res.json(Salida);
})




/*****************************************************************************************/
/* Segundo => END POINT => Servicio WEB => Servicio REST => Get por (DESCRIPCION INSUMO) */
/*****************************************************************************************/

ServidorWeb.get("/descripcion/",async(req,res)=>
    {
        const descripcion = req.query.descripcion;
    
        let SQL = 'select * from insumo where descripcion like $1 limit 50';
    
        let Resultado = '';
    
        try {
            
            Resultado = await ConexionDB.query(SQL,[`%${descripcion}%`]);
    
            Salida = 
            {
                result_estado:'ok',
                result_message:'Insumo recuperado por Descripcion',
                result_rows:Resultado.rowCount,
                result_proceso:'GET INSUMO POR DESCRIPCION',
                result_data:Resultado.rows
            }        
    
        } catch (error) 
        {
            Salida = 
            {
                result_estado:'error',
                result_message:error.message,
                result_rows:0,
                result_proceso:'GET INSUMO POR DESCRIPCION',
                result_data:''
            }        
        }
        res.json(Salida);
    })


/**************************************************************************************/
/* Segundo => END POINT => Servicio WEB => Servicio REST => Get por (CANTIDAD INSUMO) */
/**************************************************************************************/

ServidorWeb.get("/cantidad/",async(req,res)=>
    {
        const cantidad = req.query.cantidad;
    
        let SQL = 'select * from insumo where cantidad like $1 limit 50';
    
        let Resultado = '';
    
        try {
            
            Resultado = await ConexionDB.query(SQL,[`%${cantidad}%`]);
    
            Salida = 
            {
                result_estado:'ok',
                result_message:'Insumo recuperado por cantidad',
                result_rows:Resultado.rowCount,
                result_proceso:'GET INSUMO POR CANTIDAD',
                result_data:Resultado.rows
            }        
    
        } catch (error) 
        {
            Salida = 
            {
                result_estado:'error',
                result_message:error.message,
                result_rows:0,
                result_proceso:'GET INSUMO POR CANTIDAD',
                result_data:''
            }        
        }
        res.json(Salida);
    })


    //************************ END POINT DE MOVIMIENTO *************************/

/************************************************************************************/
/* Segundo => END POINT => Servicio WEB => Servicio REST => Get por (ID MOVIMIENTO) */
/************************************************************************************/

ServidorWeb.get("/idmovimiento/:ID",async(req,res)=>
    {
        const ID = req.params.ID;
    
        let SQL = 'select * from movimiento where idmovimiento = $1';
    
        let Resultado = '';
    
        try {
            
            Resultado = await ConexionDB.query(SQL,[ID]);
    
            Salida = 
            {
                result_estado:'ok',
                result_message:'movimiento recuperado por ID',
                result_rows:Resultado.rowCount,
                result_proceso:'GET MOVIMIENTO POR ID',
                result_data:Resultado.rows[0] 
            }          
    
        } catch (error) 
        {
            Salida = 
            {
                result_estado:'error',
                result_message:error.message,
                result_rows:0,
                result_proceso:'GET MOVIMIENTO POR ID',
                result_data:''
            }        
        }
        res.json(Salida);
    })

/**************************************************************************************/
/* Segundo => END POINT => Servicio WEB => Servicio REST => Get por (TIPO MOVIMIENTO) */
/***************************************************************************************/


ServidorWeb.get("/tipomovimiento/",async(req,res)=>
    {
        const tipomovimiento = req.query.tipomovimiento;
    
        let SQL = 'select * from movimiento where tipomovimiento like $1 limit 50';
    
        let Resultado = '';
    
        try {
            
            Resultado = await ConexionDB.query(SQL,[`%${tipomovimiento}%`]);
    
            Salida = 
            {
                result_estado:'ok',
                result_message:'Movimiento recuperado por tipo',
                result_rows:Resultado.rowCount,
                result_proceso:'GET MOVIMIENTO POR TIPO',
                result_data:Resultado.rows
            }        
    
        } catch (error) 
        {
            Salida = 
            {
                result_estado:'error',
                result_message:error.message,
                result_rows:0,
                result_proceso:'GET MOVIMIENTO POR TIPO',
                result_data:''
            }        
        }
        res.json(Salida);
    })

/********************************************************************************************/
/* Segundo => END POINT => Servicio WEB => Servicio REST => Get por (FECHA/HORA MOVIMIENTO) */
/********************************************************************************************/

ServidorWeb.get("/fechahora/",async(req,res)=>
    {
        const fechahora = req.query.fechahora;
    
        let SQL = 'select * from movimiento where fechahora like $1 limit 50';
    
        let Resultado = '';
    
        try {
            
            Resultado = await ConexionDB.query(SQL,[`%${fechahora}%`]);
    
            Salida = 
            {
                result_estado:'ok',
                result_message:'Movimiento recuperado por fecha y hora',
                result_rows:Resultado.rowCount,
                result_proceso:'GET MOVIMIENTO POR FECHA Y HORA',
                result_data:Resultado.rows
            }        
    
        } catch (error) 
        {
            Salida = 
            {
                result_estado:'error',
                result_message:error.message,
                result_rows:0,
                result_proceso:'GET MOVIMIENTO POR FECHA Y HORA',
                result_data:''
            }        
        }
        res.json(Salida);
    })


/*********************************************************************************************/
/* Segundo => END POINT => Servicio WEB => Servicio REST => Get por (OBSERVACION MOVIMIENTO) */
/*********************************************************************************************/

ServidorWeb.get("/observacion /",async(req,res)=>
    {
        const observacion = req.query.observacion;
    
        let SQL = 'select * from movimiento where observacion like $1 limit 50';
    
        let Resultado = '';
    
        try {
            
            Resultado = await ConexionDB.query(SQL,[`%${observacion}%`]);
    
            Salida = 
            {
                result_estado:'ok',
                result_message:'Movimiento recuperado por observacion',
                result_rows:Resultado.rowCount,
                result_proceso:'GET MOVIMIENTO POR OBSERVACION',
                result_data:Resultado.rows
            }        
    
        } catch (error) 
        {
            Salida = 
            {
                result_estado:'error',
                result_message:error.message,
                result_rows:0,
                result_proceso:'GET MOVIMIENTO POR OBSERVACION',
                result_data:''
            }        
        }
        res.json(Salida);
    })


/******************************************************************************************/
/* Segundo => END POINT => Servicio WEB => Servicio REST => Get por (EMPLEADO MOVIMIENTO) */
/******************************************************************************************/

ServidorWeb.get("/empleado/",async(req,res)=>
    {
        const empleado = req.query.empleado;
    
        let SQL = 'select * from movimiento where empleado like $1 limit 50';
    
        let Resultado = '';
    
        try {
            
            Resultado = await ConexionDB.query(SQL,[`%${empleado}%`]);
    
            Salida = 
            {
                result_estado:'ok',
                result_message:'Movimiento recuperado por empleado',
                result_rows:Resultado.rowCount,
                result_proceso:'GET MOVIMIENTO POR EMPLEADO',
                result_data:Resultado.rows
            }        
    
        } catch (error) 
        {
            Salida = 
            {
                result_estado:'error',
                result_message:error.message,
                result_rows:0,
                result_proceso:'GET MOVIMIENTO POR EMPLEADO',
                result_data:''
            }        
        }
        res.json(Salida);
    })


/****************************************************************************************/
/* Segundo => END POINT => Servicio WEB => Servicio REST => Get por (ESTADO MOVIMIENTO) */
/****************************************************************************************/

ServidorWeb.get("/estado/",async(req,res)=>
    {
        const estado = req.query.estado;
    
        let SQL = 'select * from movimiento where estado like $1 limit 50';
    
        let Resultado = '';
    
        try {
            
            Resultado = await ConexionDB.query(SQL,[`%${estado}%`]);
    
            Salida = 
            {
                result_estado:'ok',
                result_message:'Movimiento recuperado por estado',
                result_rows:Resultado.rowCount,
                result_proceso:'GET MOVIMIENTO POR ESTADO',
                result_data:Resultado.rows
            }        
    
        } catch (error) 
        {
            Salida = 
            {
                result_estado:'error',
                result_message:error.message,
                result_rows:0,
                result_proceso:'GET MOVIMIENTO POR ESTADO',
                result_data:''
            }        
        }
        res.json(Salida);
    })


/********************************************************************************************/
/* Segundo => END POINT => Servicio WEB => Servicio REST => Get por (AUTORIZADO MOVIMIENTO) */
/********************************************************************************************/

ServidorWeb.get("/autorizacion/",async(req,res)=>
    {
        const autorizacion = req.query.autorizacion;
    
        let SQL = 'select * from movimiento where autorizacion like $1 limit 50';
    
        let Resultado = '';
    
        try {
            
            Resultado = await ConexionDB.query(SQL,[`%${autorizacion}%`]);
    
            Salida = 
            {
                result_estado:'ok',
                result_message:'Movimiento recuperado por autorizacion',
                result_rows:Resultado.rowCount,
                result_proceso:'GET MOVIMIENTO POR AUTORIZACION',
                result_data:Resultado.rows
            }        
    
        } catch (error) 
        {
            Salida = 
            {
                result_estado:'error',
                result_message:error.message,
                result_rows:0,
                result_proceso:'GET MOVIMIENTO POR AUTORIZACION',
                result_data:''
            }        
        }
        res.json(Salida);
    })

/*****************************************************************************************************/
/* Segundo => END POINT => Servicio WEB => Servicio REST => Get por (NOMBRE DESTINATARIO MOVIMIENTO) */
/*****************************************************************************************************/

ServidorWeb.get("/nombredestinatario/",async(req,res)=>
    {
        const nombredestinatario = req.query.nombredestinatario;
    
        let SQL = 'select * from movimiento where nombredestinatario like $1 limit 50';
    
        let Resultado = '';
    
        try {
            
            Resultado = await ConexionDB.query(SQL,[`%${nombredestinatario}%`]);
    
            Salida = 
            {
                result_estado:'ok',
                result_message:'Movimiento recuperado por nombre destinatario',
                result_rows:Resultado.rowCount,
                result_proceso:'GET MOVIMIENTO POR NOMBRE DESTINATARIO',
                result_data:Resultado.rows
            }        
    
        } catch (error) 
        {
            Salida = 
            {
                result_estado:'error',
                result_message:error.message,
                result_rows:0,
                result_proceso:'GET MOVIMIENTO POR NOMBRE DESTINATARIO',
                result_data:''
            }        
        }
        res.json(Salida);
    })

/*******************************************************************************************************/
/* Segundo => END POINT => Servicio WEB => Servicio REST => Get por (TELEFONO DESTINATARIO MOVIMIENTO) */
/*******************************************************************************************************/

ServidorWeb.get("/telefonodestinatario/",async(req,res)=>
    {
        const telefonodestinatario = req.query.telefonodestinatario;
    
        let SQL = 'select * from movimiento where telefonodestinatario like $1 limit 50';
    
        let Resultado = '';
    
        try {
            
            Resultado = await ConexionDB.query(SQL,[`%${telefonodestinatario}%`]);
    
            Salida = 
            {
                result_estado:'ok',
                result_message:'Movimiento recuperado por telefono destinatario',
                result_rows:Resultado.rowCount,
                result_proceso:'GET MOVIMIENTO POR TELEFONO DESTINATARIO',
                result_data:Resultado.rows
            }        
    
        } catch (error) 
        {
            Salida = 
            {
                result_estado:'error',
                result_message:error.message,
                result_rows:0,
                result_proceso:'GET MOVIMIENTO POR TELEFONO DESTINATARIO ',
                result_data:''
            }        
        }
        res.json(Salida);
    })

/*****************************************************************************************/
/* Segundo => END POINT => Servicio WEB => Servicio REST => Get por (MENSAJE MOVIMIENTO) */
/*****************************************************************************************/




////////////////////////////////////POST///////////////////////////////////////////////////

/************************************************************************************/
/* DECIMOCTAVO => END POINT => Servicio WEB => Servicio REST => POST por USUARIO */
/************************************************************************************/

//http://localhost:3000/usuario

ServidorWeb.post("/usuario/",async(req,res)=>
{
    const {nombrecompletousuario,dniusuario,nombreusuario,gmailusuario,tipousuario,contraseña,habilitado} = req.body;

    let SQL = 'insert into usuario (nombrecompletousuario,dniusuario,nombreusuario,gmailusuario,tipousuario,contraseña,habilitado) values ($1,$2,$3,$4,$5,$6,$7) returning *';

    let Resultado = '';

    try {
        
        Resultado = await ConexionDB.query(SQL,[nombrecompletousuario,dniusuario,nombreusuario,gmailusuario,tipousuario,contraseña,habilitado]);

        Salida = 
        {
            result_estado:'ok',
            result_message:'Usuario Insertado',
            result_rows:Resultado.rowCount,
            result_proceso:'POST USUARIO',
            result_data:Resultado.rows[0]
        }          

    } catch (error) 
    {
        Salida = 
        {
            result_estado:'error',
            result_message:error.message,
            result_rows:0,
            result_proceso:'POST ',
            result_data:''
        }        
    }
    res.json(Salida);
})

// Iniciar el servidor
ServidorWeb.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
