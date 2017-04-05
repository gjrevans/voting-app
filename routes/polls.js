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
    Poll.getPollById(req.params.id, function(err, poll) {
        if(err) throw err;
        res.render('polls/show.html', {
            page: { title: 'Poll' },
            poll: poll
        });
    });
}
PollRoutes.prototype.new = function(req, res) {
    res.render('polls/new.html', {
        page: { title: 'Poll' }
    });
}

PollRoutes.prototype.create = function(req, res) {
    var name = req.body.name
    var user = req.user._id
    var option1 = req.body.option1
    var option2 = req.body.option2
    var option3 = req.body.option3

    // Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('option1', 'Option 1 is Required').notEmpty();
    req.checkBody('option2', 'Option 2 is Required').notEmpty();
    req.checkBody('option3', 'Option 3 is Required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        req.flash('errorMessages', errors);
        res.redirect('new');
    } else {
        var newPoll = new Poll({
            name: name,
            user: user,
            results: [{
                option: option1,
                votes: 0
            },
            {
                option: option2,
                votes: 0
            },
            {
                option: option3,
                votes: 0
            }]
        });

        Poll.createPoll(newPoll, function(err, poll){
            if(err) throw error;

            req.flash('successMessages', 'Your poll was created successfully!');
            res.redirect(poll._id);
        });

    }
}
module.exports = PollRoutes;
