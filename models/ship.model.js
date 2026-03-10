const mongoose = require('mongoose');

const shipSchema = new mongoose.Schema({
  invoiceId: {type: String, required: true},
  shipAddress: { type: String, required: true },
  estimatedShipDate: { type: Date, default: null },
  shipCost: { type: Number, default: 10000 },
  status: { type: String, default: "PENDING" }, // PENDING, DELIVERING, COMPLETED
  receiverUrlMedia: {
    type: [String]
  },
  senderUrlMedia: {
    type: [String]
  },
}, {
  timestamps: true
});

const ShipModel = mongoose.model('Ship', shipSchema);

module.exports = ShipModel;