
const controller = require("../controllers/note.controller");
module.exports = function(app) {
    app.post("/api/notes", controller.postnotes);
    app.get("/api/notes", controller.getAllNotes);
    app.get("/api/notes/:id", controller.getOneNote);
    app.delete("/api/notes/:id", controller.deleteOneNote);
}