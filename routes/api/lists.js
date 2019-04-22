var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Lists = require('../../models/lists');

/* GET lists listing. */
router.get('/', function(req, res){

  Lists.find({},function(err, lists){

    if(err){
      return res.json({'success':false, 'error': err});
    }

    return res.json({'success':true, 'lists': lists});

  });

});

/* GET a single list. */
router.get('/:id', function(req,res){

  var id = req.params.id;

  Lists.findOne({'_id':id}, function(err, list){

    if(err){
      return res.json({'success':false, 'error': err});
    }

    return res.json({'success':true, 'list': list});

  });

});

//Create a list
router.post('/', function(req, res) {

  //On create we will only save a title. Model lifecycle hooks and the update
  //method will be used for completing the list
  Lists.create(new Lists({
    title: req.body.title,
    note: req.body.note
//    published: req.body.date
  }), function(err, list){
    if(err){
      return res.json({success: false, list: req.body, error: err});
    }

    return res.json({success: true, list: list});
  });

});

//Update a list
router.put('/', function(req, res){

  Lists.findOne({_id: req.body._id}, function(err, list){

    // If list._id cannot be found throw an error
    if(err) {
      return res.json({success: false, error: err});
    }

    // if list._id is found update the record
    if(list){
      let data = req.body;

      //if a value is passed update it
      if(data.title){
        list.title = data.title;
      }
      if(data.note){
        list.note = data.note;
      }
//      if(data.published){
//        list.published = data.published;
//      }

      //For the sake of readability, Create a save function, call this after 
      //processing all input
      list.save(function(err){
        if(err){
          return res.json({success: false, error: err});
//          return res.json({success: false, error: "err"});
//          console.log('findOne error occurred');
        }else{
          return res.json({success: true, list: list});
        }
      });
    }else{
      }
    });

})//Delete a single list
router.delete('/:listId', function(req,res){
console.log("any")
  var listId = req.params.listId;

  Lists.remove({'_id':listId}, function(err,removed){
    if(err){
      return res.json({success: false, error: err});
    }

    return res.json({success: true, status: removed});

  });
});

module.exports = router;
