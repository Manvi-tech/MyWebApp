
const express = require('express');
const path = require('path');
const port = 8001;

const db = require('./config/mongoose');
const User = require('./models/user');

//session should be before passport bcoz passport uses session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const customMWare = require('./config/middleware');

const app= express();

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//express session used as middleware to encrypt user info in cookie
app.use(session({
    name:'codeial',
    secret:'abscd',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge: (1000*60*100)
    },
    // mongo store is used to store cookie in DB
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost/socialMedia_db',
        autoRemove:'disabled'
    })
    
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMWare.setFlash);

app.use(express.static('assets'));

app.use('/', require('./routes/index'));

app.listen(port, function(err){
    if(err)console.log(err);
    console.log('server is running on :', port);
});