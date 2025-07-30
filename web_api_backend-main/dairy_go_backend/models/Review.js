const mongoose = require("mongoose")
const reviewSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customers"
    },
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "packages"
    },
    rating: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    
});
const Review = mongoose.model("reviews", reviewSchema);

module.exports = Review;