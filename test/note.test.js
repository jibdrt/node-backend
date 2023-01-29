const app = require('../server');
const chai = require('chai');
const chaihttp = require('chai-http');
const User = require('../app/models/user.model');
const Note = require('../app/models/note.model');


chai.should();
chai.use(chaihttp);


// Create default user before all tests

before('create users in collection before tests', (done) => {
    console.log('create users in collection before tests');
    const user = new User({ username: "johndoe", email: "johndoe@gmail.com", password: "password", roles: ["user"] });
    chai.request(app)
        .post('/api/auth/signup')
        .send(user)
        .end((err, res) => {
            if (err) done(err);
            console.log('default user created');
            done();
        });
});

// Drop user collection after tests

after('drop user collection after tests', (done) => {
    console.log('drop user collection after test');
    User.deleteMany({}, done());
});

// Get users without auth

describe('get list of users without authentication', () => {
    it('GET /profil/all should return list of users', (done) => {
        chai.request(app)
            .get('/api/profil/all')
            .end((err, res) => {
                if (err) done(err);
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            })
    });
});

// Register with new user

describe('Perform signup', () => {
    it('POST /signup', (done) => {
        const user = { username: "testuser", email: "testuser@gmail.com", password: "password", roles: ["admin"] };
        chai.request(app)
            .post('/api/auth/signup')
            .send(user)
            .end((err, res) => {
                if (err) done(err);
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });
});

// Login with the new account

describe('Perform login', () => {

    it('POST /signin', (done) => {
        chai.request(app)
            .post('/api/auth/signin')
            .send({
                username: "testuser",
                password: "password"
            })
            .end((err, res) => {

                if (err) done(err);
                res.body.should.have.property('accessToken');
                const token = res.body.accessToken;
                done();

                // Post new note

                describe('Perform post new note', () => {
                    it('POST /api/notes', (done) => {
                        const note = new Note({ title: "hello", content: "world", deadline: "2023-05-18T08:34:40+00:00", color: "red", participants: []});
                        chai.request(app)
                            .post('/api/notes')
                            .set('x-access-token', token)
                            .send(note)
                            .end(function (err, res) {
                                if (err) done(err);
                                res.should.have.status(201);
                                res.body.should.be.a('object');
                                res.body.should.have.property('title');
                                res.body.should.have.property('content');
                                res.body.should.have.property('creator');
                                res.body.should.have.property('participants');
                                done();
                            })
                    });
                });

/*                 describe('Perform update password', () => {
                    it('GET /api/profil/user/changepassword', (done) => {
                        const updatepassword = { currentPassword: "password", newPassword: "newpassword", confirmNewPassword: "newpassword" };
                        chai.request(app)
                            .patch('/api/profil/user/changepassword')
                            .set('x-access-token', token)
                            .send(updatepassword)
                            .end(function (err, res) {
                                console.log(err);
                                if(err) done (err);
                                res.should.have.status(201);
                                done();
                            })
                    })
                }) */

                // Get admin board by passing the token

                describe('Perform get admin board with token', () => {
                    it('GET /admin/all', (done) => {
                        chai.request(app)
                            .get('/api/admin')
                            .set('x-access-token', token)
                            .end(function (err, res) {
                                if (err) done(err);
                                res.should.have.status(200);
                                res.body.should.be.a('array');
                                done();
                            })
                    })
                })
                
            });
    });
});



