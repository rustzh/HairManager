const express = require("express");
const router = express.Router();
const { auth } = require("../../middleware/authMiddleware");

router.post("/", auth, (req, res) => {
  res.status(200).json({
    id: req.user.id,
    email: req.user.email,
    username: req.user.username,
  });
});

module.exports = router;
