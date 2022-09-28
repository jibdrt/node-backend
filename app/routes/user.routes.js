const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept, Authorization"
    );
    next();
  });
  app.get("/api/profil/all", controller.userList);
  app.get("/api/profil/user", [authJwt.verifyToken], controller.userBoard);
  app.patch("/api/profil/user", [authJwt.verifyToken], controller.editProfil);
  app.get("/api/profil/admin", [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard);
  app.delete("/api/profil/all/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteOneUser);
  app.get('/api/profil/all/:id', [authJwt.verifyToken, authJwt.isAdmin], controller.userDetail);
};