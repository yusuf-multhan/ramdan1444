const countersModel = require("../models/countersModel");
const TakhmeenForm = require("../models/takhmeenFormModel");

// @desc   Get all from takhmeenform
// @route  GET /api/v1/takhmeenform
exports.get = async (req, res) => {
  try {
    const list = await TakhmeenForm.find();
    res.status(200).json({
      success: true,
      data: list,
    });
  } catch (error) {
    console.log("API error", error);
    if (!res.headersSent) {
      res.send(500).json({
        success: false,
        error: "Server error",
      });
    }
  }
};

// get takhmeen for by ID - to validate if form with this HOF exists
exports.getByHOF = async (req, res) => {
  try {
    const hofId = req.params.hofid;
    const forms = await TakhmeenForm.find({ HOFId: hofId });
    res.status(200).json({
      success: true,
      data: forms,
    });
  } catch (error) {
    console.log("API error", error);
    if (!res.headersSent) {
      res.send(500).json({
        success: false,
        error: "Server error",
      });
    }
  }
};

// get takhmeen for by form no
exports.getByFormNo = async (req, res) => {
  try {
    const formNo = req.params.formno?.toUpperCase();
    const form = await TakhmeenForm.findOne({ formNo: formNo });
    res.status(200).json({
      success: true,
      data: form,
    });
  } catch (error) {
    console.log("API error", error);
    if (!res.headersSent) {
      res.send(500).json({
        success: false,
        error: "Server error",
      });
    }
  }
};

// @desc   Add to takhmeenform
// @route  POST /api/v1/takhmeenform
exports.add = async (req, res) => {
  try {
    delete req.body.paidAmount;
    const counterSeq = await countersModel.findByIdAndUpdate(
      { _id: req.body.markaz },
      { $inc: { seq: 1 } },
      { new: true }
    );
    const formData = {
      ...req.body,
      formNo: `${req.body.markaz}-${counterSeq?.seq ?? Date.now()}`,
      paidAmount: 0,
    };
    const form = await TakhmeenForm.create(formData);
    res.status(201).json({
      success: true,
      data: form,
    });
  } catch (error) {
    console.log("API error", error);
    if (!res.headersSent) {
      res.send(500).json({
        success: false,
        error: "Server error",
      });
    }
    return;
  }
};

// @desc   Update takhmeenform
// @route  PUT /api/v1/takhmeenform
exports.update = async (req, res) => {
  try {
    const { formNo } = req.body;
    const updatedForm = await this.updateTakhmeenForm(formNo, req.body);
    res.status(200).json(updatedForm);
  } catch (error) {
    console.log("API error", error);
    if (!res.headersSent) {
      res.send(500).json({
        success: false,
        error: "Server error",
      });
    }
  }
};

exports.updateTakhmeenForm = async (formNo, data, isAmountUpdate = false) => {
  try {
    const form = await TakhmeenForm.findOneAndUpdate(
      { formNo },
      isAmountUpdate
        ? {
            $inc: {
              paidAmount: data.paidAmount,
            },
          }
        : data,
      { new: true } // Return updated one
    );
    form;
  } catch (error) {
    error;
  }
};

// @desc   Delete takhmeenform
// @route  DELETE /api/v1/takhmeenform
exports.remove = async (req, res) => {
  try {
    console.log(req.body);
    const { _id } = req.body;
    const list = await TakhmeenForm.findById(_id);
    if (!list) {
      res.status(404).json({
        success: false,
        error: "Not Found",
      });
    }

    await TakhmeenForm.deleteOne();
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.log(error);
  }
};
