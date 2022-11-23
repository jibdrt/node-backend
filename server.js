const express = require("express");
const cors = require("cors");
const app = express();
const dbConfig = require("./app/config/db.config");
const corsOptions = {
  origin: "http://localhost:8081"
};

const fileUpload = require('express-fileupload');

require('dotenv').config();

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
  abortOnLimit: true
}));

app.get("/", (req, res) => {
  res.json({ message: "app running" });
});

const db = require("./app/models");
const Role = db.role;
db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to MongoDB");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });





function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added user to roles");
      });
      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added admin to roles");
      });
    }
  });
}

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/note.routes')(app);
require('./app/routes/file.routes')(app);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});