const FileModel = require("../model/file.model");
const mongoose = require("mongoose");

const fetchDashboard = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);
        const reports = await FileModel.aggregate([
            {
                $match: { user: userId }
            },
            {
                $group: {
                    _id: "$type",
                    total: { $sum: 1 }
                }
            }
        ])

        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    fetchDashboard
}