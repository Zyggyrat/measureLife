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
            .exec(function (err, user) {
                if (err)
                    next(err);
                res.json(user.reports);
            });
    })

    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        Reports.findById(req.params.reportId, function (err, user) {
            if (err)
                next(err);
            req.body.postedBy = req.decoded._id;
            user.reports.push(req.body);
            user.save(function (err, user) {
                if (err)
                    next(err);
                console.log('Updated reports!');
                res.json(user);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Reports.findById(req.params.reportId, function (err, user) {
            if (err) throw err;
            for (var i = (user.reports.length - 1); i >= 0; i--) {
                user.reports.id(user.reports[i]._id).remove();
            }
            user.save(function (err, result) {
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
            .exec(function (err, user) {
                if (err) 
                    next(err);
                res.json(user.reports.id(req.params.reportId));
            });
    })

    .put(Verify.verifyOrdinaryUser, function (req, res, next) {
        // We delete the existing commment and insert the updated
        // comment as a new comment
        Reports.findById(req.params.reportId, function (err, user) {
            if (err) 
                next(err);
            user.reports.id(req.params.reportId).remove();
            req.body.postedBy = req.decoded._id;
            user.reports.push(req.body);
            user.save(function (err, user) {
                                if (err) 
                    next(err);
                console.log('Updated Comments!');
                res.json(user);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Reports.findById(req.params.reportId, function (err, user) {
            if (user.reports.id(req.params.reportId).postedBy !=
                req.decoded._id) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            user.reports.id(req.params.reportId).remove();
            user.save(function (err, resp) {
                if (err) 
                    next(err);
                res.json(resp);
            });
        });
    });

module.exports = reportRouter;