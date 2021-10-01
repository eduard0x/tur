//Importando el modulo express 
const express = require('express');

//const exphbs = require('express-handlebars');
//Se usa hbs en vez de express-handlebars por su facilidad de implementación.
const hbs = require('hbs');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const exphbs = require('express-handlebars');

//********************         Inicializacioness                ********************************
const app = express();
require('./database');



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

//*************************              Routes            ****************************************
 //Le haremos saber al servidor donde están las rutas del servidor mismo.

app.use(require('./routes/home'));
app.use(require('./routes/users'));

//************************              Static Files                  **************************

app.use(express.static(app.get('public')));

//************************              Server is Listening           ***************************

//Probando que el servidor esté escuchando en el puerto 3000
app.listen(app.get('port'),()=>{
    console.log(`Escuchando en el puerto ${app.get('port')}`);
})

