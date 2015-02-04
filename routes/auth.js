//-----------------------------------------------------------------------------------------//
// JWT (JSON Web Token)
//-----------------------------------------------------------------------------------------//

var express = require('express')
, expressJwt = require('express-jwt')
, jwt = require('jsonwebtoken')
, app = require('../app')
, config = require('../confs/config')
, utils = require('../utils/utils')
;

var router = express.Router();
var User = require('../models/access').User;
var Restriction = require('../models/access').Restriction;

// protect contacts API with JWT
var secret = config.secret;
app.use('/api', expressJwt({ secret: secret }));


/**************************************************************************************************************/
/* POST REQUESTS
/**************************************************************************************************************/
/* POST authentication */
router.post('/', function (req, res) {
    User.checkAccess(req.body.username, req.body.password, req.body.keepMeLogin, function(err, user) {
        if(err || null == user) {
            res.status(401).send('Wrong user or password.');
            return;
        }

        var token = jwt.sign(user, secret, { expiresInMinutes: 60*50 });
        res.json({ token: token, user: user });
    });
});


/* POST user creation */
router.post('/create', function(req, res) {
    var _user = req.body;
    if (!_user) res.status(404).send("No user found");
    var password = utils.generatePassword();
    var user = new User({
        'username': _user.username,
        'email': _user.email,
        'password': utils.md5(password),
        'restrictions': _user.restrictions
    });
    user.save(function(err, user) {
        if(err) {
            res.status(404).json(err);
            return;
        }
        console.log('New user ' + user.toString() + ' successfully created !');
    });
});


/* POST user update */
router.post('/update', function(req, res) {
    var _user = req.body;
    if (!_user) {
        res.status(404).send("No user found");
        return;
    }

    User.update({ _id: _user._id }, _user).exec(function(err, user) {
        if(err) res.status(404).json(err);
        else res.json(user);
    });
});

/* POST change password */
router.post('/changePassword', function(req, res) {
    var _user = req.body;
    if (!_user) {
        res.status(404).send("No password found");
        return;
    }

    // Retrieve the user in the database
    User.findOne({username: _user.username}).exec(function(err, dbUser) {
        if (err) {
            res.status(404).json(err);
            return;
        }

        // Password verification
        if (utils.md5(_user.checkActualPassword) != dbUser.password) {
            res.status(404).send("L'ancien mot de passe n'est pas correct.");
            return;
        }

        // Change password
        _user.password = utils.md5(_user.password);
        delete(_user.checkActualPassword);
        User.update({ _id: _user._id }, _user).exec(function(err, user) {
            if (err) res.status(404).json(err);
            else res.json(_user);
        });
    });
});




/**************************************************************************************************************/
/* GET REQUESTS
/**************************************************************************************************************/
/* GET authentication */
router.get('/', function (req, res) {
    var token = req.headers.authorization;

    if(token != undefined) {
        token = token.split(' ')[1];
    }

    jwt.verify(token, secret, function(err, user) {

    if(err) {
        res.sendStatus(401);
    }
    else {
        User.findOne({username: user.username}).exec(function(err, dbUser) {
            if (err) res.status(404).json(err);
            else res.json({ user: dbUser });
        })
    }
    });
});

/* Get users */
router.get('/users', function(req, res) {
    User.find({}).exec(function(err, users) {
        if (err) res.status(404).json(err);
        else res.json(users);
    });
})

/* Get restrictions */
router.get('/restrictions', function(req, res) {
    Restriction.find({}).exec(function(err, restrictions) {
        if (err) res.status(404).json(err);
        else res.json(restrictions);
    })
})

/* Get restrictions enum */
router.get('/restrictions/enum', function(req, res) {
    res.json(config.restrictions);
})


/**************************************************************************************************************/
/* DELETE REQUESTS
/**************************************************************************************************************/
/* DELETE authentication */
router.delete('/', function(req, res) {
    var token = req.headers.authorization;
    console.log('ok');
    res.sendStatus(200);
});

/* DELETE user */
router.delete('/:id', function(req, res) {
    User.delete(req.params.id, function(err, user) {
        res.json(user);
    });
});

module.exports = router;
