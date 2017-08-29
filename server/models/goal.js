var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var goalSchema = new Schema({
    name:  {
        type: String,
        required: true
    },
    description:  String,
    metrics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Metric'
    }], 
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Goal', goalSchema);