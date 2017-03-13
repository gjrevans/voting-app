var ApiRoutes = function(){};

ApiRoutes.prototype.index = function(req, res) {
    res.render('index.html', { page: { title: 'Page Title' } } );
}

module.exports = ApiRoutes;
