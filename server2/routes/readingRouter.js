var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');
var Readings = require('../models/readings');
var readingRouter = express.Router();
readingRouter.use(bodyParser.json());

readingRouter.route('/')
    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        // console.log(req);
        Readings
            .find({
                postedBy: req.decoded._id
            })
            .populate('postedBy','forGoal')
            .exec(function (err, reading) {
                if (err) throw err;
                res.json(reading);
            });
    })

    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        console.log(req);
        var reading = {};
        reading.value = req.body.value;
        reading.measurementUnit = req.body.measurementUnit;
        reading.postedBy = req.decoded._id;
        reading.forGoal = req.body.goalId;
        console.log(reading);
        Readings.create(reading, function (err, reading) {
            if (err) throw err;
            console.log('Reading created!');
            var id = reading._id;
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });

            res.end('Added the reading with id: ' + id);
        });
    })

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Readings
            .findOneAndRemove({
                postedBy: req.decoded._doc._id
            }, function (err, resp) {
                if (err) throw err;
                res.json(resp);
            });
    });

readingRouter.route('/:goalObjectId')
    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        // console.log(req);
        Readings.find({
            postedBy: req.decoded._id,
            forGoal: req.params.goalObjectId
        })
        .populate('postedBy','forGoal')
        .exec(function (err, reading) {
            if (err) throw err;
            res.json(reading);
        });
    })

    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        console.log(req);
        var reading = {};
        reading.value = req.body.value;
        reading.measurementUnit = req.body.measurementUnit;
        reading.postedBy = req.decoded._id;
        reading.forGoal = req.body.goalId;
        console.log(reading);
        Readings.create(reading, function (err, reading) {
            if (err) throw err;
            console.log('Reading created!');
            var id = reading._id;
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });

            res.end('Added the reading with id: ' + id);
        });
    })

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Readings
            .findOneAndUpdate({
                postedBy: req.decoded._id,
                forGoal: req.params.goalObjectId
            }, {
                $pull: {
                    forGoal: req.params.goalObjectId
                }
            }, {
                new: true
            }, function (err, reading) {
                if (err) throw err;
                res.json(reading);
            });
    });

module.exports = readingRouter;
