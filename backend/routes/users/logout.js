const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const { updateRefreshTokenByID } = require("../../controllers/userController");
const { auth } = require("../../middleware/authMiddleware");

router.get("/", auth, async (req, res) => {
  try {
    await updateRefreshTokenByID(req.user.id, "");
    res.clearCookie("user_refreshToken");
    return res.status(200).json({ message: "로그아웃 성공" });
  } catch (err) {
    return res.status(500).json({ message: "로그아웃 실패" });
  }
});

module.exports = router;
