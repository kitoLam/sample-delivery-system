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
      message: error.message || "Create shipment error",
    });
  }
};

const markReceive = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const { senderUrlMedia } = req.body;
    if (!senderUrlMedia || senderUrlMedia.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please send at least 1 image url when sending order",
      });
    }
    const foundShip = await ShipModel.findOne({ _id: id });
    if(!foundShip){
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }
    await axios.patch(foundShip.receiveUrlCallback);
    await ShipModel.updateOne({ _id: id }, { status: "DELIVERING", senderUrlMedia: senderUrlMedia });
    res.json({
      success: true,
      message: "Mark receive successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Mark receive error",
    });
  }
};

const markComplete = async (req, res) => {
  try {
    const receiverUrlMedia = req.body.receiverUrlMedia;
    if (!receiverUrlMedia || receiverUrlMedia.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please send at least 1 image url when receiving order",
      });
    }
    const id = req.params.id;
    const foundShip = await ShipModel.findOne({ _id: id });
    if (!foundShip) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    await ShipModel.updateOne({ _id: id }, { status: "COMPLETED", receiverUrlMedia: receiverUrlMedia });

    // Call successUrlCallback if exists
    if (foundShip.successUrlCallback) {
      try {
        await axios.patch(foundShip.successUrlCallback);
      } catch (callbackError) {
        console.log("Success callback error:", callbackError.message);
      }
    }

    res.json({
      success: true,
      message: "Complete shipment",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Mark shipment as complete error",
    });
  }
};

const markFail = async (req, res) => {
  try {
    const receiverUrlMedia = req.body.receiverUrlMedia;
    if (!receiverUrlMedia || receiverUrlMedia.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please send at least 1 image url when marking order as failed",
      });
    }
    const id = req.params.id;
    const foundShip = await ShipModel.findOne({ _id: id });

    // Chỉ cho phép mark fail nếu đang ở trạng thái DELIVERING
    if (foundShip.status !== "DELIVERING") {
      return res.status(400).json({
        success: false,
        message: "Can only mark fail when shipment is in DELIVERING status",
      });
    }

    await ShipModel.updateOne({ _id: id }, { status: "FAILED", receiverUrlMedia: receiverUrlMedia });

    // Call failUrlCallback if exists
    if (foundShip.failUrlCallback) {
      try {
        await axios.patch(foundShip.failUrlCallback);
      } catch (callbackError) {
        console.log("Fail callback error:", callbackError.message);
      }
    }

    res.json({
      success: true,
      message: "Mark shipment as failed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Mark shipment as failed error",
    });
  }
};

module.exports = {
  createShip,
  markReceive,
  markComplete,
  markFail,
};
