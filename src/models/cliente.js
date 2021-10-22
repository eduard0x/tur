const mongoose = require('mongoose');
const {Schema} = mongoose;

const ClienteSchema = new Schema({
    identificacion:{type:String, required:true},
    foto_cliente:{type:String},
    certificado:{type:String}
})


module.exports = mongoose.model('Cliente',ClienteSchema);