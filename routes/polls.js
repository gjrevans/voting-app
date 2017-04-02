var Poll    = require('../models/poll');

var PollRoutes = function(){};

PollRoutes.prototype.index = function(req, res) {
    res.render('polls/index.html', {
        page: { title: 'All Polls' },
        polls: [
            {name: 'sexy'},
            {name: 'nice'},
            {name: 'cool'}
        ]
    });
}

PollRoutes.prototype.show = function(req, res) {
    res.render('polls/show.html', {
        page: { title: 'Poll' },
        poll: {
            user: 'abc123',
            name: 'New Poll',
            results: {
                'a': 5,
                'b': 3,
                'c': 6,
                'd': 10,
                'e': 70
            }
        }
    });
}

PollRoutes.prototype.create = function(req, res) {
    res.render('polls/create.html', {
        page: { title: 'Poll' }

    });
}

module.exports = PollRoutes;
