const { authJwt } = require("../middleware");
const controller = require('../controllers/file.controller');

module.exports = function (app) {

    app.get('/api/files', [authJwt.verifyToken], controller.getFiles);
    app.get('/api/files/:id', [authJwt.verifyToken], controller.readFile);
    app.post('/api/files', [authJwt.verifyToken], controller.newFile);
    app.delete('/api/files/:id', [authJwt.verifyToken], controller.deleteFile);
    app.get('/api/files/:id', controller.downloadFile);
}