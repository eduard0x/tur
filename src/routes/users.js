//Importamos express en el index para generar las rutas
console.log("Log: modulo usuarios");
const express = require('express');
const router = express.Router();
const usuario = require('../models/usuario');
const passport = require('passport');
const { isAuthenticated } = require('../helpers/auth'); 
const path = require('path');
//Carga de archivos








router.get('/home',isAuthenticated,(req, res)=>{
    console.log("Log: GET /home");
    
     res.render('home');
})




//Qué hacer cuando se visite la pagina de usuarios
router.get('/usuarios',isAuthenticated,(req, res)=>{
    console.log("Log: GET /usuarios");
    usuario.find({},function (err, result){
        var usuarios_encontrados = []
        if(err){
            console.log(err);
        }else{
            console.log(result);
            
            for(var i in result){
                usuarios_encontrados.push(result[i]);
                
            }
            console.log(result[0]);
            var nombre = result[0].nombre;
            
            res.render('usuarios',{usuarios_encontrados});
            
        }
    }).lean()  //lean permite solucionar el error de la no carga de los valores
    
    
})



router.get('/usuarios/nuevo',isAuthenticated,(req,res)=>{
    console.log("Log: GET /usuarios/nuevo");
    console.log(req.body);
    console.log(req.body);
    res.render('usuario/nuevo-usuario');
})



router.post('/usuarios/add', isAuthenticated,async (req,res)=>{
    console.log("Log: usuarios/add");
    const {tipo, 
        identificacion,
        nombre, 
        apellido, 
        cargo, 
        profesion, 
        correo, 
        telefono, 
        direccion, 
        eps, 
        fecha_ingreso, 
        numero_cuenta, 
        banco, 
        tipo_cuenta, 
        pension, 
        password,
        archivo, 
        confirmar_password} = req.body;
    console.log(req.file);
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
    if(!password){
        error.push({text:"Por favor ingrese el campo contraseña"})
    }
    if(!confirmar_password){
        error.push({text:"Por favor ingrese el campo confirmar contraseña"})
    }
    if(password!=confirmar_password){
        error.push({text:"Las contraseñas no coinciden"});
    }
    if(error.length > 0){
        console.log("Log: error.length > 0")
        res.render('usuario/nuevo-usuario',{
            error,
            nombre,
            telefono,
            eps
        });
    }
    else{
        const existencia = await usuario.findOne({identificacion:identificacion});
        if(existencia){
            error.push({text:"Hay un usuario con la misma identificación"});
           console.log('Hay un usuario con la misma identificación');
            res.render('usuario/nuevo-usuario',{error});
        }else{
            console.log("Log:Creando usuario");
            const nuevo_usuario = new usuario({tipo, identificacion, nombre, apellido, cargo, profesion, direccion, correo, telefono, eps, fecha_ingreso, numero_cuenta, banco, tipo_cuenta, pension, password});
            console.log(nuevo_usuario.password);
            nuevo_usuario.password =await nuevo_usuario.encryptPassword(password);
            console.log(nuevo_usuario.password);
            await nuevo_usuario.save();

            

            

            //Mandarlo como mensaje informativo en la vista !!
            console.log("Usuario agregado");
            const mensaje = "Usuario creado con exito";
            console.log("********************************");
            console.log("Archivo adjunto: ");
            console.log(req.file);
            console.log("*********************************");
            res.render('usuario/nuevo-usuario',{mensaje});

        }
        
        

       
    }
} 
)
router.get('/',(req,res)=>{
    res.render('usuario/iniciar',{layout:false});
})


router.post('/usuarios/iniciar',passport.authenticate('local',{
    successRedirect:'/home',
    failureRedirect:'/',
    failureFlash:true
}));

// router.post('/usuarios/iniciar',async (req,res)=>{
//     console.log("POST /usuarios/iniciar");
//     const {correo, password} = req.body;
//     var errors = [];
//     if(correo.length == 0){
//         console.log("bad correo");
//         errors.push({text:"Campo de correo vacio"})
//     }
//     if(password.length == 0){
//         console.log("bad password");
//         errors.push({text:"Campo de password vacio"})
//     }

//     if(errors.length>0){
//         res.render('usuario/iniciar',{errors});
//     }else{
//         const usuario_coincidencia = await usuario.findOne({correo:correo});
//     if(usuario_coincidencia){
//             console.log("Log: Hay un usuario con el correo ingresado.")
//             const coincidencia = await usuario_coincidencia.match(password);
//             console.log(coincidencia);
//             if(coincidencia){
//                 console.log("Log: Contraseña correcta");
//                 console.log('Log: Usuario loggeado'+coincidencia);
//                 res.render('home');
//             }else{
//                 console.log("Log: Contraseña invalida");
//                 const error = {text:'Contraseña invalida'}
//             res.render('usuario/iniciar',{correo,password,error});
//             }
//     }else{
//             console.log("Log: Correo no encontrado");
//             const error = {text:'El correo no se encuentra registrado'}
//             res.render('usuario/iniciar',{correo,password,error});
//         }
   
//     }
    
    
// })

// router.post('/usuarios/buscar',(req,res)=>{
//     const {busqueda} = req.body;
//     console.log(busqueda);
//     usuario.findOne({'telefono':busqueda}, function (err, usuario){
//     if(err) return err;
    
//     res.render('usuario/perfil-usuario',{
        
//     })
//     const nombre = usuario.nombre;
//     console.log(nombre);
//     })
// })


router.get('/usuarios/:id',isAuthenticated,(req,res)=>{
    console.log("Log: GET /usuarios/id");
    const id_usuario = req.params.id;
    console.log(id_usuario);
    usuario.findOne({identificacion:id_usuario},function (err,result){
        if(err){
            console.log(err);
        }else{
            console.log(result);
            res.render('usuario/perfil-usuario',{result});
        }
    }).lean()
    
})
router.get('/perfil',(req,res)=>{
    const result = req.user;
    res.render('usuario/perfil-usuario',{result});
})



router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/');
})

module.exports = router;