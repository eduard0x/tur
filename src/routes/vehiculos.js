const express = require('express');
const router = express.Router();
const usuario = require('../models/usuario');
const { isAuthenticated } = require('../helpers/auth');

router.get('/vehiculos',isAuthenticated,(req, res)=>{
    //res.send('Usuarios');
    res.render('usuarios.hbs');
})

router.get('/vehiculos/nuevo',isAuthenticated,(req,res)=>{
    console.log(req.body);
    res.render('vehiculo/nuevo-vehiculo');
})

router.post('/vehiculos/add',isAuthenticated,(req,res)=>{
    const placa = req.body.placa;
    const files = req.files;
   
    console.log(placa);
    console.log(files);
    
    
    
})


module.exports = router;