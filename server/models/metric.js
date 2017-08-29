var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var metricSchema = new Schema({
    name:  {
        type: String,
        required: true
    },
    description:  String,
    dataType:  {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    control:  {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    defaultEnabled:   {
        type: Boolean,
        default: false
    },
    defaultValue: String,
    valueList: [String],
    multipleValuesAllowed:   {
        type: Boolean,
        default: false
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Metric', metricSchema);