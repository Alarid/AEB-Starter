/**
 * Created by altran on 04/12/14.
 */

var Q = require('q');
var crypto = require('crypto');

module.exports = {
    // exit function
    exit: function() {
        process.exit(1);
    },

    // execute an array of asynchronous functions
    qMap: function(array, fn){

        var dfd = Q.defer();
        var index = 0;

        (function next(){
            var item = array[index];
            if(index >= array.length) {
                dfd.resolve();
                return;
            }

            index++;
            fn(item).then(next);

        })();

        return dfd.promise;
    },

    //
    md5: function(str) {
        return crypto.createHash('md5').update(str).digest('hex');
    },

    // Generate a random password
    generatePassword: function() {
        var length = 8,
            charset = "abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
                retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }
};