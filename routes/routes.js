const User = require('../models/user');
const express = require('express');
const router = express.Router();
const path = require('path');

function requiresLogin(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        var err = new Error('You must be logged in to view this page.');
        err.status = 401;
        return res.redirect('/login');
    }
}

//Route main page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/pages/index.html"));
})

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/pages/login.html"));
})

router.get('/dabs', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/pages/dabs.html"));
})

router.get('/flowers', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/pages/flowers.html"));
})

router.get('/edibles', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/pages/edibles.html"));
})

router.post('/login', (req, res, next) => {
    var body = req.body;

    if (req.body.password != req.body.passwordConf) {
        var err = new Error('Passwords do not match.');
        err.status == 400;
        res.send('Passwords do not match');
        return next(err);
    }

    console.log(body);
    if (body.email &&
        body.username &&
        body.password &&
        body.passwordConf) {
        var userData = {
            email: body.email,
            username: body.username,
            password: body.password,
            passwordConf: body.passwordConf
        }
        //use schema.create to insert data into the db
        User.create(userData, function(err, user) {
            if (err) {
                console.log(err);
                return res.sendFile(path.join(__dirname, "../public/pages/login.html"));
            } else {
                if (req.session.userId) {
                    console.log('here');
                    return res.redirect('/');
                }
                req.session.userId = user._id;
                return res.redirect('/');
            }
        });
    } else if (req.body.logemail && req.body.logpassword) {
        console.log(req.body.logemail);
        console.log(req.body.logpassword);
        console.log(req.session);

        User.authenticate(req.body.logemail, req.body.logpassword, function(error, user) {
            if (error || !user) {
                var err = new Error('Wrong email or password.');
                err.status = 401;
                return next(err);
            } else {
                if (req.session.userId) {
                    console.log('here');
                    return res.redirect('/profile');
                }
                req.session.userId = user._id;
                return res.redirect('/profile');
            }
        });
    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
})

// GET route after registering
router.get('/cart', function(req, res, next) {
    User.findById(req.session.userId)
        .exec(function(error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return res.redirect('/login')
                } else {
                    res.sendFile(path.join(__dirname, "../public/pages/cart.html"));
                }
            }
        });
});

// GET route after registering
router.get('/profile', function(req, res, next) {
    User.findById(req.session.userId)
        .exec(function(error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return res.redirect('/login')
                } else {
                    res.sendFile(path.join(__dirname, "../public/pages/profile.html"));
                }
            }
        });
});

// GET for logout logout
router.get('/logout', function(req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/login');
            }
        });
    }
});


module.exports = router;
