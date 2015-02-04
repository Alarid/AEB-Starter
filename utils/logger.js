/**
 * Created by altran on 03/12/14.
 */
var winston = require('winston');

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)()
        //, new (winston.transports.File)({ filename: 'logging.log' })
    ]
});

module.exports = logger;