const Review = require('../models/Review');
const findAll = async (req, res) => {
    try {
        const status = req.query.status;
        const filter = status ? { status } : {};
        console.log("Finding reviews with filter:", filter);
        const reviews = await Review.find(filter).populate(["customerId", "packageId"]);
        console.log("Found reviews:", reviews.length);
        res.status(200).json(reviews);
    } catch (e) {
        console.error("Error finding reviews:", e);
        res.status(500).json({ error: e.message })
    }

}
const save = async (req, res) => {
    try {
        // Add customer ID from authenticated user
        const reviewData = {
            ...req.body,
            customerId: req.user.id // From auth middleware
        };
        
        // If packageId is null or empty, remove it from the data
        if (!reviewData.packageId) {
            delete reviewData.packageId;
        }
        
        console.log("Saving review with data:", reviewData);
        const reviews = new Review(reviewData);
        await reviews.save();
        console.log("Review saved successfully:", reviews._id);
        res.status(201).json(reviews)
    } catch (e) {
        console.error("Error saving review:", e);
        res.status(500).json({ error: e.message })
    }

}
const findById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        res.status(200).json(review)
    } catch (e) {
        res.json(e)

    }


}
const deleteById = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        res.status(200).json("data Deleted")
    } catch (e) {
        res.json(e)

    }


}
const update = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(201).json(review)
    } catch (e) {
        res.json(e)

    }


}
const approve = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, { status: "Approved" }, { new: true });
        res.status(200).json(review);
    } catch (e) {
        res.json(e);
    }
};
const reject = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, { status: "Rejected" }, { new: true });
        res.status(200).json(review);
    } catch (e) {
        res.json(e);
    }
};
module.exports = {
    findAll,
    save,
    findById,
    deleteById,
    update,
    approve,
    reject
};