const express = require('express');
const router = express.Router();
const vehiculo = require('../models/vehiculo');
const { isAuthenticated } = require('../helpers/auth');

//GET /vehiculos
router.get('/vehiculos',isAuthenticated,(req, res)=>{
    console.log("Log: GET /vehiculos");

    //Encuentra la lista de vehiculos almacenados en la BD Mongo.
    vehiculo.find({},function (err, result){
        //El titulo de la tabla es un argumento que recibe la vista vehiculos.hbs para mostrar los vehiculos con un filtro aplicado.
        const titulo_tabla = "Vehiculos";
        var vehiculos_encontrados = []
        if(err){
            console.log(err);
        }else{
            
            //Iteración de la lista de vehiculos para asignalos en una lista
            for(var i in result){
                

                vehiculos_encontrados.push(result[i]);
                
            }
            
            //Se redirige al usuario a la vista vehiculos donde mostrará los vehiculos almacenados en la BD Mongo.
            res.render('vehiculos',{vehiculos_encontrados,titulo_tabla});
            
        }
    }).lean()  //lean permite solucionar el error de la no carga de los valores
    
    
})

//GET /vehiculos/vencidos
router.get('/vehiculos/vencidos',isAuthenticated,(req, res)=>{
    //Encuentra la lista de vehiculos almacenados en la base de datos.
    //Find the stored car list of the database.
    vehiculo.find({},function (err, result){
        const titulo_tabla = "Vehiculos vencidos";
        console.log(result);
        var vehiculos_encontrados = []
        if(err){
            console.log(err);
        }else{
            result.forEach(v => {
                var estaVencido = false;
                v.archivos.forEach(archivo=>{
                    var fecha_vencimiento = archivo.fecha_vencimiento;
                    
                    
                    //Las fechas se setean para que no incluyan los minutos, segundos y milisegundos.
                    const fecha = new Date(fecha_vencimiento).setHours(0,0,0,0);
                    const hoy = new Date(Date.now()).setHours(0,0,0,0);
                    
                    if(hoy>=fecha && estaVencido==false){
                        
                        vehiculos_encontrados.push(v);
                        console.log("Hay un papel vencido");
                        estaVencido = true;
                        
                    }
                    
                });
               
            });
           
            
            res.render('vehiculos',{vehiculos_encontrados,titulo_tabla});
            
        }
    }).lean()
})





router.get('/vehiculos/nuevo',isAuthenticated,(req,res)=>{
    console.log(req.body);
    res.render('vehiculo/nuevo-vehiculo');
})

router.get('/vehiculos/verificar',isAuthenticated,(req,res)=>{
    console.log(req.body);
    res.render('vehiculo/verificacion');
})

router.post('/vehiculos/verificar',isAuthenticated,async(req,res)=>{
    
    //placa que se desea verificar
    const placa = req.body.placa;
    
    //Retorna true si existe un vehiculo registrado con la placa ingresada.
    const existencia = await vehiculo.exists({placa:placa});
    
   

    if(existencia){
        res.render('vehiculo/verificacion',{existencia})
    }else{
        res.render('vehiculo/nuevo-vehiculo',{placa});
    }
    
    
})


router.post('/vehiculos/add',isAuthenticated,async (req,res)=>{
    console.log(req.files);

    const {
        placa,
        marca,
        linea,
        modevencimiento,
        gases_entidlo,
        color,
        tipo_vehiculo,
        tipo_medicion,
        tipo_trabajo,
        combustible_principal,
        combustible_secundario,
        soat_entidad,
        soat_fecha_emision,
        soat_fecha_ad,
        gases_fecha_emision,
        gases_fecha_vencimiento
        } = req.body;
    
    var error = []
    
    if(placa.length > 0){
        error.push({text:"Debe ingresar la placa"});
    }
    
    if(error.length == 0){
        res.render('vehiculo/nuevo-vehiculo',{
            error,
            placa
        });
    }else{
        const soat_prueba = req.files.soat[0].filename;
        const gases_prueba = req.files.soat[0].filename;
        console.log(placa);
        console.log(soat_prueba);
        console.log(gases_prueba);

        
        var archivos = []
        
        const soat = {
            nombre:"soat",
            nombre_entidad:soat_entidad,
            fecha_emision:soat_fecha_emision,
            fecha_vencimiento:soat_fecha_vencimiento,
            path:req.files.soat[0].filename};


        const gases = {
            nombre:"gases",
            nombre_entidad:gases_entidad,
            fecha_emision: gases_fecha_emision,
            fecha_vencimiento: gases_fecha_vencimiento, 
            path:req.files.gases[0].filename};
        archivos.push(soat);
        archivos.push(gases);
        

        const nuevo_vehiculo = new vehiculo(
            {
            placa,
            marca,
            linea,
            modelo,
            color,
            tipo_vehiculo,
            tipo_medicion,
            tipo_trabajo,
            combustible_principal,
            combustible_secundario,
            archivos
        });

        await nuevo_vehiculo.save();
        const mensaje = "Vehiculo agregado con exito";
        res.render('vehiculo/nuevo-vehiculo',{mensaje});
    }
    
    
    
    
    
    
})

router.post('vehiculos/modificar',isAuthenticated,async (req,res)=>{
    console.log("Log: POST /vehiculos/modificar");
    const {
        placa,
        marca,
        linea,
        modevencimiento,
        gases_entidlo,
        color,
        tipo_vehiculo,
        tipo_medicion,
        tipo_trabajo,
        combustible_principal,
        combustible_secundario,
        soat_entidad,
        soat_fecha_emision,
        soat_fecha_ad,
        gases_fecha_emision,
        gases_fecha_vencimiento
        } = req.body;

    

    var archivos = []
        
    const soat = {
        nombre:"soat",
        nombre_entidad:soat_entidad,
        fecha_emision:soat_fecha_emision,
        fecha_vencimiento:soat_fecha_vencimiento,
        path:req.files.soat[0].filename};


    const gases = {
        nombre:"gases",
        nombre_entidad:gases_entidad,
        fecha_emision: gases_fecha_emision,
        fecha_vencimiento: gases_fecha_vencimiento, 
        path:req.files.gases[0].filename};
    archivos.push(soat);
    archivos.push(gases);

    /**
     * Fotos
     */
     var fotos = []
    const nombre_foto = req.files.foto_vehiculo[0].filename;
    const foto_vehiculo= {
         nombre:nombre_foto
     }

    fotos.push(foto_vehiculo);



    var query = {placa}

    var update = {
            marca,
            linea,
            modelo,
            color,
            tipo_vehiculo,
            tipo_medicion,
            tipo_trabajo,
            combustible_principal,
            combustible_secundario,
            archivos,
            fotos
    }

    await vehiculo.updateOne(query,update,options,callback);

})

router.get('/vehiculos/:placa',isAuthenticated,(req,res)=>{
    console.log("Log: GET /vehiculos/placa");
    const placa_vehiculo = req.params.placa;
    console.log(placa_vehiculo);
    vehiculo.findOne({placa:placa_vehiculo},function (err,result){
        if(err){
            console.log(err);
        }else{
            console.log(result);
            res.render('vehiculo/perfil-vehiculo',{result});
        }
    }).lean()
    
})


module.exports = router;