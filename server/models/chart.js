var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chartSchema = new Schema({
    type: [String],
    colorValues: [String],
    gridIncrements: String, 
    stylisticAlternatives: String
    metric: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Metric'
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Chart', chartSchema);