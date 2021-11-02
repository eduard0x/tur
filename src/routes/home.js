const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../helpers/auth");

//Qué hacer cuando se visite la pagina principal


//GET / 
//Nota: No se utiliza el isAuthenticated porque justo acá el usuario ingresará sus credenciales para hacerlo lol.
router.get("/", (req, res) => {
  //Renderiza la pagina de login,
  res.render("usuario/iniciar", { layout: false });
});

//Se exporta el router que contiene las instrucciones para las rutas.
//Se utilizará por el router principal de express.
module.exports = router;
