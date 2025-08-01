const mongoose = require('mongoose');

const credSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    email: { type: String },
    fullName: { type: String, default: "" },
    phone: { type: String, default: "" },
    profileImage: { type: String, default: "" }
}, {
    timestamps: true
});

const Cred = mongoose.model('creds', credSchema);

module.exports = Cred;
