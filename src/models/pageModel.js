var mongoose = require( 'mongoose' );

var pageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  view: {
    type: String,
    required: true
  },
  urlkey: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Page', pageSchema);
//exports.getPages = function() {
//    return pageModel.find().exec();
//}