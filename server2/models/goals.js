var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var goalSchema = new Schema({
    name:  {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: false
    },
    featured: {
        type: Boolean,
        default:false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Goal', goalSchema);
