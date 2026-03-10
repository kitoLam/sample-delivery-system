const mongoose = require('mongoose');

const shipSchema = new mongoose.Schema({
  invoiceId: {type: String, required: true},
  shipAddress: { type: String, required: true },
  estimatedShipDate: { type: Date, default: null },
  shipCost: { type: Number, default: 10000 },
  status: { type: String, default: "PENDING" }, // PENDING, DELIVERING, COMPLETED, FAILED
  receiverUrlMedia: {
    type: [String]
  },
  senderUrlMedia: {
    type: [String]
  },
  successUrlCallback: { type: String, required: true },
  failUrlCallback: { type: String, required: true },
  receiveUrlCallback: { type: String, required: true },
}, {
  timestamps: true
});

const ShipModel = mongoose.model('Ship', shipSchema);

module.exports = ShipModel;