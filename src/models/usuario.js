const moongose = require('mongoose');
const {Schema} = moongose;
const bcrypt = require('bcryptjs');

console.log("Log: Colección usuario enlazada");

//Esquema de la colección usuario
const UsuarioSchema = new Schema({
    tipo:{type:String, required:true},//Tipo de documento: TI, CC, CE
    identificacion: {type: String, required:true}, //Número de identificación
    nombre: {type: String, required:true},
    apellido: {type: String, required:true},
    cargo: {type: String, required:true},
    profesion: {type: String, required:true},
    direccion: {type: String, required:true},
    correo: {type: String, required:true},
    telefono: {type: String, required:true},
    eps: {type:String, required:false},
    fecha_ingreso: {type: Date, required:true},
    numero_cuenta:{type: String, required:true},
    banco:{type:String, required:true},
    tipo_cuenta: {type:String, required:true}, //Cuenta de ahorro o corriente
    pension: {type:String, required:true},
    foto_perfil:{type:String,required:true}, //Nombre del archivo que servirá para luego buscarlo en su respectiva carpeta
    certificado:{type:String,required:true},
    password:{type:String, required:true} // Password cifrado con bcrypt
    
});

    UsuarioSchema.methods.encryptPassword = async (password) => {
        console.log("Log: Encriptando contraseña")
        const salt = await bcrypt.genSalt(10);
        //Hash generado a partir de la contrasena
        const hash = await bcrypt.hash(password,salt);

        return hash;
    }

    UsuarioSchema.methods.match = async function(password){
        console.log("Log: Verificación de contraseña")
        //Se compara el string -> password con el hash --> this.password. Se debe respetar el orden string-hash
        const coincidencia = await bcrypt.compare(password, this.password);
        return coincidencia;
    }
// Exportación del modelo de usuario con nombre Usuario
module.exports = moongose.model('Usuario',UsuarioSchema);