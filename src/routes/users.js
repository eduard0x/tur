//Importamos express en el index para generar las rutas
console.log("Log: modulo usuarios");
const express = require('express');
const router = express.Router();
const usuario = require('../models/usuario');
const vehiculo = require('../models/vehiculo');
const passport = require('passport');
const { isAuthenticated } = require('../helpers/auth'); 
const path = require('path');

//Emails
var nodemailer = require('nodemailer');



  


//Carga de archivos








router.get('/home',isAuthenticated,function(req, res){
    
    vehiculo.find({},function(err,result){
        var vehiculos_vencidos = []
        result.forEach(v => {
            var estaVencido = false;
            v.archivos.forEach(archivo=>{
                var fecha_vencimiento = archivo.fecha_vencimiento;
                
                

                const fecha = new Date(fecha_vencimiento).setHours(0,0,0,0);
                const hoy = new Date(Date.now()).setHours(0,0,0,0);
                
                if(hoy>=fecha && estaVencido==false){
                    
                    vehiculos_vencidos.push(v);
                    console.log("Hay un papel vencido");
                    estaVencido = true;
                    
                }
                
            });
           
        });
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'ingenieromiguelfuentes@gmail.com',
              pass: 'Kqxa8SL4eizl'
            }
          });
        var mensaje = `<b><h1>Existen papeles vencidos que requieren tu atención.</h1></b>`;

        vehiculos_vencidos.forEach(v=>{
            var minimensaje1 = `<h2>Vehiculo con placas ${v.placa}</h2>`;
            v.archivos.forEach(a=>{
                const minimensaje2 = `<h3>Fecha vencimiento de ${a.nombre}: ${a.fecha_vencimiento}</h3>`;
                minimensaje1 += minimensaje2;
                
            })
            mensaje += minimensaje1;
        })
                                   
          
          
        
          var mailOptions = {
            from: 'ingenieromiguelfuentes@gmail.com',
            to: 'meduardofuentesc@gmail.com',
            subject: 'Tur Colombia',
            html: mensaje
          };
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email enviado: ' + info.response);
            }
          });
     res.render('home',{vehiculos_vencidos});
})
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
                const fecha = result[i].fecha_ingreso.toLocaleDateString();
                console.log(fecha);

                result[i].fecha_ingreso = fecha;

                usuarios_encontrados.push(result[i]);
                
            }
            console.log(result[0]);
            var nombre = result[0].nombre;
            
            res.render('usuarios',{usuarios_encontrados});
            
        }
    }).lean()  //lean permite solucionar el error de la no carga de los valores
    
    
})


//Ruta desprotegida temporalmente
router.get('/usuarios/nuevo',isAuthenticated,(req,res)=>{
    console.log("Log: GET /usuarios/nuevo");
    console.log(req.body);
    console.log(req.body);
    res.render('usuario/nuevo-usuario');
})


//Ruta desprotegida temporalmente
router.post('/usuarios/add',isAuthenticated,async (req,res)=>{
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
        foto_perfil,
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
            const foto_perfil = req.files.foto_perfil[0].filename;
            const certificado = req.files.certificado[0].filename;
            const nuevo_usuario = new usuario({tipo, identificacion, nombre, apellido, cargo, profesion, direccion, correo, telefono, eps, fecha_ingreso, numero_cuenta, banco, tipo_cuenta, pension, foto_perfil, certificado, password});
            console.log(nuevo_usuario.password);
            nuevo_usuario.password =await nuevo_usuario.encryptPassword(password);
            console.log(nuevo_usuario.password);
            await nuevo_usuario.save();

            
            
           
            if(req.files['foto_perfil']){
                console.log(req.files['foto_perfil']);
                req.files['foto_perfil'][0].filename = "foto_de_perfil.jpg";
                console.log(req.files['foto_perfil']);
            }
            if(req.files['certificado']){
                console.log(req.files['certificado']);
                req.files['certificado'][0].filename = "cErTiFicaDO.pdf";
                console.log(req.files['certificado']);
            }


            

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