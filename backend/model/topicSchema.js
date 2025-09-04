const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
      enum: [
        "DSA",
        "Database",
        "Machine Learning",
        "Operating System",
        "Algorithms",
        "Networking",
        "Software Engineering",
        "Web Development",
        "Cloud Computing",
        "Mathematics",
      ],
      trim: true,
    },
    task_name: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Task name must be at least 3 characters long"],
      maxlength: [100, "Task name cannot exceed 100 characters"],
    },
    leetcode_link: {
      type: String,
      required: true,
      trim: true,
      match: [
        /^https?:\/\/leetcode\.com\/.+$/,
        "Please enter a valid LeetCode URL",
      ],
    },
    yt_link: {
      type: String,
      required: true,
      trim: true,
      match: [
        /^https?:\/\/(www\.)?youtube\.com\/.+$/,
        "Please enter a valid YouTube URL",
      ],
    },
    article_link: {
      type: String,
      required: true,
      trim: true,
      match: [/^https?:\/\/.+$/, "Please enter a valid article URL"],
    },
    level: {
      type: String,
      required: true,
      enum: ["easy", "medium", "hard"],
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("topics", topicSchema);
