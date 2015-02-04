/**
 * Created by altran on 03/12/14.
 */
var mongoose = require('mongoose');
var logger = require('../utils/logger');
var utils = require('../utils/utils');

module.exports = {
    init: function(host, port, db, debug, cb) {

        if(!debug) debug = false;

        // configure mongodb
        mongoose.set('debug', debug);
        mongoose.connect('mongodb://' + host + ':' + port + '/' + db);
        mongoose.connection.on('error', function () {
            logger.error('Mongoose connection error');
            utils.exit(1);
        });

        mongoose.connection.once('open', function callback() {
            logger.info('Mongoose connected to the database <' + db + '> @ ' + host + ':' + port);
            if(cb) cb();
        });
    }
}