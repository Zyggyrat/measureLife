var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Templates = require('../models/template');
var Verify = require('./verify');
var templateRouter = express.Router();
templateRouter.use(bodyParser.json());

///////////////
// Templates //
///////////////

templateRouter.route('/')
    .get(function (req, res, next) {
        Templates.findById(req.params.userId)
            .populate('templates.postedBy')
            .exec(function (err, template) {
                if (err)
                    next(err);
                res.json(template);
            });
    })

    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        Templates.findById(req.params.userId, function (err, template) {
            if (err)
                next(err);
            req.body.postedBy = req.decoded._id;
            template.push(req.body);
            template.save(function (err, template) {
                if (err)
                    next(err);
                console.log('Updated templates!');
                res.json(template);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Templates.findById(req.params.userId, function (err, template) {
            if (err) throw err;
            for (var i = (template.length - 1); i >= 0; i--) {
                template.id(template[i]._id).remove();
            }
            template.save(function (err, result) {
                if (err)
                    next(err);
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('Deleted all templates!');
            });
        });
    });

templateRouter.route('/:templateId')
    .get(function (req, res, next) {
        Templates.findById(req.params.templateId)
            .populate('templates.postedBy')
            .exec(function (err, template) {
                if (err) 
                    next(err);
                res.json(template.id(req.params.templateId));
            });
    })

    .put(Verify.verifyOrdinaryUser, function (req, res, next) {
        // We delete the existing commment and insert the updated
        // comment as a new comment
        Templates.findById(req.params.templateId, function (err, template) {
            if (err) 
                next(err);
            template.id(req.params.templateId).remove();
            req.body.postedBy = req.decoded._id;
            template.push(req.body);
            template.save(function (err, template) {
                if (err) 
                    next(err);
                console.log('Updated Template!');
                res.json(template);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Templates.findById(req.params.templateId, function (err, template) {
            if (template.id(req.params.templateId).postedBy !=
                req.decoded._id) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            template.id(req.params.templateId).remove();
            template.save(function (err, resp) {
                if (err) 
                    next(err);
                res.json(resp);
            });
        });
    });

module.exports = templateRouter;
