const express = require('express');
const mongoose = require('mongoose');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session'); 
const passport = require('passport');

const PORT = process.env.port || 3000;

// Passport Config.
require('./config/passport')(passport);

// app.get('/', (req, res)=>{
//     res.send("Welcome to Express!");
// });

// EJS Layout Engine
app.set('views', path.join(__dirname, 'views'))
app.use(expressLayouts);
app.set('view engine', 'ejs');

// mongDb connection
const db = require('./config/keys').mongoDbURI;

mongoose.connect(db, {
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(()=> console.log('Db connected...'))
.catch(err => console.log(err));

// BodyParser
app.use(express.urlencoded({ extended:true }));

//Express session
app.use(session({
    secret: 'secret cat',
    resave: true,
    saveUninitialized: true
  }))

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global Vars
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/user', require('./routes/user'));

app.listen(PORT, ()=>{
    console.log(`Listen App at port ${PORT}...`)
});