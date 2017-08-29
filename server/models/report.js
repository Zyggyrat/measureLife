var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reportSchema = new Schema({
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
    charts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chart'
    }], 
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Report', reportSchema);