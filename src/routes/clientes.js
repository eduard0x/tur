const express = require('express');
const router = express.Router();
const cliente = require('../models/cliente');
const { isAuthenticated } = require('../helpers/auth');

router.get('/clientes',isAuthenticated,(req, res)=>{
    
    console.log("Log: GET /clientes");
    cliente.find({},function (err, result){
        var clientes_encontrados = []
        if(err){
            console.log(err);
        }else{
            console.log(result);
            
            for(var i in result){
                

                clientes_encontrados.push(result[i]);
                
            }
            
            
            res.render('clientes',{clientes_encontrados});
            
        }
    }).lean()  //lean permite solucionar el error de la no carga de los valores
    
})

router.get('/clientes/nuevo',isAuthenticated,(req,res)=>{
    console.log(req.body);
    res.render('cliente/nuevo-cliente');
})

router.post('/clientes/add',isAuthenticated,(req,res)=>{
    const{identificacion} = req.body;
    var error = []
    if(identificacion.length == 0){
        error.push({text:"Por favor ingrese el campo identificacion"})
    }
    
    if(error.length > 0){
        res.render('cliente/nuevo-cliente',{
            error,
            identificacion
        });
    }
    else{
        const foto_cliente = req.files.foto_cliente[0].filename;
        const certificado = req.files.certificado[0].filename;
        const nuevo_cliente = new cliente({identificacion,foto_cliente,certificado});
        nuevo_cliente.save();

        //Mandarlo como mensaje informativo en la vista !!
        console.log("Cliente agregado");
        //const mensaje = "Usuario creado con exito";
        res.render('cliente/nuevo-cliente',{
            text:"Usuario creado con exito"
        });
    }
    
    
    
   
    
})

router.get('/clientes/:identificacion',isAuthenticated,(req,res)=>{
    const identificacion = req.params.identificacion;
    cliente.findOne({identificacion:identificacion},function(err,result){
        if(err){
            console.log(err);
        }else{
            res.render('cliente/perfil-cliente',{result});
        }
    }).lean()
})

module.exports = router;