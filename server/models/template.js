var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var templateSchema = new Schema({
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
    }]
}, {
    timestamps: true
});


module.exports = mongoose.model('Template', templateSchema);