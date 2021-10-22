const express = require('express');
const router = express.Router();
const vehiculo = require('../models/vehiculo');
const { isAuthenticated } = require('../helpers/auth');

router.get('/vehiculos',isAuthenticated,(req, res)=>{
    //res.send('Usuarios');
    res.render('usuarios.hbs');
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
        const soat_prueba = req.files.soat[0].path;
        const gases_prueba = req.files.soat[0].path;
        console.log(placa);
        console.log(soat_prueba);
        console.log(gases_prueba);

        
        var archivos = []
        
        const soat = {
            nombre:"soat",
            nombre_entidad:soat_entidad,
            fecha_emision:soat_fecha_emision,
            fecha_vencimiento:soat_fecha_vencimiento,
            path:req.files.soat[0].path};


        const gases = {
            nombre:"gases",
            nombre_entidad:gases_entidad,
            fecha_emision: gases_fecha_emision,
            fecha_vencimiento: gases_fecha_vencimiento, 
            path:req.files.gases[0].path};
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


module.exports = router;