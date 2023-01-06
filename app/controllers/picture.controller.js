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

        const newPicture = new Picture(req.files[filekey]);
        
        const user = await User.findByIdAndUpdate(
            { _id: decoded },
            { $set: { picture: newPicture._id } }
        );

        newPicture.user = user;

        await newPicture.save();

        user.picture.push(newPicture._id);

        await user.save();


        const uploadedPicture = await Picture.findById(newPicture._id)

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



exports.getPic = async (req, res) => {
    try {
        const pictures = await Picture.find({})
        .populate({
            path: "user",
            select: { _id: 0, username: 1 }
        });
        
        res.status(200).send(pictures);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

exports.getUserPicture = async (req, res) => {
    try {
        const Userpicture = await Picture.findOne({ _id: req.params.id });
        console.log(Userpicture);
        var path = './uploads/profilpictures/' + Userpicture.name;
        res.download(path);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}


exports.deletePicture = async (req, res, next) => {
    try {

        const pictureId = req.params.id;

        const targetedForDelete = await Picture.findByIdAndRemove({ _id: pictureId });

        const Userpicture = await User.findOneAndUpdate(
            { picture: pictureId },
            { $unset: { picture: '' } }
        );

        res.send(`note ${targetedForDelete.id} has been deleted and his ${Userpicture.id}`);
    } catch (err) {
        next(err);
    }
}