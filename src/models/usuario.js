const moongose = require('mongoose');
const {Schema} = moongose;
const bcrypt = require('bcryptjs');

console.log("Log: Colección usuario enlazada");

//Esquema de la colección usuario
const UsuarioSchema = new Schema({
    identificacion: {type: String, required:true},
    nombre: {type: String, required:true},
    apellido: {type: String, required:true},
    cargo: {type: String, required:true},
    correo: {type: String, required:true},
    telefono: {type: String, required:true},
    eps: {type:String, required:false},
    fecha_ingreso: {type: String, required:true},
    password:{type:String, required:true}
    

    //tipo de documento
    //direccion
    //datos de de emergencia
    //profesion
    //cuenta bancaria
    //nombre de los bancos
    //ahorro o corriente
    //fondo de pensiones
    //Educación; con fecha de vencimiento de los cursos y certificados.

});

    UsuarioSchema.methods.encryptPassword = async (password) => {
        console.log("Log: Encriptando contraseña")
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password,salt);

        //start debug
        console.log("HASH GENERADO A PARTIR DE LA CONTRASEÑA")
        console.log(hash);
        // end debugs
        return hash;
    }

    UsuarioSchema.methods.match = async function(password){
        console.log("Log: Verificación de contraseña")
        //Se compara el string -> password con el hash --> this.password. Se debe respetar el orden string-hash
        const coincidencia = await bcrypt.compare(password, this.password);
        return coincidencia;
    }
module.exports = moongose.model('Usuario',UsuarioSchema);