var express = require('express'),
    router = express.Router(),

// The path will shorten the url
router.post('/shorten', function(req, res) {
});

// Redirect the user to the original site
router.get('/:id', function (req, res) {
});

module.exports = router;
