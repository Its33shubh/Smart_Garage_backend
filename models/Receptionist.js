const mongoose = require("mongoose");

const receptionistSchema = new mongoose.Schema(
  {
    receptionistId: {
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
      default: "receptionist",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Receptionist", receptionistSchema);