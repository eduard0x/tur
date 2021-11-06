//Importamos express en el index para generar las rutas
console.log("Log: modulo usuarios");
const express = require("express");
const router = express.Router(); //Router de express para definir las rutas de la app relacionadas al usuario
const usuario = require("../models/usuario"); //Para traer el modelo del usuario
const vehiculo = require("../models/vehiculo"); //Para traer el modelo del vehiculo
const passport = require("passport"); // Para autenticar el usuario en el momento en que está tratando de ingresar
const { isAuthenticated } = require("../helpers/auth"); //Para comprobar la autenticación de los usuarios
const path = require("path"); //Para generar rutas facilmente
var nodemailer = require("nodemailer"); //Para enviar emails

//GET /home
router.get("/home", isAuthenticated, function (req, res) {
  //Retorna los vehiculos almacenados en la base de datos
  vehiculo.find({}, function (err, result) {
    var vehiculos_vencidos = [];
    //Itera por cada resultado.
    result.forEach((v) => {
      var estaVencido = false;
      //Itera lista de archivos presente en el resultado actual.
      v.archivos.forEach((archivo) => {
        //Por cada archivo obtener fecha de vencimiento
        var fecha_vencimiento = archivo.fecha_vencimiento;

        //La fecha de vencimiento se debe settear para que excluya los minutos, segundos y milisegundos de la fecha.
        const fecha = new Date(fecha_vencimiento).setHours(0, 0, 0, 0);

        //La fecha de hoy se debe setterar para que se excluya los minutos, segundos y milisegundos.
        const hoy = new Date(Date.now()).setHours(0, 0, 0, 0);
        //Se verifica que el archivo no esté vencido.
        //Que la fecha de hoy no sea después de la fecha de vencimiento del archivo.
        if (hoy >= fecha && estaVencido == false) {
          vehiculos_vencidos.push(v);
          console.log("Hay un papel vencido");
          estaVencido = true; //Si existe un archivo vencido, se deben ignorar los demas archivos del vehiculo.
                            // Sucede esto para evitar enviar vehiculos con ducumentos vencidos duplicados.
        }
      });
    });
    /**
     * Aviso al correo electronico (Temporalmente deshabilitado)
     */
    /*
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
          });*/
    res.render("home", { vehiculos_vencidos });
  });
});

//GET /usuarios
router.get("/usuarios", isAuthenticated, (req, res) => {
  console.log("Log: GET /usuarios");
  //modelo del usuario que permite el CRUD utilizando el usuario como modelo.
  usuario
    .find({}, function (err, result) {
        //Usuarios que están almacenados en la base de datos, listo para enviar al frontend.
      var usuarios_encontrados = [];
      if (err) {
        console.log(err);
      } else {
        console.log(result);

        for (var i in result) {
            //Formateo de la fecha a una fecha más legible para el usuario.
            //Formating date to a date more readable for the user.
          const fecha = result[i].fecha_ingreso.toLocaleDateString();
          
          console.log(fecha);

            //Asignación de la fecha formateada.
          result[i].fecha_ingreso = fecha;

          //Adición del usuario formateado a la lista de usuarios encontrados.
          usuarios_encontrados.push(result[i]);
        }
        

        res.render("usuarios", { usuarios_encontrados });
      }
    })
    .lean(); //lean permite solucionar el error de la no carga de los valores
});

//GET /usuarios/nuevo
router.get("/usuarios/nuevo", isAuthenticated, (req, res) => {
  console.log("Log: GET /usuarios/nuevo");
  
  res.render("usuario/nuevo-usuario");
});

//Ruta desprotegida temporalmente
router.post("/usuarios/add", isAuthenticated, async (req, res) => {
  console.log("Log: usuarios/add");
  //Recibir los valores enviados desde el formulario de nuevo usuario.
  const {
    tipo,
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
    confirmar_password,
  } = req.body;
  
  //Acá se añadiran los errores presentados en la verificación de los campos del formulario
  var error = [];

  //Verificación de que los campos del formulario del nuevo usuario se encuentren NO vacios.
  if (identificacion.length == 0) {
    error.push({ text: "Por favor ingrese el campo identificacion" });
  }
  if (nombre.length == 0) {
    error.push({ text: "Por favor ingrese el campo nombre" });
  }
  if (apellido.length == 0) {
    error.push({ text: "Por favor ingrese el campo apellido" });
  }
  if (cargo.length == 0) {
    error.push({ text: "Por favor ingrese el campo cargo" });
  }
  if (correo.length == 0) {
    error.push({ text: "Por favor ingrese el campo correo" });
  }
  if (telefono.length == 0) {
    error.push({ text: "Por favor ingrese el campo telefono" });
  }
  if (eps.length == 0) {
    error.push({ text: "Por favor ingrese el campo eps" });
  }
  if (fecha_ingreso.length == 0) {
    error.push({ text: "Por favor ingrese el campo fecha_ingreso" });
  }
  if (password.length == 0) {
    error.push({ text: "Por favor ingrese el campo contraseña" });
  }
  if (confirmar_password.length == 0) {
    error.push({ text: "Por favor ingrese el campo confirmar contraseña" });
  }
  if (password != confirmar_password) {
    error.push({ text: "Las contraseñas no coinciden" });
  }

  //Si hubo errores en la verificación se redirige a la misma pagina con la información de los errores.
  if (error.length > 0) {
    console.log("Log: error.length > 0");
    res.render("usuario/nuevo-usuario", {
      error,
      nombre,
      telefono,
      eps,
    });
  } else {

  // Si no hay errores se verifica que el la identificación del nuevo usuario no esté en uso.
    const existencia = await usuario.findOne({
      identificacion: identificacion,
    });
    //Si existe un usuario con la misma identificación se redirige a la pagina de nuevo usuario adjuntando el error.
    if (existencia) {
      error.push({ text: "Hay un usuario con la misma identificación" });
      console.log("Hay un usuario con la misma identificación");
      res.render("usuario/nuevo-usuario", { error });
    } else {
    //Si no hay coincidencia el usuario se crea en la BD.
      console.log("Log:Creando usuario");
      //Obtección de los nombres de los archivos:
      //foto de perfil
      const foto_perfil = req.files.foto_perfil[0].filename;
      //certificado
      const certificado = req.files.certificado[0].filename;

      //Instanciación del modelo de usuario
      const nuevo_usuario = new usuario({
        tipo,
        identificacion,
        nombre,
        apellido,
        cargo,
        profesion,
        direccion,
        correo,
        telefono,
        eps,
        fecha_ingreso,
        numero_cuenta,
        banco,
        tipo_cuenta,
        pension,
        foto_perfil,
        certificado,
        password,
      });
      //Encriptación del password ingresado
      nuevo_usuario.password = await nuevo_usuario.encryptPassword(password);
      console.log(nuevo_usuario.password);

      //Agregando el nuevo usuario a la base de datos.
      await nuevo_usuario.save();

      //Mandarlo como mensaje informativo en la vista !!
      console.log("Usuario agregado");
      const mensaje = "Usuario creado con exito"; //Crear archivo de configuración que almacene todos los mensajes y configuraciones.
      
      //Renderizar la pagina 'usuario/nuevo-usuario' adjuntando mensaje para mostrar en la confirmación de la creación del usuario.
      res.render("usuario/nuevo-usuario", { mensaje });
    }
  }
});

//GET /
router.get("/", (req, res) => {

    //Renderizar la pagina 'usuario/iniciar' 
  res.render("usuario/iniciar", { layout: false });
});

//POST /usuarios/iniciar
router.post(
  "/usuarios/iniciar",
  //Autenticar el usuario: si es autenticado: redirigir a la pagina home: si no: redirigir a la pagina de login para que se autentique.
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/",
    failureFlash: true,
  })
);


//GET /usuarios/:id
router.get("/usuarios/:id", isAuthenticated, (req, res) => {
  console.log("Log: GET /usuarios/id");
  //id del usuario que fue seleccionado en la tabla de usuarios
  const id_usuario = req.params.id;
  console.log(id_usuario);

  //Encontrar el usuario que cumpla con la identificación del usuario seleccionado en la tabla de usuarios
  usuario
    .findOne({ identificacion: id_usuario }, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        //Si el usuario cumple con la condición se redirige al perfil del usuario con toda la información que tiene el usuario.
        res.render("usuario/perfil-usuario", { result });
      }
    })
    .lean();
});

//GET /perfil
router.get("/perfil", (req, res) => {
  const result = req.user;
  //Redirigir al perfil del usuario actual de la sesión. Se adjunta la información del usuario.
  res.render("usuario/perfil-usuario", { result });
});

//GET /logout
router.get("/logout", (req, res) => {

  //Metodo global que cierra la sesión del usuario.
  req.logout();

  //Redirige a la pantalla de loggeo del app
  res.redirect("/");
});

module.exports = router;
