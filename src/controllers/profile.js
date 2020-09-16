import mongoose from 'mongoose';
import { Post } from '../models/post';

// me
const me = (req, res) => {
  res.json(req.user[0]);
};

const publish = (req, res) => {
  let Post = mongoose.model('Post');
  let post = new Post();
  if (!post.isValid(req.body)) {
    res.status(400).json('Données invalide');
    return;
  }

  post.data.title = req.body.title;
  post.data.text = req.body.text;
  post.data.image = req.body.image;
  post.data.creationDate = req.body.creationDate;

  post.save(err => {
    if (err) {
      res.status(500).json({ error: err });
      return;
    }
    res.status(200).json({ success: true, post: post });
  });
};

const load = (req, res) => {
  let Post = mongoose.model('Post');
  
  Post.find({}, (err, data) => {
    if (err)
      res.status(500).send('Error');
    res.status(200).send(data);
  })
}

export { me, publish, load };
