const Picture = require("../models/picture.model");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const fs = require("fs");


exports.uploadPic = async (req, res) => {
    console.log(Object.keys(req.files));
    const filekey = Object.keys(req.files)[0];
    try {
        fs.appendFileSync('./uploads/profilpictures/' + req.files[filekey].name, req.files[filekey].data, (err) => {
            if (err) {
                console.log(err);
            }
        });
        const token = req.headers["x-access-token"];
        const decoded = jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.status(401).send({ message: "Unauthorized" });
            }
            req.userId = decoded.id;
            return req.userId;
        });
        const picture = new Picture(req.files[filekey]);
        const user = await User.findById({ _id: decoded });

        picture.user = user;

        await picture.save();

        user.picture.push(
            { $push: { picture: picture._id, $slice: -1 }}
        )

        await user.save();

        const uploadedPicture = await Picture.findById(picture._id)

            .populate({
                path: "user",
                select: { _id: 0, username: 1 }
            });

        res.status(200).send(uploadedPicture);

    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}



/* exports.getPic = async (req, res) => {
    try {
        const picture = await Picture.findById(req.params.id);
        res.status(200).send(picture);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
} */