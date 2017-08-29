var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    username: String,
    password: String,
    OauthId: String,
    OauthToken: String,
    firstname: {
      type: String,
      default: ''
    },
    lastname: {
      type: String,
      default: ''
    },
    coach:   {
        type: Boolean,
        default: false
    },
    admin:   {
        type: Boolean,
        default: false
    },
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
}, {
    timestamps: true
});

User.methods.getName = function() {
    return (this.firstname + ' ' + this.lastname);
};

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);