const moongose = require('mongoose');
const {Schema} = moongose;

console.log("model/usuario");
const UsuarioSchema = new Schema({
    identificacion: {type: String, required:true},
    nombre: {type: String, required:true},
    apellido: {type: String, required:true},
    cargo: {type: String, required:true},
    correo: {type: String, required:true},
    telefono: {type: String, required:true},
    eps: {type:String, required:false},
    fecha_ingreso: {type: String, required:true}
});
module.exports = moongose.model('Usuario',UsuarioSchema);