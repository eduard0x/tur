console.log("Log: Colección vehiculo enlazada");
const moongose = require('mongoose');
const {Schema} = moongose;

const VehiculoSchema = new Schema({

    placa:{type:String, required:true},
    km:{type:String},
    marca:{type:String},
    linea:{type:String},
    categoria:{type:String},
    centro_costos:{type:String},
    ciudad:{type:String},
    archivos:[{
        nombre:{type:String},
        nombre_entidad:{type:String},
        fecha_emision:{type:String},
        fecha_vencimiento:{type:String},
        path:{type:String}
    }]

    
});

module.exports = moongose.model('Vehiculo',VehiculoSchema);