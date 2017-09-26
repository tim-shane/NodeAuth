/**
 * Created by Tim on 9/25/2017.
 */
const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');
const requireSignin = passport.authenticate('local', {session: false});

const requireAuth = passport.authenticate('jwt', {session: false});


module.exports = function(app) {
    app.get('/', requireAuth, function(req, res) {
        res.send({hi: 'there'});
    });

    app.post('/signin', requireSignin, Authentication.signin);
    app.post('/signup', Authentication.signup);
};

