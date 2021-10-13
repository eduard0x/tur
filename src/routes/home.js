//Importamos express en el index para generar las rutas

const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../helpers/auth');
//Qué hacer cuando se visite la pagina principal
router.get('/',(req, res)=>{
    // res.send('inicio');
     res.render('usuario/iniciar',{layout:false});
})








module.exports = router;