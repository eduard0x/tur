//Importamos express en el index para generar las rutas

const express = require('express');
const router = express.Router();
const usuario = require('../models/usuario');

//Qué hacer cuando se visite la pagina de usuarios
router.get('/usuarios',(req, res)=>{
    //res.send('Usuarios');
    res.render('usuarios.hbs');
})

router.get('/usuarios/nuevo',(req,res)=>{
    console.log(req.body);
    res.render('usuario/nuevo-usuario');
})

router.post('/usuarios/add', async (req,res)=>{
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
        await nuevo_usuario.save();

        //Mandarlo como mensaje informativo en la vista !!
        console.log("Usuario agregado");
        //const mensaje = "Usuario creado con exito";
        res.render('usuario/nuevo-usuario',{
            text:"Usuario creado con exito"
        });
    }
    
    
    
   
    
})

router.post('/usuarios/buscar',(req,res)=>{
    const {busqueda} = req.body;
    console.log(busqueda);
    usuario.findOne({'telefono':busqueda}, function (err, usuario){
    if(err) return err;
    
    res.render('usuario/perfil-usuario',{
        
    })
    const nombre = usuario.nombre;
    console.log(nombre);
    })
})



module.exports = router;