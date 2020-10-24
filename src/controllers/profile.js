import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import path from 'path';
import User from '../models/user';
import Post from '../models/post';
import filterQuery from '../shared/filter.query';

// me
const me = (req, res) => {
  let id;
  try {
    let token = req.headers.authorization.split(' ')[1];
    id = jwt.verify(token, process.env.SECRET).id;
  } catch (e) {
    return res.status(401).send('unauthorized');
  }
  User.findById(id, (error, user) => {
    if (error) {
      res.status(500).send('Error when searching user');
    }
    user._doc['id'] = user._doc['_id'];
    delete user._doc['_id'];
    res.status(200).send(user._doc);
  });
};

// publish new
const publish = (req, res) => {
  let post = new Post();

  let validity = Post.validateData(req.body);

  if (validity) {
    res.status(422).json({ message: validity });
    return;
  }

  post.data.title = req.body.title;
  post.data.text = req.body.text;
  post.data.creationDate = new Date();

  if (req.file) {
    post.data.imageUri = path.join(req.file.destination, req.file.filename);
  }

  post.save((err) => {
    if (err) {
      res.status(500).json({ error: err });
      return;
    }
    res.status(200).json({ success: true, post: post });
  });
};

// load news
const load = (req, res) => {
  Post.find(filterQuery(req.query), (err, data) => {
    if (err) res.status(500).send('Error');
    res.status(200).send(data);
  });
};

// update user
const updateUser = (req, res) => {
  let id = req.params.id;
  let userData = req.body;
  try {
    User.findByIdAndUpdate(
      { _id: new Types.ObjectId(id) },
      userData,
      { new: true, omitUndefined: true },
      (error, result) => {
        if (!error) {
          res.status(200).send(result);
        }
      }
    );
  } catch (exp) {
    res.status(422).send('Error update user');
  }
};

export { me, publish, load, updateUser };
