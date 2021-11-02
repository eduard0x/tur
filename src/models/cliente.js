const mongoose = require("mongoose");
const { Schema } = mongoose;

//Esquema de la colección de clientes
const ClienteSchema = new Schema({
  identificacion: { type: String, required: true },
  foto_cliente: { type: String },
  certificado: { type: String },
});

//Exportación del modelo con nombre Cliente
module.exports = mongoose.model("Cliente", ClienteSchema);
