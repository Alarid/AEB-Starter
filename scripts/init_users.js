/**
 * Created by altran on 03/12/14.
 */
var Q = require('q');

var logger = require('../utils/logger');
var utils = require('../utils/utils');
var config = require("../confs/config.js");
var mongo = require('../confs/mongo');

var User = require('../models/access').User;
var Restriction = require('../models/access').Restriction;

// init mongo db
mongo.init(config.mongo.host, config.mongo.port, config.mongo.db, config.debug);

var restrictions = [
    new Restriction({ _id : 0, name : 'read',   description : 'Consultation de la base des contacts' }),
    new Restriction({ _id : 1, name : 'write',  description : 'Ajout de nouveaux contacts' }),
    new Restriction({ _id : 2, name : 'update', description : 'Modification de contacts existans' }),
    new Restriction({ _id : 3, name : 'delete', description : 'Suppression de contacts' }),
    new Restriction({ _id : 4, name : 'admin',  description : 'Administration du logiciel' })
];

/**
 *
 * @param restriction The Restriction object to save in mongodb
 */
var createRestriction = function(restriction){
    var dfd = Q.defer();

    restriction.save(function(err, savedRestriction){
        if(err) logger.error('Cannot create restriction \'' + restriction.name + '\' !');
        else logger.info('Restriction \'' + savedRestriction.name + '\' has been successfully created.');

        dfd.resolve(savedRestriction);
    });

    return dfd.promise;
}

/**
 *
 */
var createAdmin = function() {
    var dfd = Q.defer();

    new User({
        username: 'admin',
        password: utils.md5(config.admin.password),
        email: config.admin.email,
        restrictions: [0, 1, 2, 3, 4]

    }).save(function (err, savedUser) {
            if (err) logger.error('Cannot create user admin !')
            else logger.info('User admin has been successfully created.');
            dfd.resolve();
        });

    return dfd.promise;
}

// execute function list
utils.qMap(restrictions, createRestriction).then(createAdmin).then(utils.exit);