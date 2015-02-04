/**
 * Created by altran on 27/11/14.
 */
var mongoose = require('mongoose');
var config = require('../confs/config');
var utils = require('../utils/utils');

var RestrictionSchema = mongoose.Schema({
    _id         : Number,
    name        : { type: String, required: true },
    description : { type: String, required: true }
});

var UserSchema = mongoose.Schema({
    username     : { type: String, required: true, unique: true },
    password     : { type: String, required: true },
    email        : { type: String, required: true, match: config.regex.email },
    restrictions : [ { type: Number, ref: 'Restriction' } ],
    keepMeLogin    : { type: Boolean, default: false }
});

/**
 * User to string
 */
UserSchema.methods.toString = function() {
    return this.username + ' (' + this.email + ')';
};

/**
 * Check user access in database
 */
UserSchema.statics.checkAccess = function(username, password, keepMeLogin, cb) {
    this.findOneAndUpdate({

        username: username,
        password: utils.md5(password)

    }, {

        keepMeLogin: keepMeLogin

    }, cb);
};

UserSchema.statics.delete = function(id, cb) {
    this.findOneAndRemove({ _id: id }, cb);
};

var User = mongoose.model('User', UserSchema);
var Restriction = mongoose.model('Restriction', RestrictionSchema);

module.exports.User = User;
module.exports.Restriction = Restriction;