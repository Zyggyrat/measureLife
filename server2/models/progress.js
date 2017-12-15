var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var progressSchema = new Schema({
    favoredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    goalƒ: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Goal'
    },
    readings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reading'
    }]
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var progress = mongoose.model('progress', progressSchema);

// make this available to our Node applications
module.exports = progress;
