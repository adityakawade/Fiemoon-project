const dotenv = require('dotenv');
dotenv.config()

const mongoose = require('mongoose');
mongoose.connect(process.env.DB);

const express = require('express');
const { v4: uniqueId } = require('uuid')

const multer = require("multer");

const storage = multer.diskStorage({

    destination: (req, file, next) => {
        next(null, 'files/')
    },

    filename: (req, file, next) => {
        const nameArr = file.originalname.split('.');
        const ext = nameArr.pop()
        const name = `${uniqueId()}.${ext}`;
        next(null, name);
    }
})
const upload = multer({ storage: storage });

const { signup, login } = require('./controller/user.controller');
const { createFile, fetchFile, deleteFile } = require('./controller/file.controller');
const app = express();
app.listen(process.env.PORT || 8080);



app.use(express.static("view"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());



app.post('/signup', signup);
app.post('/login', login);
app.post('/file', upload.single('file'), createFile);
app.get('/file', fetchFile);
app.delete('/file/:id', deleteFile);