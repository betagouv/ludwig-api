/*
** Module dependencies
*/
var mongoose = require('../config/mongoose').instance();
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;
var SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isAdmin: Boolean,
    organization: String
});

/*
** Pre-save hook
*/
UserSchema.pre('save', function(next) {
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

/*
** Methods
*/
UserSchema.methods = {

    comparePassword: function(candidatePassword, cb) {
        bcrypt.compare(candidatePassword, this.password, cb);
    }

};

mongoose.model('User', UserSchema, 'agents');
