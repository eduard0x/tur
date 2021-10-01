//Importamos express en el index para generar las rutas

const express = require('express');
const router = express.Router();

//Qué hacer cuando se visite la pagina de usuarios
router.get('/usuarios',(req, res)=>{
    //res.send('Usuarios');
    res.render('usuarios.hbs');
})

module.exports = router;