/**
 * Created by Tim on 9/25/2017.
 */
const jwt = require('jwt-simple');
const config = require('../config');
const User = require('../models/user');

function tokenForUser(user){
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret)
}

exports.signin = function(req, res, next){
    // User has already had email/pass auth'd
    // give token already.
    res.send({token: tokenForUser(req.user)});
};


exports.signup = function(req, res, next){
    const email = req.body.email;
    const password = req.body.password;

    if( !email || !password) {
        return res.status(422).send({error: "You must provide email and password"});
    }

    // if user exists, return error
    User.findOne({email:email}, function(err, existingUser){
        if(err){
            return next(err);
        }
        if(existingUser){
            return res.status(422).send({error: 'Email is in use'})
        }
        // if user not exist save record
        const user = new User({
            email: email,
            password: password
        });
        user.save(function(err){
            if (err) {return next(err);}
        });
        //respond to request indicating create
        res.json({ token: tokenForUser(user)});
    })
};
