var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');
var Teams = require('../models/team');
var teamRouter = express.Router();
teamRouter.use(bodyParser.json());

///////////
// Teams //
///////////

teamRouter.route('/')
    .get(function (req, res, next) {
        Teams.findById(req.params.reportId)
            .populate('teams.postedBy')
            .exec(function (err, user) {
                if (err)
                    next(err);
                res.json(teams);
            });
    })

    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        Teams.findById(req.params.reportId, function (err, user) {
            if (err)
                next(err);
            req.body.postedBy = req.decoded._id;
            user.teams.push(req.body);
            user.save(function (err, user) {
                if (err)
                    next(err);
                console.log('Updated teams!');
                res.json(user);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Teams.findById(req.params.reportId, function (err, user) {
            if (err) throw err;
            for (var i = (user.teams.length - 1); i >= 0; i--) {
                user.teams.id(user.teams[i]._id).remove();
            }
            user.save(function (err, result) {
                if (err)
                    next(err);
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('Deleted all teams!');
            });
        });
    });

teamRouter.route('/:teamId')
    .get(function (req, res, next) {
        Teams.findById(req.params.teamId)
            .populate('teams.postedBy')
            .exec(function (err, user) {
                if (err) 
                    next(err);
                res.json(user.teams.id(req.params.teamId));
            });
    })

    .put(Verify.verifyOrdinaryUser, function (req, res, next) {
        // We delete the existing commment and insert the updated
        // comment as a new comment
        Teams.findById(req.params.teamId, function (err, user) {
            if (err) 
                next(err);
            user.teams.id(req.params.teamId).remove();
            req.body.postedBy = req.decoded._id;
            user.teams.push(req.body);
            user.save(function (err, user) {
                                if (err) 
                    next(err);
                console.log('Updated Comments!');
                res.json(user);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Teams.findById(req.params.teamId, function (err, user) {
            if (user.teams.id(req.params.teamId).postedBy !=
                req.decoded._id) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            user.teams.id(req.params.teamId).remove();
            user.save(function (err, resp) {
                if (err) 
                    next(err);
                res.json(resp);
            });
        });
    });

module.exports = teamRouter;