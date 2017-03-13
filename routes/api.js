var express = require('express'),
    router = express.Router();

// Example post
router.post('/', function(req, res) {
    console.log(req.body);
});

// Example get
router.get('/:id', function (req, res) {
    console.log(req.params.id);
});

module.exports = router;
