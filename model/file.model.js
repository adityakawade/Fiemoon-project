const { Schema, model, mongoose } = require("mongoose");

const fileSchema = new Schema({
    filename: {
        type: String,
        trim: true,
        lowercase: true,
        required: true

    },

    path: {
        type: String,
        trim: true,
        lowercase: true,
        required: true

    },

    type: {
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },

    size: {
        type: Number,
        required: true

    },

    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    }


}, { timestamps: true })

const FileModel = model('File', fileSchema);

module.exports = FileModel;