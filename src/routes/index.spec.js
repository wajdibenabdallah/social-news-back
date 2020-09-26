import User from '../models/user';
import Post from '../models/post';

import chai from 'chai';
import chaiHttp from 'chai-http';
import APP from '../app';

let expect = require('chai').expect;

chai.use(chaiHttp);

let token;
let agent;

describe('API: User/Post', () => {
  const _user = {
      email: 'test1@gmail.com',
      password: 'aaaaaaaa',
      firstname: 'useruser',
      lastname: 'useruser',
      passwordConfirm: 'aaaaaaaa',
      phone: '+33611762907',
    },
    wrongEmail = 'test2@gmail.com',
    wrongPassword = 'test2';

  before((done) => {
    agent = chai.request.agent(APP);
    User.deleteMany({}, (err) => {
      done(err);
    });
  });

  after((done) => {
    agent.close();
    done();
  });

  describe('Test', () => {
    it('it /api/test', (done) => {
      agent.get('/api/test').end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.result).to.be.true;
        done();
      });
    });
  });

  describe('Register, Login, Logout', () => {
    it('it /api/register', (done) => {
      agent
        .post('/api/register')
        .send(_user)
        .then((data) => {
          expect(data.body).to.have.property('token');
          expect(data.body).to.have.property('user');
          expect(data.statusCode).to.be.equal(200);
          done();
        })
        .catch((error) => done(error));
    });
    it('it /api/login: Success', (done) => {
      agent
        .post('/api/login')
        .send(_user)
        .then((data) => {
          expect(data.body).to.have.property('token');
          expect(data.statusCode).to.be.equal(200);
          token = data.body.token;
          done();
        })
        .catch((error) => done(error));
    });
    it('it /api/login: failure: Password is wrong', (done) => {
      agent
        .post('/api/login')
        .send({
          ..._user,
          password: wrongPassword,
        })
        .then((data) => {
          expect(data.body.info).to.have.property('message');
          expect(data.body.info.message).to.be.equal('Password is wrong');
          expect(data.statusCode).to.be.equal(401);
          done();
        })
        .catch((error) => done(error));
    });
    it('it /api/login: failure: User not found', (done) => {
      agent
        .post('/api/login')
        .send({
          ..._user,
          email: wrongEmail,
        })
        .then((data) => {
          expect(data.body.info).to.have.property('message');
          expect(data.body.info.message).to.be.equal('User not found');
          expect(data.statusCode).to.be.equal(401);
          done();
        })
        .catch((error) => done(error));
    });
    it('it is authenticated after login', (done) => {
      agent
        .get('/api/me')
        .set('authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res).to.have.status(200);
          done();
        })
        .catch((error) => done(error));
    });
    it('it /api/login: should logout', (done) => {
      agent
        .post('/api/logout')
        .then((res) => {
          expect(res).to.have.status(200);
          done();
        })
        .catch((error) => done(error));
    });
    it('it /api/me: should get user information', (done) => {
      agent
        .get('/api/me')
        .set('authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('_id');
          expect(res.body).to.have.property('email');
          expect(res.body).to.have.property('exp');
          expect(res.body).to.have.property('iat');
          done();
        })
        .catch((error) => done(error));
    });
    it('it /api/register: should fail if data are invalid (firstname)', (done) => {
      agent
        .post('/api/register')
        .send({
          ..._user,
          firstname: 'azdkd,sd',
        })
        .then((res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Firstname invalid');
          done();
        })
        .catch((error) => done(error));
    });
    it('it /api/register: should fail if data are invalid (lastname)', (done) => {
      agent
        .post('/api/register')
        .send({
          ..._user,
          lastname: 'azdk dsd',
        })
        .then((res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Lastname invalid');
          done();
        })
        .catch((error) => done(error));
    });
    it('it /api/register: should fail if data are invalid (phone)', (done) => {
      agent
        .post('/api/register')
        .send({
          ..._user,
          phone: '267823',
        })
        .then((res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Phone invalid');
          done();
        })
        .catch((error) => done(error));
    });
    it('it /api/register: should fail if data are invalid (email)', (done) => {
      agent
        .post('/api/register')
        .send({
          ..._user,
          email: 'azdkdsd@z.c',
        })
        .then((res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Email invalid');
          done();
        })
        .catch((error) => done(error));
    });
    it('it /api/register: should fail if data are invalid (password)', (done) => {
      agent
        .post('/api/register')
        .send({
          ..._user,
          password: 'aaaaaaa',
        })
        .then((res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Password invalid');
          done();
        })
        .catch((error) => done(error));
    });
    it('it /api/register: should fail if data are invalid (confirmPassword)', (done) => {
      agent
        .post('/api/register')
        .send({
          ..._user,
          password: 'aaaaaaaa',
          passwordConfirm: 'aaaaaa',
        })
        .then((res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Password confirmation invalid');
          done();
        })
        .catch((error) => done(error));
    });
  });
  describe('Post', () => {
    const _post = {
      title: 'Title',
      text: `aaaaaaaaaaaaaaaaaaaa
        aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        aaaaaaaaaaaaaaaaaaaaaaaaa`,
    };

    before((done) => {
      agent = chai.request.agent(APP);
      Post.deleteMany({}, (err) => {
        done(err);
      });
    });

    after((done) => {
      agent.close();
      done();
    });

    it('it /api/post: Should create a post', (done) => {
      agent
        .post('/api/post')
        .set('authorization', `Bearer ${token}`)
        .send(_post)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.success).to.be.true;
          done();
        });
    });
    it('it /api/post: Creating post should be failed (Title invalid) ', (done) => {
      agent
        .post('/api/post')
        .set('authorization', `Bearer ${token}`)
        .send({
          ..._post,
          title: '',
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(422);
          expect(res.body.message).to.be.equal('Title invalid');
          done();
        });
    });
    it('it /api/post: Creating post should be failed (Text invalid) ', (done) => {
      agent
        .post('/api/post')
        .set('authorization', `Bearer ${token}`)
        .send({
          ..._post,
          text: 'Text length low than 50',
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(422);
          expect(res.body.message).to.be.equal('Text invalid');
          done();
        });
    });
    it("it /api/post: Shouldn't create post if user is not authorized", (done) => {
      agent
        .post('/api/post')
        .send(_post)
        .end((err, res) => {
          expect(res.statusCode).to.equal(403);
          expect(res.body.message).to.be.equal('isNotAuthenticated');
          done();
        });
    });
  });
});
