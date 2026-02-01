const path = require("path");
const FileModel = require("../model/file.model");
const fs = require('fs');
const { error } = require("console");


const getType = (type) => {
    const ext = type.split("/").pop()
    if (ext === "x-msdownload") {
        return "application/exe"
    }
    return type;
}


const createFile = async (req, res) => {
    try {
        const file = req.file;
        const { filename } = req.body;

        const payload = {
            path: `${file.destination}${file.filename}`,
            filename: filename,
            type: getType(file.mimetype),
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





const downloadFile = async (req, res) => {
    try {
        const { id } = req.params;
        const file = await FileModel.findById(id);
        const ext = file.type.split("/").pop();

        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }

        const rootpath = process.cwd();
        const filepath = path.join(rootpath, file.path);
        // force to dwload below line
        res.setHeader('Content-Disposition', `attachment; filename="${file.filename}.${ext}"`);;
        res.sendFile(filepath, (error) => {
            if (error) {
                res.status(404).json({ message: "File not found failed !" });

            }
        });


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = {
    createFile,
    fetchFile,
    deleteFile,
    downloadFile
}