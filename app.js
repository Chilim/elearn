const express = require('express');
const mongoose = require('mongoose');
const exphbs  = require('express-handlebars');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const expressValidator = require('express-validator');


const app = express();

mongoose.connect('mongodb://localhost/elearn');
const db = mongoose.connection;
db.once('open', () => console.log('MongoDB connected ...'));
db.on('error', (err) => console.log(err));

// Set Port
const PORT = process.env.PORT || 5000;

// View Engine Setup
app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');

// Set public folder
app.use(express.static(__dirname + '/public'));

// Parse Application
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// Express Validator Middleware
app.use(express.json());
app.use(expressValidator());

// Express Session Middleware
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Passport
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
app.use(flash());

// Makes the user object global in all views
app.get('*', function(req, res, next) {
    // put user into res.locals for easy access from templates
    res.locals.user = req.user || null;
    if(req.user){
      res.locals.type = req.user.type;
    }
    next();
  });

//Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routering
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/classes', require('./routes/classes'));
app.use('/students', require('./routes/students'));
app.use('/instructors', require('./routes/instructors'));

// Start Server
app.listen(PORT, console.log(`Server is running on port ${PORT}`));

module.exports.app;