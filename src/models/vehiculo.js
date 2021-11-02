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
  fotos:[
    {nombre:{type:String}}
  ]
});

//Exportación del modelo con combre Vehiculo
module.exports = moongose.model("Vehiculo", VehiculoSchema);
