var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');
var Goals = require('../models/goal');
var goalRouter = express.Router();
goalRouter.use(bodyParser.json());

///////////////
// Goals //
///////////////

goalRouter.route('/')
    .get(function (req, res, next) {
        Goals.findById(req.params.goalId)
            .populate('goals.postedBy')
            .exec(function (err, goal) {
                if (err)
                    next(err);
                res.json(goal);
            });
    })

    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        Goals.create(req.body, function (err, goal) {
            if (err) {
                console.log('Goal not created with err: ' + err);
                next(err);
            }
            var id = goal._id;
            console.log('Goal created with id: ' + id);
            res.status(200).send('Added the goal with id: ' + id);
            // res.writeHead(200, {
            //     'Content-Type': 'text/plain'
            // }).end('Added the goal with id: ' + id);
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Goals.findById(req.params.goalId, function (err, goal) {
            if (err) throw err;
            for (var i = (goal.length - 1); i >= 0; i--) {
                goal.id(goal[i]._id).remove();
            }
            goal.save(function (err, result) {
                if (err)
                    next(err);
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('Deleted all goals!');
            });
        });
    });

goalRouter.route('/:goalId')
    .get(function (req, res, next) {
        Goals.findById(req.params.goalId)
            .populate('goals.postedBy')
            .exec(function (err, goal) {
                if (err) 
                    next(err);
                res.json(goal.id(req.params.goalId));
            });
    })

    .put(Verify.verifyOrdinaryUser, function (req, res, next) {
        // We delete the existing commment and insert the updated
        // comment as a new comment
        Goals.findById(req.params.goalId, function (err, goal) {
            if (err) 
                next(err);
            goal.id(req.params.goalId).remove();
            req.body.postedBy = req.decoded._id;
            goal.push(req.body);
            goal.save(function (err, goal) {
                if (err) 
                    next(err);
                console.log('Updated Report!');
                res.json(goal);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Goals.findById(req.params.goalId, function (err, goal) {
            if (goal.id(req.params.goalId).postedBy != req.decoded._id) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            goal.id(req.params.goalId).remove();
            goal.save(function (err, resp) {
                if (err) 
                    next(err);
                res.json(resp);
            });
        });
    });

module.exports = goalRouter;
