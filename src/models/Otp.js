const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    entityType: { type: String, required: true, enum: ["User", "PendingUser"] },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "entityType",
    },
    code: { type: String, required: true },
    purpose: { type: String, required: true, enum: ["signup"] },
    expiresAt: { type: Date, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Otp", otpSchema);
