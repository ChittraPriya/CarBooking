const express = require('express');
const { getOffers, createOffer, deleteOffer } = require('../controllers/offerController');

const offerRouter = express.Router();

offerRouter.get("/", getOffers);

// CREATE
offerRouter.post("/", createOffer);

// DELETE
offerRouter.delete("/:id", deleteOffer);

module.exports = offerRouter;