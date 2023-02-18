const express = require("express");
const cors = require("cors");
var bcrypt = require("bcryptjs");
const app = express();
/* const dbConfig = require("./app/config/db.config"); */
const corsOptions = {
  origin: "http://localhost:8081"
};

const fileUpload = require('express-fileupload');

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
const Role = db.role;
const User = db.user;

db.mongoose
  .connect(`mongodb://${process.env.DBHOST}:${process.env.DBPORT}/${process.env.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to MongoDB");
    setTimeout(() => {
      initial()
        .then(() => {
          console.log("Init completed");
        })
        .catch((error) => {
          console.log("Init error: ", error);
        });
    }, 1000);                                         // Retarder l'exécution de initial de 1 sec
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });


  function initial() {
    return new Promise((resolve, reject) => {
      Role.estimatedDocumentCount((err, count) => {
        if (err) {
          console.error("Error when count roles:", err);
          reject(err);
        } else {
          if (count === 2) {
            let adminRole;
            Role.findOne({ name: "admin" })
              .then((role) => {
                if (role) {
                  adminRole = role;
                  console.log("Found admin role:", role);
                } else {
                  console.log("Admin role not found let's create it");
                  return new Role({
                    name: "admin"
                  }).save();
                }
              })
              .then((createdRole) => {
                adminRole = createdRole || adminRole; // utilise le rôle créé ou celui trouvé
                console.log("Admin role:", adminRole);
                return Promise.all([
                  new Role({
                    name: "user"
                  }).save(),
                  new User({
                    username: "admin",
                    email: "admin@gmail.com",
                    password: bcrypt.hashSync("admin", 8),
                    roles: [adminRole._id]
                  }).save()
                ]);
              })
              .then(() => {
                console.log("Roles and default admin created");
                resolve();
              })
              .catch((error) => {
                console.error("Error when creating roles and user:", error);
                reject(error);
              });
          } else {
            console.log("Number of roles:", count);
            console.log("No need to create roles and user");
            resolve();
          }
        }
      });
    });
  }
  
  
  
  
  
  





/* function findAdminRoleId() {
  return Role.findOne({ name: "admin" })
    .then((role) => {
      if (role) {
        console.log("Found admin role:", role);
        return role._id;
      } else {
        console.log("Admin role not found");
        return null;
      }
    })
    .catch((error) => {
      console.error("Error finding admin role:", error);
      return null;
    });
} */



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