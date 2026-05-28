const Offer = require("../models/offers");

// GET ALL OFFERS
exports.getOffers = async (req, res) => {
  try {

    const offers = await Offer.find().sort({
      createdAt: -1,
    });

    res.json(offers);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};

// CREATE OFFER (ADMIN)
exports.createOffer = async (req, res) => {
  try {

    const offer = await Offer.create(req.body);

    res.status(201).json(offer);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};

// DELETE OFFER
exports.deleteOffer = async (req, res) => {
  try {

    await Offer.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Offer deleted",
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};