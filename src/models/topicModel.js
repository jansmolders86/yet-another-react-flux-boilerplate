import mongoose from 'mongoose';

var topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  page: {
    type: String,
    required: true
  }
});

var topicModel = mongoose.model('Topic', topicSchema);

export default topicModel;