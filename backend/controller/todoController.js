const Topics = require("../model/topicSchema");
const RegisterUser = require("../model/RegisterSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Fetch all topics with user-specific progress
const getAll = async (req, res) => {
  try {
    // req.user comes from your authenticate middleware (decoded from token)
    const userId = req.user.id;

    // Fetch user with progress
    const user = await RegisterUser.findById(userId).populate("progress.task");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch global topics
    const topics = await Topics.find(
      {},
      { __v: 0, createdAt: 0, updatedAt: 0 }
    );

    // Map user progress into a lookup for quick access
    const userProgressMap = {};
    user.progress.forEach((p) => {
      const taskId = p.task._id ? p.task._id.toString() : p.task.toString();
      userProgressMap[taskId] = p.status;
    });

    // Initialize overall stats
    let overallStats = { total: 0, done: 0, pending: 0 };

    // Group + add stats
    const grouped = topics.reduce((acc, item) => {
      if (!acc[item.topic]) {
        acc[item.topic] = {
          data: [],
          stats: { total: 0, done: 0, pending: 0 },
        };
      }

      // Get user-specific status (default: false)
      const status = userProgressMap[item._id.toString()] || false;

      // push task with user status
      acc[item.topic].data.push({ ...item.toObject(), status });

      // update topic stats
      acc[item.topic].stats.total += 1;
      if (status) {
        acc[item.topic].stats.done += 1;
        overallStats.done += 1;
      } else {
        acc[item.topic].stats.pending += 1;
        overallStats.pending += 1;
      }

      // update overall stats
      overallStats.total += 1;

      return acc;
    }, {});

    // Convert object into array format
    const formatted = Object.keys(grouped).map((topic) => ({
      topic,
      stats: grouped[topic].stats,
      data: grouped[topic].data,
    }));

    res.status(200).json({
      overall: overallStats,
      topics: formatted,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Toggle user-specific status for a task
const statusToggle = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params; // taskId

    const user = await RegisterUser.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find task progress entry for user
    // console.log(user.progress);

    const progressEntry = user.progress.find((p) => p.task.toString() === id);

    if (!progressEntry) {
      return res
        .status(404)
        .json({ message: "Task not found in user progress" });
    }

    // Toggle status
    progressEntry.status = !progressEntry.status;
    await user.save();

    res.status(200).json({
      message: "Task status updated successfully",
      task: {
        id: progressEntry.task,
        status: progressEntry.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createRegister = async (req, res) => {
  try {
    const { firstName, email, password, confirmPassword } = req.body;

    if (!firstName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        message:
          "All fields are required: firstName, email, password, confirmPassword.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const existingUser = await RegisterUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔥 Fetch all topics to attach progress
    const topics = await Topics.find({}, { _id: 1 });

    // Map them into progress with default status false
    const progress = topics.map((t) => ({
      task: t._id,
      status: false,
    }));

    // Create new user
    const newUser = new RegisterUser({
      firstName,
      email,
      password: hashedPassword,
      progress, // attach tasks here
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        email: newUser.email,
        totalTasks: newUser.progress.length, // optional
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await RegisterUser.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, email: user.email },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAll,
  statusToggle,
  createRegister,
  loginUser,
};
