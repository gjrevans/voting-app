var Poll    = require('../models/poll');

var PollRoutes = function(){};

PollRoutes.prototype.index = function(req, res) {
    Poll.getPolls({}, function(err, polls){
        if(err) throw err;
        res.render('polls/index.html', {
            breadcrumbs: req.breadcrumbs(),
            page: { title: 'All Polls' },
            polls: polls
        });
    });

}

PollRoutes.prototype.show = function(req, res) {
    Poll.getPollById(req.params.pollId, function(err, poll) {
        if(err) throw err;

        // Set the page breadcrumb
        req.breadcrumbs(poll.user.name, '/polls/user/' + poll.user._id);
        req.breadcrumbs(poll.question, '/');

        // Render the page
        res.render('polls/show.html', {
            breadcrumbs: req.breadcrumbs(),
            page: { title: poll.question },
            poll: poll
        });
    });
}

PollRoutes.prototype.new = function(req, res) {
    // Set the page breadcrumb
    req.breadcrumbs('New Poll', '/');

    // Render the page
    res.render('polls/new.html', {
        breadcrumbs: req.breadcrumbs(),
        page: { title: 'Poll' }
    });
}

PollRoutes.prototype.create = function(req, res) {
    // Validation
    req.checkBody('question', 'Please provide a question!').notEmpty();
    req.checkBody('options', 'Options is not an array.').isArray();
    req.checkBody('options', 'Please provide at least 2 options.').isLength(2);

    var errors = req.validationErrors();

    if (errors) {
        req.flash('errorMessages', errors);
        res.redirect('new');
    } else {
        var results = req.body.options.map(function(e) {
            return {option: e, votes: 0};
        });

        var newPoll = new Poll({
            question: req.body.question,
            user: req.user,
            results: results
        });

        Poll.createPoll(newPoll, function(err, poll){
            if(err) throw err;

            req.flash('successMessages', 'Your poll was created successfully!');
            res.redirect(poll._id);
        });

    }
}

PollRoutes.prototype.update = function(req, res) {
    // Validation
    req.checkBody('option', 'No option was provided.').notEmpty();

    var errors = req.validationErrors();

    // Creat Poll Opts
    var opts = [];
    opts.option = req.body.option;

    if (errors) {
        req.flash('errorMessages', errors);
        res.redirect('new');
    } else {
        Poll.updatePollbyId(req.params.pollId, opts, function(err, poll){
            if(err) throw err;

            req.flash('successMessages', 'Your poll was successfully updated!');
            res.redirect(poll._id);
        });

    }
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

PollRoutes.prototype.userPolls = function(req, res) {
    Poll.getPollsForUser(req.params.userId, function(err, polls) {
        if(err) throw err;

        // Set the page breadcrumb
        req.breadcrumbs(polls[0].user.name, '/polls/user/' + polls[0].user._id);

        // Render the page
        res.render('polls/userPolls.html', {
            breadcrumbs: req.breadcrumbs(),
            page: { title: 'My Polls' },
            polls: polls
        });
    });
}

PollRoutes.prototype.delete = function(req, res) {
    Poll.deletePollById(req.params.pollId, function(err, poll) {
        if(err) throw err;
        req.flash('successMessages', 'Your poll was successfully deleted');
        res.redirect('/polls/user/' + req.user.id);
    });
}

module.exports = PollRoutes;
