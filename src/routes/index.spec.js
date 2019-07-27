import User from '../models/User';

import chai from 'chai';
import chaiHttp from 'chai-http';
import APP from '../app';

let expect = require('chai').expect

chai.use(chaiHttp);
describe('Users', () => {
  beforeEach(done => {
    // User.remove({}, err => {
    //   done();
    // });
  });
 
  describe('/GET test', () => {
    it('it should GET test success', done => {
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
});
