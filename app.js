var express         = require('express'),
    expressValidator = require('express-validator'),
    flash           = require('connect-flash'),
    session         = require('express-session'),
    port            = process.env.PORT || 3000,
    mongoose        = require('mongodb'),
    mongoose        = require('mongoose'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local').Strategy,
    nunjucks        = require('nunjucks'),
    path            = require('path'),
    logger          = require('morgan'),
    cookieParser    = require('cookie-parser'),
    bodyParser      = require('body-parser'),
    dotenv          = require('dotenv').config(),
    Routes          = require("./routes"), routes,
    Models          = require("./models"),
    app             = express();

// Mongoose
mongoose.connect(process.env.MONGO_URI);
var db = mongoose.connection;

// Create the asset paths
app.set('assets_path', (process.env.NODE_ENV === 'production') ? 'dist' : 'build');
app.set('views', path.join(__dirname, app.get('assets_path') + '/views'));


// Middleware & the like to make our lives easier
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set up our Asset Path
app.use(express.static(path.join(__dirname, app.get('assets_path'))));

// Nunjucks Initialization
nunjucks.configure(app.get('views'), {
    autoescape: true,
    noCache: true,
    watch: true,
    express: app
});

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Initialize Passport for Authentication
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Initialize Routes & Models From index.js
//models = new Models();
routes = new Routes();

/* -- Page Routes -- */
app.get('/', routes.pages.index);

/* -- User Routes -- */
app.get('/users', routes.users.index);
app.get('/users/register', routes.users.register);
app.post('/users/register', routes.users.createAccount);

app.get('/users/login', routes.users.login);

app.post('/users/login', passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login', failureFlash: true}), routes.users.authenticate);
app.get('/users/logout', routes.users.logout);

// Passport Config
app.use(passport.initialize());
app.use(passport.session());

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// No stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    if(err.status === 404){
        res.render('404.html');
    } else {
        res.render('500.html');
    }
});

// Start our application
app.listen(port);
console.log('Server running on port ' + port);

module.exports = app;
