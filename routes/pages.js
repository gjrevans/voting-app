var express = require('express'),
    router = express.Router();

router.get('/', function(req, res) {
    res.render('index.html', { page: {
            title: 'Page Title'
        }
    });
});
module.exports = router;
