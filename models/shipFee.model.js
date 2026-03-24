const mongoose = require("mongoose");

const shipFeeSchema = new mongoose.Schema(
  {
    province: { type: String, required: true, trim: true, uppercase: true },
    district: { type: String, trim: true, uppercase: true, default: null },
    ward: { type: String, trim: true, uppercase: true, default: null },
    fee: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

shipFeeSchema.index({ province: 1, district: 1, ward: 1 }, { unique: true });

const ShipFeeModel = mongoose.model("ShipFee", shipFeeSchema);

module.exports = ShipFeeModel;
