var PageRoutes = function(thing){};

PageRoutes.prototype.index = function(req, res) {
    res.render('index.html', { page: { title: 'Page Title' } } );
}

module.exports = PageRoutes;
