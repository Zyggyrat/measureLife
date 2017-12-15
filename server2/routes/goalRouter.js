var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');
var Goals = require('../models/goals');
var goalRouter = express.Router();
goalRouter.use(bodyParser.json());

goalRouter.route('/')
    .get(function (req, res, next) {
        Goals.find(req.query)
            .populate('comments.postedBy')
            .exec(function (err, goal) {
                if (err)
                    next(err);
                res.json(goal);
            });
    })

    .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Goals.create(req.body, function (err, goal) {
            if (err) throw err;
            console.log('Goal created!');
            var id = goal._id;
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });

            res.end('Added the goal with id: ' + id);
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Goals.remove({}, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });

goalRouter.route('/:goalId')
    .get(function (req, res, next) {
        Goals.findById(req.params.goalId)
            .exec(function (err, goal) {
                if (err)
                    next(err);
                res.json(goal);
            });
    })

    .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Goals.findByIdAndUpdate(req.params.goalId, {
            $set: req.body
        }, {
            new: true
        }, function (err, goal) {
            if (err)
                next(err);
            res.json(goal);
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Goals.findByIdAndRemove(req.params.goalId, function (err, resp) {
            if (err)
                next(err);
            res.json(resp);
        });
    });

goalRouter.route('/:goalId/comments')
    .get(function (req, res, next) {
        Goals.findById(req.params.goalId)
            .populate('comments.postedBy')
            .exec(function (err, goal) {
                if (err)
                    next(err);
                res.json(goal.comments);
            });
    })

    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        Goals.findById(req.params.goalId, function (err, goal) {
            if (err)
                next(err);
            req.body.postedBy = req.decoded._id;
            goal.comments.push(req.body);
            goal.save(function (err, goal) {
                if (err)
                    next(err);
                console.log('Updated Comments!');
                res.json(goal);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Goals.findById(req.params.goalId, function (err, goal) {
            if (err) throw err;
            for (var i = (goal.comments.length - 1); i >= 0; i--) {
                goal.comments.id(goal.comments[i]._id).remove();
            }
            goal.save(function (err, result) {
                if (err)
                    next(err);
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('Deleted all comments!');
            });
        });
    });

goalRouter.route('/:goalId/comments/:commentId')
    .get(function (req, res, next) {
        Goals.findById(req.params.goalId)
            .populate('comments.postedBy')
            .exec(function (err, goal) {
                if (err)
                    next(err);
                res.json(goal.comments.id(req.params.commentId));
            });
    })

    .put(Verify.verifyOrdinaryUser, function (req, res, next) {
        // We delete the existing commment and insert the updated
        // comment as a new comment
        Goals.findById(req.params.goalId, function (err, goal) {
            if (err)
                next(err);
            goal.comments.id(req.params.commentId).remove();
            req.body.postedBy = req.decoded._id;
            goal.comments.push(req.body);
            goal.save(function (err, goal) {
                                if (err)
                    next(err);
                console.log('Updated Comments!');
                res.json(goal);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Goals.findById(req.params.goalId, function (err, goal) {
            if (goal.comments.id(req.params.commentId).postedBy !=
                req.decoded._id) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            goal.comments.id(req.params.commentId).remove();
            goal.save(function (err, resp) {
                if (err)
                    next(err);
                res.json(resp);
            });
        });
    });

module.exports = goalRouter;
