const express = require("express");
const cors = require("cors");
const app = express();
const dbConfig = require("./app/config/db.config");
const corsOptions = {
  origin: "http://localhost:8081"
};

const fileUpload = require('express-fileupload');

/* console.log(process.env.NODE_ENV); */
if (process.env.NODE_ENV) {
  require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
} else {
  require('dotenv').config();
}


app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
  abortOnLimit: true
}));

app.get("/", (req, res) => {
  res.status(200).json({ message: 'app running' });
});

const db = require("./app/models");
const User = require("./app/models/user.model");
const Role = db.role;

console.log(dbConfig);
db.mongoose
  .connect(`mongodb://${process.env.DBHOST}:${process.env.DBPORT}/${process.env.DB}`, {
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


  User.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new User({
        username: "admin",
        email: "admin@gmail.com",
        password: "admin",
        roles: ["admin"]
      }).save(err => {
        if (err) {
          if (err) {
            console.log("error", err);
          }
          console.log("admin account created");
        }
      })
    }
  })
};

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/note.routes')(app);
require('./app/routes/file.routes')(app);
require('./app/routes/picture.routes')(app);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});

module.exports = app;