const PaymentSettings = require('../models/PaymentSettings');

// @desc    Get current UPI/Payment settings (public — customers need QR code)
// @route   GET /api/payment-settings
const getPaymentSettings = async (req, res) => {
  try {
    let settings = await PaymentSettings.findOne({ singleton: 'main' });
    if (!settings) {
      // Create default empty settings on first access
      settings = await PaymentSettings.create({ singleton: 'main' });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update UPI/Payment settings (Admin only)
// @route   PUT /api/payment-settings
const updatePaymentSettings = async (req, res) => {
  try {
    const {
      upiId,
      upiName,
      upiDescription,
      qrCodeImageUrl,
      paymentInstructions,
      confirmationWindowMinutes,
      upiEnabled
    } = req.body;

    const update = { updatedAt: new Date() };
    if (upiId !== undefined) update.upiId = upiId;
    if (upiName !== undefined) update.upiName = upiName;
    if (upiDescription !== undefined) update.upiDescription = upiDescription;
    if (qrCodeImageUrl !== undefined) update.qrCodeImageUrl = qrCodeImageUrl;
    if (paymentInstructions !== undefined) update.paymentInstructions = paymentInstructions;
    if (confirmationWindowMinutes !== undefined) update.confirmationWindowMinutes = Number(confirmationWindowMinutes);
    if (upiEnabled !== undefined) update.upiEnabled = Boolean(upiEnabled);

    const settings = await PaymentSettings.findOneAndUpdate(
      { singleton: 'main' },
      { $set: update },
      { upsert: true, new: true }
    );

    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPaymentSettings, updatePaymentSettings };
