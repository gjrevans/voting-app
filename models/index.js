/* If you want to use mongo uncomment it here */
/* Then, pass db as an argument to 'new self[name](db)' */
/*
var mongojs = require('mongojs'),
    db = mongojs(process.env.MONGO_URL, ['collection-name-here']);
*/

var Models = function(){
    var self = this;
    require('fs').readdirSync(__dirname + '/').forEach(function(file) {
        if (file !== 'index.js') {
            var name = file.replace('.js', '');
            self[name] = require('./' + file);
            self[name] = new self[name];
        }
    });
};

module.exports = Models;
