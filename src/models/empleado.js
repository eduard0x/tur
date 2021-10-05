
const mongoose = require('mongoose');


//insertar registro en la DB


 const eduardo = new empleado(
     {   nombre: 'Eduardo Fuentes', 
         cedula:'1026303001', 
         telefono:'3204728847',
         eps:'nueva eps' });
 eduardo.save().then(() => console.log('El empleado ha sido creado en la DB.'));

