const express = require("express")
const router = express.Router();
const { findAll, save, findById, deleteById, update, approve, reject } = require("../controllers/ReviewController");
const { protect } = require("../middleware/auth");

router.get("/", findAll); // supports ?status=Pending|Approved|Rejected
router.post("/", protect, save); // Require authentication for posting reviews
router.get("/:id", findById);
router.delete("/:id", deleteById);
router.put("/:id", update)
router.put("/:id/approve", approve);
router.put("/:id/reject", reject);


module.exports = router;
