const { default: axios } = require("axios");
const ShipModel = require("../models/ship.model");
const moment = require("moment");

const createShip = async (req, res) => {
  try {
    const newShipment = new ShipModel({
      ...req.body,
      estimatedShipDate: moment(new Date()).add(3, "days").toDate(),
    });
    await newShipment.save();
    res.json({
      success: true,
      message: "Create shipment successfully",
      data: {
        shipCode: newShipment._id,
        estimatedShipDate: moment(newShipment.estimatedShipDate).format(
          "DD-MM-YYYY",
        ),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Create shipment error",
    });
  }
};

const markReceive = async (req, res) => {
  const id = req.params.id;
  try {
    await ShipModel.updateOne({ _id: id }, { status: "DELIVERING" });
    const api = `http://34.92.192.47:5000/api/v1/admin/invoices/${foundShip.invoiceId}/status/delivering`;
    await axios.patch(api);
    res.json({
      success: true,
      message: "Mark receive successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Mark receive error",
    });
  }
};

const markComplete = async (req, res) => {
  try {
    const id = req.params.id;
    await ShipModel.updateOne({ _id: id }, { status: "COMPLETED" });
    const foundShip = await ShipModel.findOne({ _id: id });
    const api = `http://34.92.192.47:5000/api/v1/admin/invoices/${foundShip.invoiceId}/status/delivered`;
    await axios.patch(api);
    res.json({
      success: true,
      message: "Complete shipment",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Mark shipment as complete error",
    })
  }
};
// const
module.exports = {
  createShip,
  markReceive,
  markComplete,
};
