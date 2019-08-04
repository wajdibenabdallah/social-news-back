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
let token;

describe('API: Users', () => {
  let agent;
  before(done => {
    agent = chai.request.agent(APP);
    User.deleteMany({}, err => {
      done();
    });
  });

  after(done => {
    agent.close();
    done();
  });

  describe('Test', () => {
    it('it /api/test', done => {
      agent.get('/api/test').end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.result).to.be.true;
        done();
      });
    });
  });

  describe('Register, Login, Logout', () => {
    it('it /api/register', done => {
      agent
        .post('/api/register')
        .send(_user)
        .then(data => {
          expect(data.body).to.have.property('token');
          expect(data.body).to.have.property('user');
          expect(data.statusCode).to.be.equal(200);
          done();
        })
        .catch(error => done(error));
    });
    it('it /api/login: Success', done => {
      agent
        .post('/api/login')
        .send(_user)
        .then(data => {
          expect(data.body).to.have.property('token');
          expect(data.statusCode).to.be.equal(200);
          token = data.body.token;
          done();
        })
        .catch(error => done(error));
    });
    it('it /api/login: failure: Password is wrong', done => {
      agent
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
    it('it /api/login: failure: User not found', done => {
      agent
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
    it('it is authenticated after login', done => {
      agent
        .get('/api/me')
        .then(res => {
          expect(res).to.have.status(200);
          done();
        })
        .catch(error => done(error));
    });
    it('it is not authenticated after logout', done => {
      agent
        .post('/api/logout')
        .then(() => {
          agent
            .get('/api/me')
            .then(res => {
              expect(res).to.have.status(403);
              done();
            })
            .catch(error => done(error));
        })
        .catch(error => done(error));
    });
  });
});
