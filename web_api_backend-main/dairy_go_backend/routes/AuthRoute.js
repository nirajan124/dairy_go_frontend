const express = require("express")
const router = express.Router();
const { login, register, changePassword, getAdminProfile, updateAdminProfile } = require("../controllers/AuthController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/uploads");

router.post("/login", login);
router.post("/register", register);
router.put("/change-password", protect, changePassword);
router.get("/me", protect, getAdminProfile);
router.put("/profile", protect, upload.single("profileImage"), updateAdminProfile);

module.exports = router;
