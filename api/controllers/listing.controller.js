import Listing from '../models/listing.model.js';

const createListing = async (req, res, next) => {
  try {
    const newListing = new Listing(req.body);
    await newListing.save();
    res.status(201).json({ success: true, listing: newListing });
  } catch (error) {
    next(error);
  }
};

export { createListing };
