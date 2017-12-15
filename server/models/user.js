var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

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
    goals: [goalSchema],
    metrics: [metricSchema],
    reports: [reportSchema],
}, {
    timestamps: true
});
User.methods.getName = function() {
    return (this.firstname + ' ' + this.lastname);
};

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
