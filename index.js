const express = require("express")
const app = express()
const session = require('express-session');
const bodyParser = require("body-parser")
const passport = require("passport")
const passportFb = require('passport-facebook').Strategy
const LocalStrategy = require("passport-local").Strategy

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
app.use(passport.initialize())
app.use(passport.session())
app.get('/index',(req,res)=> {
    res.send("Login Success")
})

app.get('/private',(req,res)=>{
    if(req.isAuthenticated()){
        res.send("Hello " + req.user.name + "<br> <a href=\"/logout\">Logout</a>")
    }else{
        res.send("Ban phai dang nhap <br> <a href=\"/\">login page</a>")
    }
})

app.route('/')
.get((req,res)=> res.render("login"))
.post(passport.authenticate('local',{failureRedirect: "/",
                                    successRedirect: "/private"}))

// Passport local
passport.use(new LocalStrategy(
    (username,password,done)=> {
        check = new User()
        User.findOne({'name':username},function(err,user){
            if(user && check.validPassword(password,user.password)){
                return done(null,user)

            }else{
                return done(null,false)
            }
        })
    }
))

// Passport facebook
app.get('/auth/facebook', passport.authenticate('facebook'))

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/private',
    failureRedirect: '/login'
}))

passport.use(new passportFb(
    {
        clientID: "836493403178355",
        clientSecret: "a25a84f5e8a58966f308d16dd34df1ba",
        callbackURL: "http://localhost:3000/auth/facebook/callback",
        profileFields: ['id', 'emails', 'displayName', 'photos']
    },
    (accessToken, refreshToken, profile, done) => {
        
        var json = profile._json
        console.log(json)
        User.findOne({ id: json.id }, (err, user) => {
            if (err) {
                return done(err)
            } else if (user) {
                return done(null, user)
            } else {
                var newUser = new User({
                    id: json.id,
                    name: json.name,
                    email: json.email,          
                })
                newUser.save((err) => {
                    return done(null, newUser)
                })
            }
        })
    }
))

passport.serializeUser((user,done)=>{
    done(null,user._id)
})

passport.deserializeUser((id,done)=>{
    User.findById(id,function(err,user){
        if(user){
            return done(null,user)
        }else{
            return done(null,false)
        }
    })
})

const port = 3000;
app.listen(port,() => console.log("server running: http://localhost:3000"))

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });