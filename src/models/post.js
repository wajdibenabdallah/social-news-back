import mongoose from 'mongoose';

const Post = mongoose.model(
  'Post',
  new mongoose.Schema({
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    data: {
      title: String,
      text: String,
      imageUri: String,
      creationDate: Date
    }
  })
);

Post.isValid = data => {
  data = JSON.parse(JSON.stringify(data));
  if (data.hasOwnProperty('title') && data.title.length === 0) {
    return false;
  }
  if (data.hasOwnProperty('text') && data.title.text === 0) {
    return false;
  }
  if (data.hasOwnProperty('image') && data.image.length === 0) {
    return false;
  }
  return true;
};

export default Post;
