var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var readingSchema = new Schema({
    value:  {
        type: String,
        required: true
    },
    measurementUnit:  {
        type: String,
        required: false
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    forGoal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Goal'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Reading', readingSchema);
