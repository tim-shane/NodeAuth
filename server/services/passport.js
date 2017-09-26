/**
 * Created by Tim on 9/25/2017.
 */
const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');


const localOptions = {usernameField: 'email'};

const localLogin = new LocalStrategy(localOptions, function( email, password, done){
    //verify un / pw and call done
    User.findOne({ email: email }, function(err, user){
        if (err) {return done(err);}
        if(!user) {return done(null, false);}

        // compare password; is 'pass' == user.pass
        user.comparePassword(password, function(err, isMatch){
            if(err) {return done(err);}
            if(!isMatch) { return done(null, false);}
            return done(null, true)
        })
    })

});


 // setup options for jwt strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};


// create jwt strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
    // see if user ID in payload exists in DB
    // if does, call 'done w/ user', else 'done w/o'
    User.findById(payload.sub, function(err, user){
        if(err){return done(err, false);}

        if(user){
            done(null, user);
        } else {
            done(null, false);
        }
    })
});

// tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);