const dotenv = require('dotenv');
dotenv.config()

const mongoose = require('mongoose');
mongoose.connect(process.env.DB);

const root = process.cwd();
const express = require('express');
const path = require("path");
const { v4: uniqueId } = require('uuid');
const cors = require("cors");

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
const { createFile, fetchFile, deleteFile, downloadFile } = require('./controller/file.controller');
const { fetchDashboard } = require('./controller/dashboard.controller');
const { verifyToken } = require('./controller/token.controller');
const app = express();
app.listen(process.env.PORT || 8080);



app.use(express.static("view"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());


// Api endpoint
app.post('/api/signup', signup);
app.post('/api/login', login);
app.post('/api/file', upload.single('file'), createFile);
app.get('/api/file', fetchFile);
app.delete('/api/file/:id', deleteFile);
app.get('/api/file/download/:id', downloadFile);
app.get('/api/dashboard', fetchDashboard);
app.post("/api/token/verify", verifyToken);


// Ui endpoint

const getPath = (filename) => {
    return path.join(root, "view", filename)
}



app.get("/signup", (req, res) => {
    res.sendFile(getPath("signup.html"));
})

app.get("/dashboard", (req, res) => {
    res.sendFile(getPath("app/dashboard.html"));
})

app.get("/login", (req, res) => {
    res.sendFile(getPath("index.html"));
})

app.get("/", (req, res) => {
    res.sendFile(getPath("index.html"));
})

app.get("/history", (req, res) => {
    res.sendFile(getPath("app/history.html"));
})

app.get("/files", (req, res) => {
    res.sendFile(getPath("app/files.html"));
})