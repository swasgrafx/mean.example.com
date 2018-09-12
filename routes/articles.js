var express = require('express');
var router = express.Router();
var Articles = require('../models/articles');

/* GET articles listing. */
router.get('/', function(req, res){

  Articles.find({},function(err, articles){

    if(err){
      return res.send('Error');
  }

    res.render('articles/index', {articles: articles});

  });

});

/* GET a single article. */
router.get('/:slug', function(req,res){

  var slug = req.params.slug;

  Articles.findOne({'slug':slug}, function(err, article){

    if(err){
      return res.send('Error');
    }

    res.render('articles/view', {article: article});

  });

});

router.get('/:slug', function(req, res){
  res.render('articles/view');
});

module.exports = router;