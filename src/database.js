const mongoose = require('mongoose');


//Conexión con el cluster web alojado en Microsoft Azure - virginia
mongoose.connect('mongodb+srv://tur-admin:p77BGDSrzyRNWmhx@cluster0.h5031.mongodb.net/db-cucuta?retryWrites=true&w=majority');

//Conexión con la base de datos local
// mongoose.connect('mongodb://localhost:27017/db-name');

const human = mongoose.model('human', { name: String, age:Number, women: Boolean });

const eduardo = new human({ name: 'Eduardo Fuentes', age:24, women:false });
eduardo.save().then(() => console.log('El humano ha sido creado en la DB.'));



// const Schema = mongoose.Schema;

// const ObjectId = Schema.ObjectId;

// const BlogPost = new Schema(
//     {
//         author: ObjectId,
//         title: String,
//         body: String,
//         date: Date
//     }
// )
