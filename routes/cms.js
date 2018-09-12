var express = require('express');
var router = express.Router();

/* GET CMS listing. */
router.get('/', function(req,res){
    res.render('cms/index');
  });

module.exports = router;