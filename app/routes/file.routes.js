const { authJwt } = require("../middleware");
const controller = require('../controllers/file.controller');

module.exports = function (app) {

    app.get('/api/files', controller.getFiles);
    app.post('/api/files', [authJwt.verifyToken], controller.newFile);
    app.delete('/api/files', [authJwt.verifyToken], controller.deleteFile);
}