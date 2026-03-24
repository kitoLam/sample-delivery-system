const { default: axios } = require("axios");
const ShipModel = require("../models/ship.model");
const ShipFeeModel = require("../models/shipFee.model");
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

const getAllShips = async (req, res) => {
  try {
    const ships = await ShipModel.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: ships,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Get shipments error",
    });
  }
};

const GLOBAL_SHIP_FEE_KEY = {
  province: "GLOBAL",
  district: null,
  ward: null,
};

const getShipFee = async (req, res) => {
  try {
    const feeConfig = await ShipFeeModel.findOne({
      ...GLOBAL_SHIP_FEE_KEY,
      isActive: true,
    });

    if (!feeConfig) {
      return res.status(404).json({
        success: false,
        message: "Global ship fee config not found",
      });
    }

    return res.json({
      success: true,
      data: {
        shipFee: feeConfig.fee,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Get ship fee error",
    });
  }
};

const upsertShipFee = async (req, res) => {
  try {
    const fee = Number(req.body?.fee);

    if (Number.isNaN(fee) || fee < 0) {
      return res.status(400).json({
        success: false,
        message: "fee must be a non-negative number",
      });
    }

    const shipFeeConfig = await ShipFeeModel.findOneAndUpdate(
      GLOBAL_SHIP_FEE_KEY,
      {
        fee,
        isActive: req.body?.isActive ?? true,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.json({
      success: true,
      message: "Update global ship fee successfully",
      data: {
        shipFee: shipFeeConfig.fee,
        isActive: shipFeeConfig.isActive,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Upsert ship fee error",
    });
  }
};

module.exports = {
  createShip,
  markReceive,
  markComplete,
  markFail,
  getAllShips,
  getShipFee,
  upsertShipFee,
};
