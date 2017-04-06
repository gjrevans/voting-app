var Poll    = require('../models/poll');

var PollRoutes = function(){};

PollRoutes.prototype.index = function(req, res) {
    Poll.getPolls({}, function(err, polls){
        if(err) throw err;

        res.render('polls/index.html', {
            page: { title: 'All Polls' },
            polls: polls
        });
    });

}

PollRoutes.prototype.show = function(req, res) {
    Poll.getPollById(req.params.pollId, function(err, poll) {
        if(err) throw err;

        res.render('polls/show.html', {
            page: { title: poll.name },
            poll: poll
        });
    });
}

PollRoutes.prototype.userPolls = function(req, res) {
    Poll.getPollsForUser(req.params.userId, function(err, polls) {
        if(err) throw err;

        res.render('polls/userPolls.html', {
            page: { title: 'My Polls' },
            polls: polls
        });
    });
}

PollRoutes.prototype.vote = function(req, res) {
    var pollId = req.params.pollId;
    var option = req.body.optionId;

    Poll.voteById(pollId, option, function(err, poll) {
        if(err) throw err;
        req.flash('successMessages', 'Your vote was successfully cast');
        res.redirect('/polls/' + poll.id);
    });
}

PollRoutes.prototype.delete = function(req, res) {
    Poll.deletePollById(req.params.pollId, function(err, poll) {
        if(err) throw err;
        req.flash('successMessages', 'Your poll was successfully deleted');
        res.redirect('/polls/user/' + req.user.id);
    });
}

PollRoutes.prototype.new = function(req, res) {
    res.render('polls/new.html', {
        page: { title: 'Poll' }
    });
}

PollRoutes.prototype.create = function(req, res) {
    var name = req.body.name
    var userId = req.user._id
    var userName = req.user.name
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
            user: {
                id: userId,
                name: userName
            },
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
