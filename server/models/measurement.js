var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var measurementSchema = new Schema({
    values: [String], 
    metric: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Metric'
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Measurement', measurementSchema);