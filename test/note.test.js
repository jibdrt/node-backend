const app = require('../server');
const chai = require('chai');
const chaihttp = require('chai-http');
const Note = require('../app/models/note.model');

chai.should();
chai.use(chaihttp);

describe('Get notes', () => {
    it('GET /api/notes', (done) => {
        chai.request(app)
            .get('/api/notes')
            .end((err, res) => {
                if (err) done(err);
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });
});