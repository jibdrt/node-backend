const { authJwt } = require("../middleware");
const controller = require("../controllers/note.controller");

module.exports = function (app) {
 
    app.get("/api/notes", controller.getAllNotes);
    app.get("/api/notes/:id", controller.getOneNote);
    app.post("/api/notes", [authJwt.verifyToken], controller.newNote);
    app.patch("/api/notes/:id", [authJwt.verifyToken], controller.updateOneNote);
    app.delete("/api/notes/:id", [authJwt.verifyToken], controller.deleteOneNote);
}