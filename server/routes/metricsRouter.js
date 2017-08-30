var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');
var Reports = require('../models/metric');
var metricRouter = express.Router();
metricRouter.use(bodyParser.json());

///////////////
// Metrics //
///////////////

metricRouter.route('/')
    .get(function (req, res, next) {
        Reports.findById(req.params.metricId)
            .populate('metrics.postedBy')
            .exec(function (err, metric) {
                if (err)
                    next(err);
                res.json(metric);
            });
    })

    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        Reports.findById(req.params.metricId, function (err, metric) {
            if (err)
                next(err);
            req.body.postedBy = req.decoded._id;
            metric.push(req.body);
            metric.save(function (err, metric) {
                if (err)
                    next(err);
                console.log('Updated metrics!');
                res.json(metric);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Reports.findById(req.params.metricId, function (err, metric) {
            if (err) throw err;
            for (var i = (metric.length - 1); i >= 0; i--) {
                metric.id(metric[i]._id).remove();
            }
            metric.save(function (err, result) {
                if (err)
                    next(err);
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('Deleted all metrics!');
            });
        });
    });

metricRouter.route('/:metricId')
    .get(function (req, res, next) {
        Reports.findById(req.params.metricId)
            .populate('metrics.postedBy')
            .exec(function (err, metric) {
                if (err) 
                    next(err);
                res.json(metric.id(req.params.metricId));
            });
    })

    .put(Verify.verifyOrdinaryUser, function (req, res, next) {
        // We delete the existing commment and insert the updated
        // comment as a new comment
        Reports.findById(req.params.metricId, function (err, metric) {
            if (err) 
                next(err);
            metric.id(req.params.metricId).remove();
            req.body.postedBy = req.decoded._id;
            metric.push(req.body);
            metric.save(function (err, metric) {
                                if (err) 
                    next(err);
                console.log('Updated Report!');
                res.json(metric);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Reports.findById(req.params.metricId, function (err, metric) {
            if (metric.id(req.params.metricId).postedBy !=
                req.decoded._id) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            metric.id(req.params.metricId).remove();
            metric.save(function (err, resp) {
                if (err) 
                    next(err);
                res.json(resp);
            });
        });
    });

module.exports = metricRouter;
