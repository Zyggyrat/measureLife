var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var progress = require('../models/progress');
var Verify = require('./verify');
var progressRouter = express.Router();
progressRouter.use(bodyParser.json());

progressRouter.route('/')
    .get(function (req, res, next) {
        progress.find(req.query)
            .exec(function (err, progress) {
                if (err) next(err);
                res.json(progress);
            });
    })

    .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        progress.create(req.body, function (err, progress) {
            if (err) next(err);
            console.log('Progress created!');
            var id = progress._id;

            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Added the progress with id: ' + id);
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        progress.remove({}, function (err, resp) {
            if (err) next(err);
            res.json(resp);
        });
    });

progressRouter.route('/:progressId')
    .get(function (req, res, next) {
        progress.findById(req.params.progressId)
            .exec(function (err, progress) {
                if (err) next(err);
                res.json(progress);
            });
    })

    .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        progress.findByIdAndUpdate(req.params.progressId, {
            $set: req.body
        }, {
            new: true
        }, function (err, progress) {
            if (err) next(err);
            res.json(progress);
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        progress.findByIdAndRemove(req.params.progressId, function (err, resp) {
            if (err) next(err);
            res.json(resp);
        });
    });

module.exports = progressRouter;
