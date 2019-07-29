import User from '../models/User';
import chai from 'chai';
import chaiHttp from 'chai-http';
import APP from '../app';

let expect = require('chai').expect;

chai.use(chaiHttp);
describe('API: Users', () => {
  before(done => {
    User.deleteMany({}, err => {
      done();
    });
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

  describe('Register and Login', () => {
    const email1 = 'test1@gmail.com',
      email2 = 'test2@gmail.com',
      password1 = 'test1',
      password2 = 'test2',
      _user = {
        email: email1,
        password: password1
      };
    it('it /api/register then /api/login: success', done => {
      let server = chai.request(APP);
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
      let server = chai.request(APP);
      server
        .post('/api/login')
        .send({
          ..._user,
          password: password2
        })

        .then(data => {
          expect(data.body).to.have.property('message');
          expect(data.body.message).to.be.equal('Password is wrong');
          expect(data.statusCode).to.be.equal(401);
          done();
        })
        .catch(error => done(error));
    });
    it('it /api/register then /api/login: failure: User not found', done => {
      let server = chai.request(APP);
      server
        .post('/api/login')
        .send({
          ..._user,
          email: email2
        })

        .then(data => {
          expect(data.body).to.have.property('message');
          expect(data.body.message).to.be.equal('User not found');
          expect(data.statusCode).to.be.equal(401);
          done();
        })
        .catch(error => done(error));
    });
  });
});
