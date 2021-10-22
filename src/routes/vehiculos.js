const express = require('express');
const router = express.Router();
const vehiculo = require('../models/vehiculo');
const { isAuthenticated } = require('../helpers/auth');


router.get('/vehiculos',isAuthenticated,(req, res)=>{
    console.log("Log: GET /vehiculos");
    vehiculo.find({},function (err, result){
        var vehiculos_encontrados = []
        if(err){
            console.log(err);
        }else{
            console.log(result);
            
            for(var i in result){
                

                vehiculos_encontrados.push(result[i]);
                
            }
            console.log(result[0]);
            var nombre = result[0].nombre;
            
            res.render('vehiculos',{vehiculos_encontrados});
            
        }
    }).lean()  //lean permite solucionar el error de la no carga de los valores
    
    
})

router.get('/vehiculos/nuevo',isAuthenticated,(req,res)=>{
    console.log(req.body);
    res.render('vehiculo/nuevo-vehiculo');
})

router.post('/vehiculos/add',isAuthenticated,async (req,res)=>{
    console.log(req.files);

    const {
        placa,
        km,
        marca,
        linea,
        categoria,
        centro_costos,
        ciudad,
        soat_entidad,
        soat_fecha_emision,
        soat_fecha_vencimiento,
        gases_entidad,
        gases_fecha_emision,
        gases_fecha_vencimiento
        } = req.body;
    
    var error = []
    
    if(placa.length > 0){
        error.push({text:"Debe ingresar la placa"});
    }
    if(km.length > 0){
        error.push({text:"Debe ingresar el kilometraje"});
    }
    if(marca.length == 0){
        error.push({text:"Debe ingresar la marca"});
    }
    if(linea.length == 0){
        error.push({text:"Debe ingresar la linea"});
    }
    if(categoria.length == 0){
        error.push({text:"Debe ingresar la categoria"});
    }
    if(centro_costos.length == 0){
        error.push({text:"Debe ingresar el centro de costos"});
    }
    if(ciudad.length == 0){
        error.push({text:"Debe ingresar la ciudad"});
    }
    if(soat_entidad.length == 0){
        error.push({text:"Debe ingresar el nombre de la aseguradora"});
    }
    if(soat_fecha_emision.length == 0){
        error.push({text:"Debe ingresar la fecha de emisión del soat"});
    }
    if(soat_fecha_vencimiento.length == 0){
        error.push({text:"Debe ingresar la fecha de vencimiento del soat"});
    }
    if(gases_entidad.length == 0){
        error.push({text:"Debe ingresar la entidad de gases"});
    }
    if(gases_fecha_emision.length == 0){
        error.push({text:"Debe ingresar la fecha de emisión del certificado de gases"});
    }
    if(gases_fecha_vencimiento.length == 0){
        error.push({text:"Debe ingresar la fecha de vencimiento del certificado de gases"});
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
            km,
            marca,
            linea,
            categoria,
            centro_costos,
            ciudad,
            archivos
        });

        await nuevo_vehiculo.save();
        const mensaje = "Vehiculo agregado con exito";
        res.render('vehiculo/nuevo-vehiculo',{mensaje});
    }
    
    
    
    
    
    
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