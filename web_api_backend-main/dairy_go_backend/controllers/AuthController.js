const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || "this_is_my_secret";
const Credential = require("../models/Credential")

const register = async (req, res) => {
    const { username, password, role, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const cred = new Credential({ username, password: hashedPassword, role, email });
    cred.save();
    res.status(201).send(cred);

};

const login = async (req, res) => {
    const { username, password } = req.body;
    const cred = await Credential.findOne({ username });
    if (!cred || !(await bcrypt.compare(password, cred.password))) {
        return res.status(403).send('Invalid username or password');
    }

    const token = jwt.sign({ username: cred.username, role: cred.role }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });

};

const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const username = req.user?.username;
    if (!username) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const cred = await Credential.findOne({ username });
    if (!cred || !(await bcrypt.compare(currentPassword, cred.password))) {
        return res.status(403).json({ message: "Current password is incorrect" });
    }
    cred.password = await bcrypt.hash(newPassword, 10);
    await cred.save();
    res.json({ message: "Password updated successfully" });
};

const getAdminProfile = async (req, res) => {
  const username = req.user?.username;
  if (!username) return res.status(401).json({ message: "Unauthorized" });
  const cred = await Credential.findOne({ username });
  if (!cred) return res.status(404).json({ message: "Admin not found" });
  
  res.json({ 
    username: cred.username, 
    role: cred.role, 
    email: cred.email,
    fullName: cred.fullName || "",
    phone: cred.phone || "",
    profileImage: cred.profileImage || "",
    createdAt: cred.createdAt,
    updatedAt: cred.updatedAt,
    lastLogin: new Date(),
    sessionActive: true
  });
};

const updateAdminProfile = async (req, res) => {
  const username = req.user?.username;
  if (!username) return res.status(401).json({ message: "Unauthorized" });
  
  try {
    const cred = await Credential.findOne({ username });
    if (!cred) return res.status(404).json({ message: "Admin not found" });

    // Update fields
    const { fullName, phone, email } = req.body;
    if (fullName !== undefined) cred.fullName = fullName;
    if (phone !== undefined) cred.phone = phone;
    if (email !== undefined) cred.email = email;

    // Handle file upload if present
    if (req.file) {
      cred.profileImage = `/uploads/${req.file.filename}`;
    }

    await cred.save();
    
    res.json({ 
      username: cred.username, 
      role: cred.role, 
      email: cred.email,
      fullName: cred.fullName || "",
      phone: cred.phone || "",
      profileImage: cred.profileImage || "",
      createdAt: cred.createdAt,
      updatedAt: cred.updatedAt,
      lastLogin: new Date(),
      sessionActive: true
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

module.exports = {
    login,
    register,
    changePassword,
    getAdminProfile,
    updateAdminProfile
}