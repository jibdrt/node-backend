
const controller = require ('../controllers/file.controller');
module.exports = function (app) {
    app.post('/api/files', controller.newFile);
}