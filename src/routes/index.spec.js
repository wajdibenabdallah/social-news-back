import User from '../models/User';
import chai from 'chai';
import chaiHttp from 'chai-http';
import APP from '../app';

let expect = require('chai').expect;

chai.use(chaiHttp);

const _user = {
    email: 'test1@gmail.com',
    password: 'test1'
  },
  wrongEmail = 'test2@gmail.com',
  wrongPassword = 'test2';

describe('API: Users', () => {
  let server;
  before(done => {
    server = chai.request(APP).keepOpen();
    User.deleteMany({}, err => {
      done();
    });
  });

  after(done => {
    server.close();
    done();
  });

  describe('Test', () => {
    it('it /api/test', done => {
      chai
        .request(APP)
        .get('/api/test')
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.text).to.equal('success ...');
          done();
        });
    });
  });

  describe('Register, Login, Logout', () => {
    it('it /api/register then /api/login: success', done => {
      Promise.all([
        server.post('/api/register').send(_user),
        server.post('/api/login').send(_user)
      ])
        .then(data => {
          expect(data[0].body).to.have.property('token');
          expect(data[0].body).to.have.property('user');
          expect(data[0].statusCode).to.be.equal(200);
          expect(data[1].body).to.have.property('token');
          expect(data[1].statusCode).to.be.equal(200);
          done();
        })
        .catch(error => done(error));
    });
    it('it /api/register then /api/login: failure: Password is wrong', done => {
      server
        .post('/api/login')
        .send({
          ..._user,
          password: wrongPassword
        })

        .then(data => {
          expect(data.body.info).to.have.property('message');
          expect(data.body.info.message).to.be.equal('Password is wrong');
          expect(data.statusCode).to.be.equal(401);
          done();
        })
        .catch(error => done(error));
    });
    it('it /api/register then /api/login: failure: User not found', done => {
      server
        .post('/api/login')
        .send({
          ..._user,
          email: wrongEmail
        })
        .then(data => {
          expect(data.body.info).to.have.property('message');
          expect(data.body.info.message).to.be.equal('User not found');
          expect(data.statusCode).to.be.equal(401);
          done();
        })
        .catch(error => done(error));
    });
    it('it isAuthenticated is true after login, false after logout', done => {
      server
        .post('/api/login')
        .send(_user)
        .then(data => {
          console.log(data.body.token)
          server
            .get('/api/me')
            .then(res => {
              expect(res).to.have.status(200);
              expect(res.body.isAuthenticated).to.be.true;
              done();
            })
            .catch(error => done(error));
        })
        .catch(error => done(error));
    });
  });
});
