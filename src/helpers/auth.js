
const helpers = {}

helpers.isAuthenticated = (req,res, next)=>{
    if(req.isAuthenticated()){
        console.log(res.user);
        console.log("Log: El usuario está autenticado. ** CONCEDER ACCESO **");
        return next();
    }
    console.log("Log: El usuario requiere autenticación");
    res.redirect('/');
    //res.render('usuario/iniciar',{layout:false});
}

module.exports = helpers;