import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import path from 'path';
import User from '../models/user';
import Post from '../models/publication';
import filterQuery from '../shared/filter.query';

// me
const me = (req, res) => {
  let id;
  try {
    let token = req.headers.authorization.split(' ')[1];
    id = jwt.verify(token, process.env.SECRET).id;
  } catch (e) {
    res.status(401).send('unauthorized');
    return;
  }
  User.findById(id)
    .select('-password')
    .exec((error, user) => {
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
  try {
    let post = new Post({
      title: req.body.title,
      text: req.body.text,
      imageUri: req.file
        ? path.join(req.file.destination, req.file.filename)
        : '',
    });

    post.save((err) => {
      if (err) {
        res.status(500).json({ error: err });
        return;
      }
      res.status(200).json({ success: true, post: post });
    });
  } catch (e) {
    res.status(500).json({ error: `Publish: Unknown error` });
  }
};

// load news
const load = (req, res) => {
  try {
    Post.find(filterQuery(req.query), (err, data) => {
      if (err) res.status(500).send('Error');
      res.status(200).send(data);
    });
  } catch (e) {
    res.status(500).json({ error: `Load: Unknown error` });
  }
};

// update user
const updateUser = (req, res) => {
  try {
    let id = req.params.id;
    let userData = req.body;
    User.findByIdAndUpdate(
      { _id: new Types.ObjectId(id) },
      userData,
      { new: true, omitUndefined: true },
      (error, user) => {
        if (error) {
          res.status(500).send(error);
        }
        res.status(200).send(`user has been updated successfully`);
      }
    );
  } catch (e) {
    res.status(500).json({ error: `updateUser: Unknown error` });
  }
};

export { me, publish, load, updateUser };
