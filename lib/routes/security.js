var _ = require('lodash');

function ensureAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    next();
}

module.exports = function(api, passport) {

    api.post('/login', function(req, res, next) {
        passport.authenticate('local', function(err, user) {
            if (err) return next(err);
            if (!user) return res.sendStatus(400);
            req.logIn(user, function(err) {
                if (err) return next(err);
                res.send(_.omit(user.toObject(), 'password'));
            });
        })(req, res, next);
    });

    api.post('/logout', function(req, res) {
        req.logout();
        res.send(204);
    });

    api.get('/profile', ensureAuthenticated, function(req, res) {
        res.send(req.user);
    });

};
