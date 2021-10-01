//Importando el modulo express 
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');

//********************         Inicializacioness                ********************************
const app = express();
require('./database');

app.use(express.static('public'));

//*******************                 Settings                 ***********************************
app.set('port',process.env.PORT || 3000);


   

//El __dirname solucina error de ubicación de views.
app.set('views', __dirname + '/views');

//Especificamos como deberan ser llamados nuestros archivos de las vistas y utilizar el motor de plantillas
//Express Handlebars
//main.hbs marco que se utilizará como plantilla
//LayoutsDir se utiliza para definir la ubicación del main.hbs
//partialsDir contiene la ubicación del fichero que contiene todos los diseños reutilizables.
//extname define el nombre de la extensión que utilizaremos, aunque ya está definido en el .engine()

app.engine(".hbs",exphbs({
    defaultLayout:'main',
    layoutsDir:path.join(app.get('views'),'layouts'),
    //partialsDir:path.join(app.get('views','partials')), // ***  ERROR   ***
    extname:'.hbs'
}))

//Define a .hbs como motor de vistas para utilizarlos.
app.set('view engine', '.hbs'); 
    
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

app.use(require('./routes/index'));
app.use(require('./routes/users'));

//************************              Static Files                  **************************

app.use(express.static(path.join(__dirname,'public')));
//************************              Server is Listening           ***************************

//Probando que el servidor esté escuchando en el puerto 3000
app.listen(app.get('port'),()=>{
    console.log(`Escuchando en el puerto ${app.get('port')}`);
})

