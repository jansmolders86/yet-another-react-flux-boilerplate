import mongoose from 'mongoose';

var itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    index:true
  },
  itemImage: {
    type: String,
    required: false
  }
});

var itemModel = mongoose.model('Item', itemSchema);

export default itemModel;