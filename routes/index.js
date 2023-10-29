let express = require('express');
let router = express.Router();
let config = require('../config')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({
    message: 'alive',
    token: config.clickupToken
  });
});

module.exports = router;
