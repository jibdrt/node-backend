const { authJwt } = require("../middleware");
const controller = require('../controllers/picture.controller');

module.exports = function (app) {
    app.post('/api/profil/picture', [authJwt.verifyToken], controller.uploadPic);
    app.get('/api/profil/picture', controller.getPic);
    app.get('/api/profil/picture/:id', controller.getUserPicture);
    app.delete('/api/profil/picture/:id', controller.deletePicture);
    }