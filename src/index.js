//Importando el modulo express 
const express = require('express');


//const exphbs = require('express-handlebars');
//Se usa hbs en vez de express-handlebars por su facilidad de implementación.
const hbs = require('hbs');

const path = require('path');
const methodOverride = require('method-override');

//??
const session = require('express-session');
//  !!!! BUG !!!
const flash = require('connect-flash');
const exphbs = require('express-handlebars');
const { on } = require('events');

//??
const passport = require('passport');

//Permite subir archivos
const multer = require('multer');

const mimeTypes = require('mime-types');

//Generador de uuids

const { v4: uuidv4 } = require('uuid');


//********************         Inicializacioness                ********************************
const app = express();
require('./database');
require('./config/passport');



//*******************                 Settings                 ***********************************
app.set('port',process.env.PORT || 3000);


//Especificamos como deberan ser llamados nuestros archivos de las vistas y utilizar el motor de plantillas
//Express Handlebars
//main.hbs marco que se utilizará como plantilla
//LayoutsDir se utiliza para definir la ubicación del main.hbs
//partialsDir contiene la ubicación del fichero que contiene todos los diseños reutilizables.
//extname define el nombre de la extensión que utilizaremos, aunque ya está definido en el .engine()

// app.engine('handlebars',exphbs({
//     extname:'.hbs'
// }));

   

//Define a .hbs como motor de vistas para utilizarlos.
//app.set('view engine', '.hbs'); 

app.set('view engine', 'hbs');  

//El __dirname solucina error de ubicación de views.
app.set('views',path.join(__dirname, 'views'));
app.set('routes',path.join(__dirname,'routes'));
app.set('public',path.join(__dirname,'public'));

app.engine('hbs',exphbs({
    defaultLayout:'main',
    layoutsDir:path.join(app.get('views'),'layouts'),
    extname: '.hbs'
}))

/**
 * Configuración de la carga de archivos
 */






//*********************           Middlewares                **********************************

//urlenconded sirve para que cuando un formulario quiera enviar datos se pueda entender.
//Solo quiero los datos.
app.use(express.urlencoded({extended:false}));

//method overrride permite que los formularios envien tambien put y delete. No solo get y post.
app.use(methodOverride('_method'));

app.use(session({
    secret:'mySecretApp',
    resave:true,
    saveUninitialized:true
}))


//************ storage zone *******************/


// // const storage2 = multer.diskStorage({
    
// //     destination: function(req, file, cb){
// //         console.log("FIELDNAME: "+file.fieldname);
// //         if(file.fieldname === "soat"){
            
// //              cb(null,path.join(__dirname,'/public/uploads/soat'))
// //             // cb(null,'./src/public/uploads/soat')
// //         }
// //         else if(file.fieldname === "gases"){
// //              cb(null,path.join(__dirname,'/public/uploads/gases'))
// //             // cb(null,path.join('./src/public/uploads/soat'))
// //         }
// //     },
// //     filename: function(req,file,cb){
// //         console.log("FILENAME: "+file.originalname);
// //         var placa = req.body.placa;
// //         if(file.fieldname === "soat"){
            
            
// //             cb(null,file.fieldname+"_"+placa+"_"+uuidv4()+"."+mimeTypes.extension(file.mimetype));
// //         }
// //         else if(file.fieldname === "gases"){
// //             cb(null,file.fieldname+"_"+placa+"_"+uuidv4()+"."+mimeTypes.extension(file.mimetype));
// //         }
// //         // cb(null,file.originalname);
// //     }
// // })

const storage = multer.diskStorage({
    
    destination: function(req, file, cb){
        console.log("FIELDNAME: "+file.fieldname);
        if(file.fieldname === "foto_perfil"){
            cb(null, path.join(__dirname,'/public/uploads/foto_perfil'))
        }
        else if(file.fieldname === "certificado"){
            cb(null, path.join(__dirname,'/public/uploads/certificados'))
        }
        else if(file.fieldname === "soat"){
            
             cb(null,path.join(__dirname,'/public/uploads/soat'))
                         // cb(null,'./src/public/uploads/soat')
                     }
        else if(file.fieldname === "gases"){
                          cb(null,path.join(__dirname,'/public/uploads/gases'))
                         // cb(null,path.join('./src/public/uploads/soat'))
            }
        else if(file.fieldname === "foto_cliente"){
            
             cb(null,path.join(__dirname,'/public/uploads/foto_clientes'))
            // cb(null,'./src/public/uploads/soat')
        }
        else if(file.fieldname === "certificado"){
             cb(null,path.join(__dirname,'/public/uploads/certificados'))
            // cb(null,path.join('./src/public/uploads/soat'))
        }
    },
    filename: function(req,file,cb){
        console.log("FILENAME: "+file.originalname);
        
        var id = req.body.identificacion;

        var placa = req.body.placa;
        if(file.fieldname === "foto_perfil"){
            cb(null,file.fieldname+"_"+id+"_"+uuidv4()+"."+mimeTypes.extension(file.mimetype));
        }
        else if(file.fieldname === "soat"){
            cb(null,file.fieldname+"_"+placa+"_"+uuidv4()+"."+mimeTypes.extension(file.mimetype));
        }
        else if(file.fieldname === "gases"){
            cb(null,file.fieldname+"_"+placa+"_"+uuidv4()+"."+mimeTypes.extension(file.mimetype));
        }
        else if(file.fieldname === "foto_cliente"){
            cb(null,file.fieldname+"_"+id+"_"+uuidv4()+"."+mimeTypes.extension(file.mimetype));
        }
        else if(file.fieldname === "certificado"){
            cb(null,file.fieldname+"_"+id+"_"+uuidv4()+"."+mimeTypes.extension(file.mimetype));
        }
        // cb(null,file.originalname);
    }
})



// app.use(
//     multer({
//         storage,
//         dest:path.join(path.join(__dirname,'/public/uploads'+identificacion_usuario),identificacion_usuario)
//     }).single('foto_perfil')
// );

// app.use(
//     multer({
//         storage:storage2,
        
//     }).fields([
//         {name: "soat", maxCount:1},
//         {name: "gases", maxCount:1}
        
//     ])
// );

app.use(
    multer(
        {
            storage:storage
        }
    ).fields([
        {name:"foto_perfil"},
        {name:"soat"},
        {name:"gases"},
        {name:"foto_cliente"},
        {name:"certificado"}
    ]
        
    )
)

//Utilización del upload por la aplicación


app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//*************************              Global variables                  ***********
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;

    next();
})
//*************************              Routes            ****************************************
 //Le haremos saber al servidor donde están las rutas del servidor mismo.

app.use(require('./routes/home'));
app.use(require('./routes/users'));
app.use(require('./routes/vehiculos'));
app.use(require('./routes/clientes'))





//************************              Static Files                  **************************

app.use(express.static(app.get('public')));

//************************              Server is Listening           ***************************

//Probando que el servidor esté escuchando en el puerto 3000
app.listen(app.get('port'),()=>{
    console.log(`Escuchando en el puerto ${app.get('port')}`);
})




