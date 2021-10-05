const mongoose = require('mongoose');


//Conexión con el cluster web alojado en Microsoft Azure - virginia
//mongoose.connect('mongodb+srv://tur-admin:p77BGDSrzyRNWmhx@cluster0.h5031.mongodb.net/db-cucuta?retryWrites=true&w=majority');

//Conexión con la base de datos local
 mongoose.connect('mongodb://localhost:27017/tur-db');


//Crear documento en la DB
const empleado = mongoose.model('empleado', { nombre: String, cedula:String, telefono: String, eps:String });

