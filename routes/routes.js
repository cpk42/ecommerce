const User = require('../models/user');
const express = require('express');
const router = express.Router();
const path = require('path');

//Route main page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/pages/register.html"));
})

router.post('/register', (req, res) => {
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
                return res.sendFile(path.join(__dirname, "../public/pages/registerError.html"));
            } else {
                console.log(body);
                return res.redirect('/profile');
            }
        });
    } else if (req.body.logemail && req.body.logpassword) {
        User.authenticate(req.body.logemail, req.body.logpassword, function(error, user) {
            if (error || !user) {
                var err = new Error('Wrong email or password.');
                err.status = 401;
                return next(err);
            } else {
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
router.get('/profile', function(req, res, next) {
    User.findById(req.session.userId)
        .exec(function(error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
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
                return res.redirect('/');
            }
        });
    }
});


module.exports = router;