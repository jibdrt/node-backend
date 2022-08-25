const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept, Authorization"
    );
    next();
  });
  app.get("/api/profil/all", controller.allAccess);
  app.get("/api/profil/user", [authJwt.verifyToken], controller.userBoard);
  app.get(
    "/api/profil/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
  app.delete("/api/profil/:id", controller.deleteOneUser);
  app.post("/api/notes/", controller.newUserNote);
};