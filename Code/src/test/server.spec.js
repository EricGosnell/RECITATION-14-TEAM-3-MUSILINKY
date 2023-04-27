// Imports the index.js file to be tested.
const server = require('../index'); //TO-DO Make sure the path to your index.js is correctly added
// Importing libraries

// Chai HTTP provides an interface for live integration testing of the API's.
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const {assert, expect} = chai;

describe('Server!', () => {
  // Sample test case given to test / endpoint.
  it('Returns the default welcome message', done => {
    chai
      .request(server)
      .get('/welcome')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        assert.strictEqual(res.body.message, 'Welcome!');
        done();
      });
  });

  // ===========================================================================
  // TO-DO: Part A Login unit test case
    it('positive : /register', done => {
        chai
            .request(server)
            .post('/register')
            .send({username: 'name', password: 'pass'})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.message).to.equals('Successfully registered');
                done();
            });
    });

    it('Negative : /login', done => {
        chai
            .request(server)
            .get('/login')
            .send({username: 'invalid_user', password:'invalid_password'})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.message).to.equals('Invalid username or password');
                done();
            });
    });
});

//   // ===================================================
//   // Deezer API Positive Test Case
  it('positive : /search', done => {
  chai
    .request(server)
    .get('/search')
    .query({search_query: 'Test Query'})
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body.message).to.equals('Successfully retrieved data');
      done();
    });
});

// ========================================================
// MUSALINK API Negative Test Case 
it('Negative : /MUSALINK', done => {
  chai
    .request(server)
    .get('/MUSALINK')
    .query({musalink_query: 'https://open.spotify.com/track/random'})
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body.message_1).to.equals('Could not retrieve links. Please enter a valid URL.');
      done();
    });
});
