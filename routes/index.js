var express = require('express');
var router = express.Router();

var User = require('../models/access').User;

// User creation example
// TODO Delete for prod
router.get('/create', function(req, res) {

  new User({

    username: 'admin',
    password: require('crypto').createHash('md5').update('admin').digest('hex'),
    email: 'admin@admin.com',
    restrictions: [0, 1, 2, 3, 4]
  }).save(function(err, user) {
      if(err) res.status(500).send(err);
      else res.sendStatus(200);
  });

});

module.exports = router;
