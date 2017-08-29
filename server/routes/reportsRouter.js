var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');
var Reports = require('../models/report');
var reportRouter = express.Router();
reportRouter.use(bodyParser.json());

///////////////
// Reports //
///////////////

reportRouter.route('/')
    .get(function (req, res, next) {
        Reports.findById(req.params.reportId)
            .populate('reports.postedBy')
            .exec(function (err, report) {
                if (err)
                    next(err);
                res.json(report);
            });
    })

    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        Reports.findById(req.params.reportId, function (err, report) {
            if (err)
                next(err);
            req.body.postedBy = req.decoded._id;
            report.push(req.body);
            report.save(function (err, report) {
                if (err)
                    next(err);
                console.log('Updated reports!');
                res.json(report);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Reports.findById(req.params.reportId, function (err, report) {
            if (err) throw err;
            for (var i = (report.length - 1); i >= 0; i--) {
                report.id(report[i]._id).remove();
            }
            report.save(function (err, result) {
                if (err)
                    next(err);
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('Deleted all reports!');
            });
        });
    });

reportRouter.route('/:reportId')
    .get(function (req, res, next) {
        Reports.findById(req.params.reportId)
            .populate('reports.postedBy')
            .exec(function (err, report) {
                if (err) 
                    next(err);
                res.json(report.id(req.params.reportId));
            });
    })

    .put(Verify.verifyOrdinaryUser, function (req, res, next) {
        // We delete the existing commment and insert the updated
        // comment as a new comment
        Reports.findById(req.params.reportId, function (err, report) {
            if (err) 
                next(err);
            report.id(req.params.reportId).remove();
            req.body.postedBy = req.decoded._id;
            report.push(req.body);
            report.save(function (err, report) {
                                if (err) 
                    next(err);
                console.log('Updated Report!');
                res.json(report);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Reports.findById(req.params.reportId, function (err, report) {
            if (report.id(req.params.reportId).postedBy !=
                req.decoded._id) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            report.id(req.params.reportId).remove();
            report.save(function (err, resp) {
                if (err) 
                    next(err);
                res.json(resp);
            });
        });
    });

module.exports = reportRouter;
