var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teamSchema = new Schema({
    name:  {
        type: String,
        required: true
    },
    description:  String,
    goals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Goal'
    }], 
    metrics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Metric'
    }], 
    reports: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Report'
    }],
    coach: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Team', teamSchema);