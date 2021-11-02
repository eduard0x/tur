console.log("Log: modulo passport");
//Dependencias
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const usuario = require('../models/usuario'); 


passport.use(
  new LocalStrategy(
    {
      usernameField: "correo",
    },
    async (correo, password, done) => {
      console.log("Log: Verificación de correo"); //flag
      // Match Email's User
      const user = await usuario.findOne({ correo: correo });
      console.log(user); //flag
      if (!user) {
        console.log("Log: Identidad invalida");
        //null significa que no hay errores, false significa que no se encontraron resultados y
        //Adicionalmente está message para enviar una respuesta
        return done(null, false, { message: "Usuario no encontrado." });
      } else {
        console.log("Log: Verificación de contraseña");
        // 
        var match = await user.match(password);

        if (match) {
          console.log("Log: Usuario loggeado");
          return done(null, user);
        } else {
          console.log("Log: Contraseña invalida");
          return done(null, false, { message: "Contraseña incorrecta" });
        }
      }
    }
  )
);

/**
 * Take an user and a callback. At moment that user is authenticated will take the
 * user id like a session.
 */
/**
 * Toma un usuario y un callback . Al momento que el usuario se autentique tomaremos el id
    del usuario como una sesión*/
passport.serializeUser((user, done) => {
  done(null, user.id);
});

/**
 * Search the user with the id for deserialize it and utilize their data.
 */
/**
 * Busco el usuario con el id para deserializarlo y utilizar sus datos
 */
passport.deserializeUser((id, done) => {
  console.log("Log: deserialize User");
  usuario
    .findById(id, (err, user) => {
      done(err, user);
      console.log("Log: user: " + user);
      console.log("Log: error: " + err);
    })
    .lean();
});