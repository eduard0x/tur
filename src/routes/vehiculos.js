const express = require("express");
const router = express.Router();
const vehiculo = require("../models/vehiculo");
const { isAuthenticated } = require("../helpers/auth");

//GET /vehiculos
router.get("/vehiculos", isAuthenticated, (req, res) => {
  console.log("Log: GET /vehiculos");

  //Encuentra la lista de vehiculos almacenados en la BD Mongo.
  vehiculo
    .find({}, function (err, result) {
      //El titulo de la tabla es un argumento que recibe la vista vehiculos.hbs para mostrar los vehiculos con un filtro aplicado.
      const titulo_tabla = "Vehiculos";
      var vehiculos_encontrados = [];
      if (err) {
        console.log(err);
      } else {
        //Iteración de la lista de vehiculos para asignalos en una lista
        for (var i in result) {
          vehiculos_encontrados.push(result[i]);
        }

        //Se redirige al usuario a la vista vehiculos donde mostrará los vehiculos almacenados en la BD Mongo.
        res.render("vehiculos", { vehiculos_encontrados, titulo_tabla });
      }
    })
    .lean(); //lean permite solucionar el error de la no carga de los valores
});

//GET /vehiculos/vencidos
router.get("/vehiculos/vencidos", isAuthenticated, (req, res) => {
  //Encuentra la lista de vehiculos almacenados en la base de datos.
  //Find the stored car list of the database.
  vehiculo
    .find({}, function (err, result) {
      const titulo_tabla = "Vehiculos vencidos";
      console.log(result);
      var vehiculos_encontrados = [];
      if (err) {
        console.log(err);
      } else {
        result.forEach((v) => {
          var estaVencido = false;
          v.archivos.forEach((archivo) => {
            var fecha_vencimiento = archivo.fecha_vencimiento;

            //Las fechas se setean para que no incluyan los minutos, segundos y milisegundos.
            const fecha = new Date(fecha_vencimiento).setHours(0, 0, 0, 0);
            const hoy = new Date(Date.now()).setHours(0, 0, 0, 0);
            //Si al menos un archivo del vehiculo es vencido pasa a la lista de vencidos
            //Si ya hay un archivo vencido del vehiculo, no es necesidad de chequear los otros archivos lol
            if (hoy >= fecha && estaVencido == false) {
              vehiculos_encontrados.push(v);
              console.log("Hay un papel vencido");
              estaVencido = true;
            }
          });
        });
        //Renderizar la pagina vehiculos enviando como parametros la lista de vehiculos y el titulo de la tabla
        res.render("vehiculos", { vehiculos_encontrados, titulo_tabla });
      }
    })
    .lean();
});

//GET /vehiculos/nuevo : Este metodo necesita ser implementado después de verificar la existencia
//de la placa. en GET /vehiculos/verificar
router.get("/vehiculos/nuevo", isAuthenticated, (req, res) => {
  console.log(req.body);
  res.render("vehiculo/nuevo-vehiculo");
});

//GET /vehiculos/verificar
router.get("/vehiculos/verificar", isAuthenticated, (req, res) => {
  console.log(req.body);
  res.render("vehiculo/verificacion");
});

//POST /vehiculos/verificar
router.post("/vehiculos/verificar", isAuthenticated, async (req, res) => {
  //placa que se desea verificar
  const placa = req.body.placa;

  //Retorna true si existe un vehiculo registrado con la placa ingresada.
  const existencia = await vehiculo.exists({ placa: placa });

  //Si existe vuelve a la pagina de verificación con un mensaje manifestando que
  //existe una placa ya registrada.
  //Si no existe va la pagina que contiene el formulario nuevo-vehiculo
  //Se adjunta la placa para llenar el campo por defecto.
  if (existencia) {
    res.render("vehiculo/verificacion", { existencia });
  } else {
    res.render("vehiculo/nuevo-vehiculo", { placa });
  }
});

//GET /vehiculos/add
router.post("/vehiculos/add", isAuthenticated, async (req, res) => {
  console.log(req.files);
    //Obteniendo los valores enviados desde el formulario de nuevo-vehiculo
    //Estos valores son iniciales, los datos de los vehiculos son muchos más.
    const {
    placa,
    marca,
    linea,
    modelo,
    gases_entidad,
    color,
    tipo_vehiculo,
    tipo_medicion,
    tipo_trabajo,
    combustible_principal,
    combustible_secundario,
    soat_entidad,
    soat_fecha_emision,
    soat_fecha_vencimiento,
    gases_fecha_emision,
    gases_fecha_vencimiento,
  } = req.body;

  var error = [];
  //La placa es obligatoria
  if (placa.length > 0) {
    error.push({ text: "Debe ingresar la placa" });
  }

  //Envia error si dejamos el campo placa vacio.
  if (error.length == 0) {
    res.render("vehiculo/nuevo-vehiculo", {
      error,
      placa,
    });
  } else {
    //Obteniendo el nombre del archivo soat y 
   
    //Almacen de los archivos del vehiculo
    var archivos = [];
   ;
   //soat organizado
    const soat = {
      nombre: "soat",
      nombre_entidad: soat_entidad,
      fecha_emision: soat_fecha_emision,
      fecha_vencimiento: soat_fecha_vencimiento,
      path: req.files.soat[0].filename,
    };

    //gases organizado
    const gases = {
      nombre: "gases",
      nombre_entidad: gases_entidad,
      fecha_emision: gases_fecha_emision,
      fecha_vencimiento: gases_fecha_vencimiento,
      path: req.files.gases[0].filename,
    };

    //Agregando los archivos soat y gases a la lista de archivos del vehiculo
    archivos.push(soat);
    archivos.push(gases);

    //Estableciendo el vehiculo que será agregado a la BD Mongo
    const nuevo_vehiculo = new vehiculo({
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
      archivos,
    });

    //Agregando el vehiculo a la BD Mongo
    await nuevo_vehiculo.save();
    const mensaje = "Vehiculo agregado con exito";
    //Ir a la pagina del formulario del nuevo vehiculo con el mensaje de exito
    res.render("vehiculo/nuevo-vehiculo", { mensaje });
  }
});
//Permite organizar toda la información respecto al vehiculo para
//mostrarla en el perfil del vehiculo
//Arg: placa - Placa del vehiculo del que deseamos obtener la información.
//Arg: callback - Función que será ejecutada al obtener la información organizada.
function formatearInformacion(placa, callback) {
  vehiculo
    .findOne({ placa }, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);

        /**
         * Fechas por defecto si no encontramos información de los archivos soat y gases
         */
        var fecha_emision_soat = "2021/01/01";
        var fecha_vencimiento_soat = "2021/01/01";
        var fecha_vencimiento_gases = "2021/01/01";
        var fecha_emision_gases = "2021/01/01";
        var entidad_soat = "Ninguna";
        var entidad_gases = "Ninguna";
        var path_soat = "#";
        var path_gases = "#";

        for (let i = 0; i < result.archivos.length; i++) {
          var fecha_emision = result.archivos[i].fecha_emision;
          var fecha_vencimiento = result.archivos[i].fecha_vencimiento;
          var nombre_entidad = result.archivos[i].nombre_entidad;
          console.log(nombre_entidad);
          var path = result.archivos[i].path;
          if (result.archivos[i].nombre == "soat") {
            fecha_emision_soat = fecha_emision;
            fecha_vencimiento_soat = fecha_vencimiento;
            entidad_soat = nombre_entidad;
            path_soat = path;
          } else if (result.archivos[i].nombre == "gases") {
            fecha_emision_gases = fecha_emision;
            fecha_vencimiento_gases = fecha_vencimiento;
            entidad_gases = nombre_entidad;
            path_gases = path;
          }
        }

        //Obtención de los archivos presentes en la información del vehiculo
        var archivos = result.archivos;

        //Organización del archivo soat
        const soat = {
          nombre: "soat",
          nombre_entidad: entidad_soat,
          fecha_emision: fecha_emision_soat,
          fecha_vencimiento: fecha_vencimiento_soat,
          path: path_soat,
        };

        //Organización del archivo gases
        const gases = {
          nombre: "gases",
          nombre_entidad: entidad_gases,
          fecha_emision: fecha_emision_gases,
          fecha_vencimiento: fecha_vencimiento_gases,
          path: path_gases,
        };

        //Agregación de los archivos soat y gases a la lista de archivos.
        archivos.push(soat);
        archivos.push(gases);

        /**
         * Fotos
         */
        var fotos = result.fotos;
        
        //Información del vehiculo organizada
        var result = {
          placa,
          marca: result.marca,
          linea: result.linea,
          modelo: result.modelo,
          color: result.color,
          tipo_vehiculo: result.tipo_vehiculo,
          tipo_medicion: result.tipo_medicion,
          tipo_trabajo: result.tipo_trabajo,
          combustible_principal: result.combustible_principal,
          combustible_secundario: result.combustible_secundario,
          fecha_emision_soat,
          fecha_vencimiento_soat,
          fecha_vencimiento_gases,
          fecha_emision_gases,
          entidad_soat,
          entidad_gases,
          path_soat,
          path_gases,
          id_auxiliar:result.id_auxiliar,
          imei_gps:result.imei_gps,
          vin:result.vin,
          propietario:result.propietario,
          motor:result.motor,
          numero_motor:result.numero_motor,
          numero_chasis:result.numero_chasis,
          numero_serie:result.numero_serie,
          tipo_carroceria:result.tipo_carroceria,
          cantidad_sillas:result.cantidad_sillas,
          toneladas_carga:result.toneladas_carga,
          cod_fasecolda:result.cod_fasecolda,
          tipo_servicio:result.tipo_servicio,
          fecha_compra:result.fecha_compra,
          odometro_compra:result.odometro_compra,
          precio_compra:result.precio_compra,
          precio_accesorios:result.precio_accesorios,
          vendedor_agencia:result.vendedor_agencia,
          nro_dec_importacion:result.nro_dec_importacion,
          fecha_dec_importacion:result.fecha_dec_importacion,
          fotos
        };
        
        //Pasando la información del vehiculo a la función.
        callback(result);
      }
    })
    .lean();
}

/**
 * Encuentra el vehiculo al que corresponde una placa y pasa
 * la información del vehiculo al callback
 * */ 
function encontrarVehiculo(placa,callback) {
  vehiculo
    .findOne({ placa }, (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result) {
        callback(result);
      }
      
    })
    .lean();
}

//POST /vehiculos/modificar
/**
 * Recibe la información modificada del vehiculo y la actualiza en la base de datos.
 * Cuando está actualizado, vuelve al perfil mostrando la información actulizada.
 */
router.post("/vehiculos/modificar", isAuthenticated, (req, res) => {
  console.log("Log: POST /vehiculos/modificar");
  const {
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
    soat_entidad,
    soat_fecha_emision,
    soat_fecha_vencimiento,
    gases_entidad,
    gases_fecha_emision,
    gases_fecha_vencimiento,
    id_auxiliar,
    imei_gps,
    vin,
    propietario,
    motor,
    numero_motor,
    numero_chasis,
    numero_serie,
    tipo_carroceria,
    cantidad_sillas,
    toneladas_carga,
    cod_fasecolda,
    tipo_servicio,
    fecha_compra,
    odometro_compra,
    precio_compra,
    precio_accesorios,
    vendedor_agencia,
    nro_dec_importacion,
    fecha_dec_importacion,
  } = req.body;

    //Falta que se pueda añadir a archivos los archivos existentes
    //Igual que con las fotos: Se debe definir un algoritmo para esto.
  var archivos = [];
  
  //El path es vacio temporalmente hasta habilitar la opción de actualizar los archivos.
  var path = ""
  
  //Soat ordenado para modificar
  const soat = {
    nombre: "soat",
    nombre_entidad: soat_entidad,
    fecha_emision: soat_fecha_emision,
    fecha_vencimiento: soat_fecha_vencimiento,
    path
  };

  //Gases ordenado para modificar
  const gases = {
    nombre: "gases",
    nombre_entidad: gases_entidad,
    fecha_emision: gases_fecha_emision,
    fecha_vencimiento: gases_fecha_vencimiento,
    path
  };

  //Añadir soat y gases a los archivos del vehiculo
  archivos.push(soat);
  archivos.push(gases);

  //Encontrar vehiculo por su placa y actualizar la lista de fotos
  encontrarVehiculo(placa,function(result){
    var fotos = result.fotos;
    if(!(req.files.foto_vehiculo == undefined)){
        var nombre_foto = req.files.foto_vehiculo[0].filename;
        console.log("nombre_foto");
        console.log(nombre_foto);
        var nueva_foto = { nombre: nombre_foto };

        fotos.push(nueva_foto);
    }
    
    
    //Filtro: Carros que tengan esa plata.
    var query = { placa };

    //Update: la información actualizada de los vehiculos.
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
        id_auxiliar,
        imei_gps,
        vin,
        propietario,
        motor,
        numero_motor,
        numero_chasis,
        numero_serie,
        tipo_carroceria,
        cantidad_sillas,
        toneladas_carga,
        cod_fasecolda,
        tipo_servicio,
        fecha_compra,
        odometro_compra,
        precio_compra,
        precio_accesorios,
        vendedor_agencia,
        nro_dec_importacion,
        fecha_dec_importacion,
        fotos
    };

    
    //Actualización
    //Upsert true: Los campos inexistentes serán creados en el documento.
    vehiculo.findOneAndUpdate(query,update,{upsert: true},function(err,doc){
        if (err) return res.send(500,{error:err});
        console.log("Vehiculo actualizado");
        //Organizar la información para mostrarla en el perfil (ya actualizada)
        formatearInformacion(placa,function(result){
            res.render("vehiculo/perfil-vehiculo", { result });
        }); 
    });
        
});

});

//GET /vehiculos/:placa
/**
 * Retorna la información del usuario por su placa.
 */
router.get("/vehiculos/:placa", isAuthenticated, async(req, res) => {
  console.log("Log: GET /vehiculos/placa");
  const placa_vehiculo = req.params.placa;

  const result = formatearInformacion(placa_vehiculo,(result)=>{
    console.log("inicio");
    //result: contiene la información lista para mostrar en el perfil del vehiculo
    console.log(result);
    console.log("fin");
    res.render("vehiculo/perfil-vehiculo", { result });
  });
  
});

//GET /vehiculos/eliminar/:placa
/**
 * Eliminar el vehiculo de acuerdo a una determinada placa.
 * Cuando es eliminado vuelve a la pagina de los vehiculos, sin el vehiculo que obviamente ya no existe.
 */
router.get("/vehiculos/eliminar/:placa",isAuthenticated, (req, res)=>{
    console.log("Log: GET /vehiculos/eliminar/:placa");

    const placa_vehiculo = req.params.placa;
    const filtro = {placa:placa_vehiculo};

    vehiculo.findOneAndDelete(filtro,(err, result)=>{
        res.redirect('/vehiculos');
    })
})

//Exporta el router para ser usado por index.js
module.exports = router;
