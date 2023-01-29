const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
db.user = require("./user.model");
db.role = require("./role.model");
db.note = require("./note.model");
db.file = require("./file.model");
db.picture = require("./picture.model");
db.ROLES = ["user", "admin"];
module.exports = db;