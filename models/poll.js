var mongoose    = require('mongoose');
var validator   = require('validator');

var PollSchema = mongoose.Schema({
    name: {
        type: String,
        index: true
    },
    user: {
        type: String
    },
    results: [{
        option: {
            type: String
        },
        votes: {
            type: String
        }
    }]
});

var Poll = module.exports = mongoose.model('Poll', PollSchema);

module.exports.createPoll = function(newPoll, callback){
    newPoll.save(callback);
}

module.exports.getPollById = function(id, callback){
    // Make sure we're passing a mongo id
    if(!id || !validator.isMongoId(id)){
        return callback("invalidId", false);
    }
	Poll.findById(id, callback);
}

module.exports.getPolls = function(id, callback){
	Poll.find(callback);
}
