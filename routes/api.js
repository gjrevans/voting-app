var ApiRoutes = function(){};

ApiRoutes.prototype.index = function(req, res) {
    return res.status(404).json({error: true, message: "No endpoint specified."});
}

module.exports = ApiRoutes;
