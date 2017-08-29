var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var User = require('../models/user');
var Verify = require('./verify');
var userRouter = express.Router();

userRouter.use(bodyParser.json());

//////////
// User //
//////////

userRouter.route('/')
    .get(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        User.find({}, function (err, user) {
            if (err) throw err;
            res.json(user);
        });
    });

userRouter.route('/:userId')
    .get(function (req, res, next) {
        User.findById(req.params.userId)
            .exec(function (err, user) {
                if (err) next(err);
                res.json(user);
            });
    })

    .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        User.findByIdAndUpdate(req.params.userId, {
            $set: req.body
        }, {
            new: true
        }, function (err, user) {
            if (err) next(err);
            res.json(user);
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        User.findByIdAndRemove(req.params.userId, function (err, resp) {
            if (err) next(err);
            res.json(resp);
        });
    });

////////////////
// User.Goals //
////////////////

userRouter.route('/:userId/goals')
    .get(function (req, res, next) {
        User.findById(req.params.userId)
            .populate('goals.postedBy')
            .exec(function (err, user) {
                if (err)
                    next(err);
                res.json(user.goals);
            });
    })

    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        User.findById(req.params.userId, function (err, user) {
            if (err)
                next(err);
            req.body.postedBy = req.decoded._id;
            user.goals.push(req.body);
            user.save(function (err, user) {
                if (err)
                    next(err);
                console.log('Updated goals!');
                res.json(user);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        User.findById(req.params.userId, function (err, user) {
            if (err) throw err;
            for (var i = (user.goals.length - 1); i >= 0; i--) {
                user.goals.id(user.goals[i]._id).remove();
            }
            user.save(function (err, result) {
                if (err)
                    next(err);
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('Deleted all goals!');
            });
        });
    });

userRouter.route('/:goalId/goals/:goalId')
    .get(function (req, res, next) {
        User.findById(req.params.goalId)
            .populate('goals.postedBy')
            .exec(function (err, user) {
                if (err) 
                    next(err);
                res.json(user.goals.id(req.params.goalId));
            });
    })

    .put(Verify.verifyOrdinaryUser, function (req, res, next) {
        // We delete the existing commment and insert the updated
        // comment as a new comment
        Dishes.findById(req.params.goalId, function (err, user) {
            if (err) 
                next(err);
            user.goals.id(req.params.goalId).remove();
            req.body.postedBy = req.decoded._id;
            user.goals.push(req.body);
            user.save(function (err, user) {
                if (err) 
                    next(err);
                console.log('Updated Goals!');
                res.json(user);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Dishes.findById(req.params.goalId, function (err, user) {
            if (user.goals.id(req.params.goalId).postedBy !=
                req.decoded._id) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            user.goals.id(req.params.goalId).remove();
            user.save(function (err, resp) {
                if (err) 
                    next(err);
                res.json(resp);
            });
        });
    });

userRouter.route('/:goalId/goals/:goalId/metrics')
    .get(function (req, res, next) {
        //TODO: requires a more substantial find operation
        User.findById(req.params.userId)
            .populate('goals.postedBy')
            .exec(function (err, user) {
                if (err)
                    next(err);
                res.json(user.goals);
            });
    })

    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        User.findById(req.params.userId, function (err, user) {
            if (err)
                next(err);
            req.body.postedBy = req.decoded._id;
            user.goals.push(req.body);
            user.save(function (err, user) {
                if (err)
                    next(err);
                console.log('Updated goals!');
                res.json(user);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        User.findById(req.params.userId, function (err, user) {
            if (err) throw err;
            for (var i = (user.goals.length - 1); i >= 0; i--) {
                user.goals.id(user.goals[i]._id).remove();
            }
            user.save(function (err, result) {
                if (err)
                    next(err);
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('Deleted all goals!');
            });
        });
    });

userRouter.route('/:goalId/goals/:goalId/metrics/:metricId')
    .get(function (req, res, next) {
        User.findById(req.params.goalId)
            .populate('goals.postedBy')
            .exec(function (err, user) {
                if (err) 
                    next(err);
                res.json(user.goals.id(req.params.goalId));
            });
    })

    .put(Verify.verifyOrdinaryUser, function (req, res, next) {
        // We delete the existing commment and insert the updated
        // comment as a new comment
        Dishes.findById(req.params.goalId, function (err, user) {
            if (err) 
                next(err);
            user.goals.id(req.params.goalId).remove();
            req.body.postedBy = req.decoded._id;
            user.goals.push(req.body);
            user.save(function (err, user) {
                if (err) 
                    next(err);
                console.log('Updated Goals!');
                res.json(user);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Dishes.findById(req.params.goalId, function (err, user) {
            if (user.goals.id(req.params.goalId).postedBy !=
                req.decoded._id) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            user.goals.id(req.params.goalId).remove();
            user.save(function (err, resp) {
                if (err) 
                    next(err);
                res.json(resp);
            });
        });
    });

userRouter.route('/:goalId/goals/:goalId/metrics/:metricId/measurements/')
    .get(function (req, res, next) {
        //TODO: requires a more substantial find operation
        User.findById(req.params.userId)
            .populate('goals.postedBy')
            .exec(function (err, user) {
                if (err)
                    next(err);
                res.json(user.goals);
            });
    })

    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        User.findById(req.params.userId, function (err, user) {
            if (err)
                next(err);
            req.body.postedBy = req.decoded._id;
            user.goals.push(req.body);
            user.save(function (err, user) {
                if (err)
                    next(err);
                console.log('Updated goals!');
                res.json(user);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        User.findById(req.params.userId, function (err, user) {
            if (err) throw err;
            for (var i = (user.goals.length - 1); i >= 0; i--) {
                user.goals.id(user.goals[i]._id).remove();
            }
            user.save(function (err, result) {
                if (err)
                    next(err);
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('Deleted all goals!');
            });
        });
    });

userRouter.route('/:goalId/goals/:goalId/metrics/:metricId/measurements/:measurementId')
    .get(function (req, res, next) {
        User.findById(req.params.goalId)
            .populate('goals.postedBy')
            .exec(function (err, user) {
                if (err) 
                    next(err);
                res.json(user.goals.id(req.params.goalId));
            });
    })

    .put(Verify.verifyOrdinaryUser, function (req, res, next) {
        // We delete the existing commment and insert the updated
        // comment as a new comment
        Dishes.findById(req.params.goalId, function (err, user) {
            if (err) 
                next(err);
            user.goals.id(req.params.goalId).remove();
            req.body.postedBy = req.decoded._id;
            user.goals.push(req.body);
            user.save(function (err, user) {
                if (err) 
                    next(err);
                console.log('Updated Goals!');
                res.json(user);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Dishes.findById(req.params.goalId, function (err, user) {
            if (user.goals.id(req.params.goalId).postedBy !=
                req.decoded._id) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            user.goals.id(req.params.goalId).remove();
            user.save(function (err, resp) {
                if (err) 
                    next(err);
                res.json(resp);
            });
        });
    });

//////////////////
// User.Metrics //
//////////////////

userRouter.route('/:userId/metrics')
    .get(function (req, res, next) {
        User.findById(req.params.userId)
            .populate('metrics.postedBy')
            .exec(function (err, user) {
                if (err)
                    next(err);
                res.json(user.metrics);
            });
    })

    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        User.findById(req.params.userId, function (err, user) {
            if (err)
                next(err);
            req.body.postedBy = req.decoded._id;
            user.metrics.push(req.body);
            user.save(function (err, user) {
                if (err)
                    next(err);
                console.log('Updated metrics!');
                res.json(user);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        User.findById(req.params.userId, function (err, user) {
            if (err) throw err;
            for (var i = (user.metrics.length - 1); i >= 0; i--) {
                user.metrics.id(user.metrics[i]._id).remove();
            }
            user.save(function (err, result) {
                if (err)
                    next(err);
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('Deleted all metrics!');
            });
        });
    });

userRouter.route('/:userId/metrics/:metricId')
    .get(function (req, res, next) {
        User.findById(req.params.metricId)
            .populate('metrics.postedBy')
            .exec(function (err, user) {
                if (err) 
                    next(err);
                res.json(user.metrics.id(req.params.metricId));
            });
    })

    .put(Verify.verifyOrdinaryUser, function (req, res, next) {
        // We delete the existing commment and insert the updated
        // comment as a new comment
        Dishes.findById(req.params.metricId, function (err, user) {
            if (err) 
                next(err);
            user.metrics.id(req.params.metricId).remove();
            req.body.postedBy = req.decoded._id;
            user.metrics.push(req.body);
            user.save(function (err, user) {
                                if (err) 
                    next(err);
                console.log('Updated Comments!');
                res.json(user);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Dishes.findById(req.params.metricId, function (err, user) {
            if (user.metrics.id(req.params.metricId).postedBy !=
                req.decoded._id) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            user.metrics.id(req.params.metricId).remove();
            user.save(function (err, resp) {
                if (err) 
                    next(err);
                res.json(resp);
            });
        });
    });

//////////////////
// User.Reports //
//////////////////

userRouter.route('/:userId/reports')
    .get(function (req, res, next) {
        User.findById(req.params.userId)
            .populate('reports.postedBy')
            .exec(function (err, user) {
                if (err)
                    next(err);
                res.json(user.reports);
            });
    })

    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        User.findById(req.params.userId, function (err, user) {
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
        User.findById(req.params.userId, function (err, user) {
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

userRouter.route('/:userId/reports/:reportId')
    .get(function (req, res, next) {
        User.findById(req.params.reportId)
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
        Dishes.findById(req.params.reportId, function (err, user) {
            if (err) 
                next(err);
            user.reports.id(req.params.reportId).remove();
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

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Dishes.findById(req.params.reportId, function (err, user) {
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

////////////////////
// User.Templates //
////////////////////

userRouter.route('/:userId/templates')
    .get(function (req, res, next) {
        User.findById(req.params.userId)
            .populate('templates.postedBy')
            .exec(function (err, user) {
                if (err)
                    next(err);
                res.json(user.templates);
            });
    })

    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        User.findById(req.params.userId, function (err, user) {
            if (err)
                next(err);
            req.body.postedBy = req.decoded._id;
            user.templates.push(req.body);
            user.save(function (err, user) {
                if (err)
                    next(err);
                console.log('Updated templates!');
                res.json(user);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        User.findById(req.params.userId, function (err, user) {
            if (err) throw err;
            for (var i = (user.templates.length - 1); i >= 0; i--) {
                user.templates.id(user.templates[i]._id).remove();
            }
            user.save(function (err, result) {
                if (err)
                    next(err);
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('Deleted all templates!');
            });
        });
    });

userRouter.route('/:userId/templates/:templateId')
    .get(function (req, res, next) {
        User.findById(req.params.templateId)
            .populate('templates.postedBy')
            .exec(function (err, user) {
                if (err) 
                    next(err);
                res.json(user.templates.id(req.params.templateId));
            });
    })

    .put(Verify.verifyOrdinaryUser, function (req, res, next) {
        // We delete the existing commment and insert the updated
        // comment as a new comment
        Dishes.findById(req.params.templateId, function (err, user) {
            if (err) 
                next(err);
            user.templates.id(req.params.templateId).remove();
            req.body.postedBy = req.decoded._id;
            user.templates.push(req.body);
            user.save(function (err, user) {
                                if (err) 
                    next(err);
                console.log('Updated Comments!');
                res.json(user);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Dishes.findById(req.params.templateId, function (err, user) {
            if (user.templates.id(req.params.templateId).postedBy !=
                req.decoded._id) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            user.templates.id(req.params.templateId).remove();
            user.save(function (err, resp) {
                if (err) 
                    next(err);
                res.json(resp);
            });
        });
    });

/////////////////////////////////////
// Registration and Authentication //
/////////////////////////////////////
 
userRouter.post('/register', function (req, res) {
    User.register(new User({
            username: req.body.username
        }),
        req.body.password,
        function (err, user) {
            if (err) {
                return res.status(500).json({
                    err: err
                });
            }
            if (req.body.firstname) {
                user.firstname = req.body.firstname;
            }
            if (req.body.lastname) {
                user.lastname = req.body.lastname;
            }
            user.save(function (err, user) {
                passport.authenticate('local')(req, res, function () {
                    return res.status(200).json({
                        status: 'Registration Successful!'
                    });
                });
            });
        });
});

userRouter.route('/login')
    .post(function (req, res, next) {
        passport.authenticate('local', function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json({
                    err: info
                });
            }
            req.logIn(user, function (err) {
                if (err) {
                    return res.status(500).json({
                        err: 'Could not log in user'
                    });
                }

                var token = Verify.getToken({"username":user.username, "_id":user._id, "admin":user.admin});
                res.status(200).json({
                    status: 'Login successful!',
                    success: true,
                    token: token
                });
            });
        })(req, res, next);
    });

userRouter.route('/logout')
    .get(function (req, res) {
        req.logout();
        res.status(200).json({
            status: 'Bye!'
        });
    });

userRouter.get('/facebook', passport.authenticate('facebook'),
    function (req, res) {});

userRouter.get('/facebook/callback', function (req, res, next) {
    passport.authenticate('facebook', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                err: info
            });
        }
        req.logIn(user, function (err) {
            if (err) {
                return res.status(500).json({
                    err: 'Could not log in user'
                });
            }
            var token = Verify.getToken(user);
            res.status(200).json({
                status: 'Login successful!',
                success: true,
                token: token
            });
        });
    })(req, res, next);
});

module.exports = userRouter;
