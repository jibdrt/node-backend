const File = require('../models/file.model');
const fs = require("fs");

exports.newFile = async (req, res) => {
    const files = req.files;
    try {
        fs.appendFileSync('./uploads/' + req.files.file.name, req.files.file.data, (err) => {
            if (err) {
                console.log(err);
            }
        });
        const newFile = await new File(req.files.file);
        const savedFile = await newFile.save();
        res.send(savedFile);
    } catch (err) {
        console.log(err);
    }
}