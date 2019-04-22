var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  uniqueValidator = require('mongoose-unique-validator');

//Create a schema
var Lists = new Schema({
  title: {
    type: String,
    required: [true, 'Please enter a title'],
    unique: [true, 'Title is already in use']
  },
  note: String,
//  published: {
//    type: Date
    //required: [true, 'Please enter a pub date'],
//  }
});

//Auto set the modified date prior to save
/*Lists.pre('save', function(next){
  this.modified = new Date().toISOString();
  next();
});
*/
Lists.plugin(uniqueValidator);

module.exports  = mongoose.model('Lists', Lists);