var express = require('express'),
    nunjucks  = require('nunjucks'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    dotenv = require('dotenv').config(),
    Routes = require("./routes"), routes,
    Models = require("./models"),
    app = express();


// Create the asset paths
app.set('assets_path', (process.env.NODE_ENV === 'production') ? 'dist' : 'build');
app.set('views', path.join(__dirname, app.get('assets_path') + '/views'));

// Middleware & the like to make our lives easier
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, app.get('assets_path'))));

// Nunjucks Initialization
nunjucks.configure(app.get('views'), {
    autoescape: true,
    noCache: true,
    watch: true,
    express: app
});

// Initialize Routes From index.js
models = new Models();
routes = new Routes(models);

/* -- Page Routes -- */
app.get('/', routes.pages.index);

/* -- Api Routes -- */
app.get('/api', routes.api.index);

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

// Start our server
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
    console.log('Server started on port', app.get('port'));
});

module.exports = app;
