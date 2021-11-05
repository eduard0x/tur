console.log("Log: Colección vehiculo enlazada");
const moongose = require("mongoose");
const { Schema } = moongose;

const VehiculoSchema = new Schema({
  placa: { type: String, required: true },
  marca: { type: String },
  linea: { type: String },
  modelo: { type: String },
  color: { type: String },
  tipo_vehiculo: { type: String },
  tipo_medicion: { type: String },
  tipo_trabajo: { type: String },
  combustible_principal: { type: String },
  combustible_secundario: { type: String },
  archivos: [
    {
      nombre: { type: String },
      nombre_entidad: { type: String },
      fecha_emision: { type: String },
      fecha_vencimiento: { type: String },
      path: { type: String }, //nombre del archivo que se utilizará para luego encontrarlo en su respectiva carpeta
    },
  ],
  id_auxiliar:{type:String},
  imei_gps:{type:String},
  vin:{type:String},
  propietario:{type:String},
  motor:{type:String},
  numero_motor:{type:String},
  numero_chasis:{type:String},
  numero_serie:{type:String},
  tipo_carroceria:{type:String},
  cantidad_sillas:{type:String},
  toneladas_carga:{type:String},
  cod_fasecolda:{type:String},
  tipo_servicio:{type:String},
  fecha_compra:{type:String},
  odometro_compra:{type:String},
  precio_compra:{type:String},
  precio_accesorios:{type:String},
  vendedor_agencia:{type:String},
  nro_dec_importacion:{type:String},
  fecha_dec_importacion:{type:String},

  fotos:[
    {nombre:{type:String}}
  ]
});

//Exportación del modelo con combre Vehiculo
module.exports = moongose.model("Vehiculo", VehiculoSchema);
