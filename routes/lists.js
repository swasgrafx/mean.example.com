var express = require('express');
var router = express.Router();
var Lists = require('../models/lists');

/* GET lists listing. */
router.get('/', function(req, res){

  Lists.find({},function(err, lists){

    if(err){
      return res.send('Error');
  }

    res.render('lists/index', {lists: lists});

  });

});

/* GET a single list. */
router.get('/:id', function(req,res){

  var id = req.params.id;

  Lists.findOne({'id':id}, function(err, list){

    if(err){
      return res.send('Error');
    }

    res.render('lists/view', {list: list});

  });

});

router.get('/:id', function(req, res){
  res.render('lists/view');
});

module.exports = router;