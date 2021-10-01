//Importamos express en el index para generar las rutas

const express = require('express');
const router = express.Router();

//Qué hacer cuando se visite la pagina principal
router.get('/',(req, res)=>{
    res.send("Está es la pagina principal de mi aplicación");
})

module.exports = router;