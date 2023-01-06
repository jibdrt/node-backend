const File = require('../models/file.model');
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const fs = require("fs");

exports.newFile = async (req, res) => {
    console.log(Object.keys(req.files));
    const filekey = Object.keys(req.files)[0];
    try {
        fs.appendFileSync('./uploads/' + req.files[filekey].name, req.files[filekey].data, (err) => {
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
        const newFile =  new File(req.files[filekey]);
        const user = await User.findById({ _id: decoded });

        newFile.posted_by = user;

        await newFile.save();

        /* user.postedFiles.push(newFile._id); */

        // save user
        await user.save();

        const savedFile = await File.findById(newFile._id)

            .populate({
                path: "posted_by",
                select: { _id: 0, username: 1 }
            })

        res.send(savedFile);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

exports.getFiles = async (req, res) => {
    try {
        const files = await File.find({})
            .populate({
                path: "posted_by",
                select: { _id: 0, username: 1 }
            })
        res.send(files);
    } catch (err) {
        console.log(err);
    }
}



exports.downloadFile = async (req, res) => {
    try {
        const thisFile = await File.findOne({ _id: req.params.id });
        console.log(thisFile);
        var path = './uploads/' + thisFile.name;
        console.log(path);
        res.download(path);
    } catch (err) {
        return res.status(500).send(err);
    }
}



exports.deleteFile = async (req, res, next) => {
    try {
        const targetedForDelete = await File.findByIdAndRemove({ _id: req.params.id })
        return res.send(`file ${targetedForDelete} has been deleted`);
    } catch (err) {
        next(err);
    }
}