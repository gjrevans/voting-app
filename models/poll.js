var mongoose    = require('mongoose');

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
	Poll.findById(id, callback);
}
