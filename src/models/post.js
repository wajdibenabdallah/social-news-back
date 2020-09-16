import mongoose from 'mongoose';

let postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  data: {
    title: String,
    text: String,
    image: String,
    creationDate: Date
  }
});

postSchema.methods.isValid = data => {
  if (data.hasOwnProperty('title') && data.title.length === 0) {
    return false;
  }
  if (data.hasOwnProperty('text') && data.title.text === 0) {
    return false;
  }
  if (data.hasOwnProperty('image') && data.image.length === 0) {
    return false;
  }
  if (data.hasOwnProperty('creationDate') && data.creationDate.length === 0) {
    return false;
  }
  return true;
};

export default mongoose.model('Post', postSchema);
