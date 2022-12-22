const app = require('../server');
const chai = require('chai');
const chaihttp = require('chai-http');
const User = require('../app/models/user.model');


chai.should();
chai.use(chaihttp);


before('create users in collection before tests', (done) => {
    console.log('create users in collection before tests');
    const user = new User({ username: "pierre", email: "pierre@gmail.com", password: "password", roles: ["user"] });
    chai.request(app)
    .post('/api/auth/signup')
    .send(user)
    .end((err, res) => {
        if (err) done(err);
        console.log('default user created');
        done();
    });
});


after('drop user collection after tests', (done) => {
    console.log('drop user collection after test');
    User.deleteMany({}, done)
});



describe('User', () => {

    it('POST /signup', (done) => {
        const user = { username: "hervé", email: "hervé@gmail.com", password: "hervé", roles: ["user"] };
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

    it('POST /signin', (done) => {
        chai.request(app)
            .post('/api/auth/signin')
            .send({
                username: "hervé",
                password: "hervé"
            })
            .end((err, res) => {
                if (err) done(err);
                /*                 console.log('login should return token'); */
                res.body.should.have.property('accessToken');
                /*                 console.log(res.body.accessToken); */
                const token = res.body.accessToken;
                done();
                it('GET /profil/user with the token', (done) => {
                    chai.request(app)
                        .get('/api/profil/user')
                        .set('x-access-token', token)
                        .end(function (err, res) {
                            if (err) done(err);
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            done();
                        })
                })
            })
    });


















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

    /*     it('GET /profil/all/:id should return user object', (done) => {
            const user = new User({ username: "john", email: "johndoe@gmail.com", password: "pass" });
            console.log(user.id)
            user.save((err, user) => {
                chai.request(app)
                    .get('/api/profil/user')
                    .send(user)
                    .end((err, res) => {
                        if (err) done(err);
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('username');
                        res.body.should.have.property('email');
                        res.body.should.have.property('password');
                    })
            })
    
        }); */
})


