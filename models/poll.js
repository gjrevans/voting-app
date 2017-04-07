var mongoose    = require('mongoose');
var validator   = require('validator');

var PollSchema = mongoose.Schema({
    question: {
        type: String,
        index: true
    },
    user: {
        _id: {
            type: mongoose.Schema.ObjectId
        },
        name: {
            type: String
        }
    },
    results: [{
        option: {
            type: String
        },
        votes: {
            type: Number
        }
    }]
});

var Poll = module.exports = mongoose.model('Poll', PollSchema);

module.exports.createPoll = function(newPoll, callback){
    newPoll.save(callback);
}

module.exports.getPolls = function(id, callback){
	Poll.find(callback);
}

module.exports.getPollById = function(id, callback){
    // Make sure we're passing a mongo id
    if(!id || !validator.isMongoId(id)){
        return callback("invalidPollId", false);
    }
	Poll.findById(id, callback);
}

module.exports.deletePollById = function(id, callback){
    // Make sure we're passing a mongo id
    if(!id || !validator.isMongoId(id)){
        return callback("invalidPollId", false);
    }
	Poll.findOneAndRemove(id, callback);
}

module.exports.getPollsForUser = function(id, callback){
	Poll.find({'user._id': id}, callback);
}

module.exports.voteById = function(id, option, callback){
    // Make sure we're passing a mongo id
    if(!id || !validator.isMongoId(id)){
        return callback("invalidId", false);
    }

    var increment = {
        $inc: {
            'results.$.votes': 1
        }
    };

    var query = {
        '_id': id,
        'results._id': option,
    };

    Poll.findOneAndUpdate(query, increment, callback);
}
