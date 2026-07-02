const mongoose = require("mongoose");

const serviceAdvisorSchema = new mongoose.Schema(
  {
    advisorId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    role: {
      type: String,
      default: "service_advisor",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ServiceAdvisor", serviceAdvisorSchema);