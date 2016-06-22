import mongoose from 'mongoose';

var mediaSchema = new mongoose.Schema({
  video: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  item: {
    type: String,
    required: true
  }
});

var mediaModel = mongoose.model('Media', itemSchema);

export default itemModel;