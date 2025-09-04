const express = require("express");
const {
  getAll,
  statusToggle,
  createRegister,
  loginUser,
} = require("../controller/todoController");
const authenticateUser = require("../middleware/authMiddleware");
const router = express.Router();
// authenticateUser
router.get("/topics/", authenticateUser, getAll);
router.patch("/topic/:id", authenticateUser, statusToggle);
router.post("/register", createRegister);
router.post("/login", loginUser);

// loginUser

// createRegister

// router.post("/bulk", createUsers);

module.exports = router;
