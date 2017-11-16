const express = require("express")
const app = express()
const session = require('express-session');
const bodyParser = require("body-parser")
// require node_modules


app.use('/js', express.static('./node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static('./node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static('./node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

var User = require('./user')

app.set('views','./views')
app.set('view engine','ejs')

app.use(session({
    secret: 'passport',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended:true}))
// passport initialeze & session

app.get('/index',(req,res)=> {
    res.send("Login Success")
})

app.get('/private',(req,res)=>{
    // chech authentication

})

app.route('/')
.get((req,res)=> res.render("login"))


// Passport local

// Passport facebook

// Passport google

// serializeUser

// deserializeUser


const port = 3000;
app.listen(port,() => console.log("server running: http://localhost:3000/"))