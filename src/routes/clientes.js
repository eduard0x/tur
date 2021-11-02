const express = require("express");
const router = express.Router();
const cliente = require("../models/cliente");
const { isAuthenticated } = require("../helpers/auth");

//GET /clientes
router.get("/clientes", isAuthenticated, (req, res) => {
  console.log("Log: GET /clientes");
  //Modelo de cliente importado desde model
  cliente
    .find({}, function (err, result) {
      //Clientes que se encuentran almacenados en la BD
      var clientes_encontrados = [];
      if (err) {
        console.log(err);
      } else {
        console.log(result);

        for (var i in result) {
          clientes_encontrados.push(result[i]);
        }
        //Renderizar la lista de clientes, pasandole como argumento los clientes para llenar la tabla.
        res.render("clientes", { clientes_encontrados });
      }
    })
    .lean(); //lean permite solucionar el error de la no carga de los valores
});
//GET /clientes/nuevo
router.get("/clientes/nuevo", isAuthenticated, (req, res) => {
  console.log(req.body);
  //Renderizar el formulario nuevo cliente 
  res.render("cliente/nuevo-cliente");
});

//POST /clientes/add
router.post("/clientes/add", isAuthenticated, (req, res) => {
    //Valores enviados por el cliente.
  const { identificacion } = req.body;
  var error = [];
  if (identificacion.length == 0) {
    error.push({ text: "Por favor ingrese el campo identificacion" });
  }
  //Se cumple la condición: que existan errores
  if (error.length > 0) {
    res.render("cliente/nuevo-cliente", {
      error,
      identificacion,
    });
  } else {
    const foto_cliente = req.files.foto_cliente[0].filename;
    const certificado = req.files.certificado[0].filename;
    const nuevo_cliente = new cliente({
      identificacion,
      foto_cliente,
      certificado,
    });
    nuevo_cliente.save();

    //Mandarlo como mensaje informativo en la vista !!
    console.log("Cliente agregado");
    //const mensaje = "Usuario creado con exito";
    res.render("cliente/nuevo-cliente", {
      text: "Usuario creado con exito",
    });
  }
});

//GET /clientes/:identificacion
router.get("/clientes/:identificacion", isAuthenticated, (req, res) => {
    //Obtiene el parametro llamado 'identificacion'.
  const identificacion = req.params.identificacion;
  //Encuentra un cliente que sea tenga la identificación enviada por el usuario
  cliente
    .findOne({ identificacion: identificacion }, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.render("cliente/perfil-cliente", { result });
      }
    })
    .lean();
});

//Se exporta el router que contiene las instrucciones para las rutas.
//Se utilizará por el router principal de express.
module.exports = router;
