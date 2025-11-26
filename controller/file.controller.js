const FileModel = require("../model/file.model");
const fs = require('fs')

const createFile = async (req, res) => {
    try {
        const file = req.file;
        const payload = {
            path: `${file.destination}${file.filename}`,
            filename: file.filename,
            type: file.mimetype.split("/")[0],
            size: file.size
        }
        const newFile = await FileModel.create(payload);
        res.status(200).json(newFile)

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const fetchFile = async (req, res) => {
    try {
        const files = await FileModel.find();
        res.status(200).json(files);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const deleteFile = async (req, res) => {
    try {
        const { id } = req.params;
        const file = await FileModel.findByIdAndDelete(id);

        if (!file) {
            return res.status(404).json({ message: "File not found" })
        }

        fs.unlinkSync(file.path)
        res.status(200).json(file);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = {
    createFile,
    fetchFile,
    deleteFile
}