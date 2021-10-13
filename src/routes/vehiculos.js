const express = require('express');
const router = express.Router();
const usuario = require('../models/usuario');
const { isAuthenticated } = require('../helpers/auth');

router.get('/vehiculos',isAuthenticated,(req, res)=>{
    //res.send('Usuarios');
    res.render('usuarios.hbs');
})

router.get('/vehiculos/nuevo',isAuthenticated,(req,res)=>{
    console.log(req.body);
    res.render('vehiculo/nuevo-vehiculo');
})

router.post('/vehiculos/add',isAuthenticated,(req,res)=>{
    const{identificacion, nombre, apellido, cargo, correo, telefono, eps, fecha_ingreso} = req.body;
    var error = []
    if(!identificacion){
        error.push({text:"Por favor ingrese el campo identificacion"})
    }
    if(!nombre){
        error.push({text:"Por favor ingrese el campo nombre"})
    }
    if(!apellido){
        error.push({text:"Por favor ingrese el campo apellido"})
    }
    if(!cargo){
        error.push({text:"Por favor ingrese el campo cargo"})
    }
    if(!correo){
        error.push({text:"Por favor ingrese el campo correo"})
    }
    if(!telefono){
        error.push({text:"Por favor ingrese el campo telefono"})
    }
    if(!eps){
        error.push({text:"Por favor ingrese el campo eps"})
    }
    if(!fecha_ingreso){
        error.push({text:"Por favor ingrese el campo fecha_ingreso"})
    }
    
    if(error.length > 0){
        res.render('usuario/nuevo-usuario',{
            error,
            nombre,
            cedula,
            telefono,
            eps
        });
    }
    else{
        const nuevo_usuario = new usuario({identificacion, nombre, apellido, cargo, correo, telefono, eps, fecha_ingreso});
        nuevo_usuario.save();

        //Mandarlo como mensaje informativo en la vista !!
        console.log("Usuario agregado");
        //const mensaje = "Usuario creado con exito";
        res.render('usuario/nuevo-usuario',{
            text:"Usuario creado con exito"
        });
    }
    
    
    
   
    
})


module.exports = router;