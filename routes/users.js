var passport        = require('passport'),
    LocalStrategy   = require('passport-local').Strategy,
    User            = require('../models/user');

var UserRoutes = function(){};

UserRoutes.prototype.index = function(req, res) {
    res.render('users/index.html', {
        page: { title: 'Account' },
        user: req.user
    });
}

UserRoutes.prototype.register = function(req, res) {
    if(req.isAuthenticated()){
        req.flash('error_msg', 'You\'re already loggen in!');
        res.redirect('/');
    } else {
        res.render('users/register.html', {
            page: { title: 'Register' },
            path: 'register'
        });
    }
}

UserRoutes.prototype.createAccount = function(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    // Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if(errors){
        res.render('users/register.html', {
            errors: errors
        });
    } else {
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });

        User.createUser(newUser, function(err, user){
            if(err) throw error;
            console.log(user);
        });

        req.flash('success_msg', 'You are now registered & can login!');
        res.redirect('users/login');
    }
}

UserRoutes.prototype.login = function(req, res) {
    if(req.isAuthenticated()){
        req.flash('error_msg', 'You\'re already loggen in!');
        res.redirect('/');
    } else {
        res.render('users/login.html', {
            page: { title: 'Login' },
            path: 'login'
        });
    }
}

passport.use(new LocalStrategy(function(username, password, done) {
    User.getUserByUsername(username, function(err, user){
        if(err) throw err;
        if(!user) {
            return done(null, false, {message: 'Unknown User'});
        }

        User.comparePassword(password, user.password, function(err, isMatch){
            if(err) throw err;
            if(isMatch){
                return done(null, user);
            } else {
                return done(null, false, {message: 'Invalid password'});
            }
        });
    });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

UserRoutes.prototype.authenticate = function(req, res) {
    res.redirect('/');
}

UserRoutes.prototype.logout = function(req, res) {
    req.logout();
    req.flash('success_msg', 'You are logged out!');
    res.redirect('/users/login');
}

module.exports = UserRoutes;
