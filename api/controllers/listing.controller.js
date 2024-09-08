import Listing from '../models/listing.model.js';
import { customError } from '../utils/custom.error.js';

const createListing = async (req, res, next) => {
  try {
    const newListing = new Listing(req.body);
    await newListing.save();
    res.status(201).json({ success: true, listing: newListing });
  } catch (error) {
    next(error);
  }
};

const deleteListing = async (req, res, next) => {
  //checking if listing exists
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(customError(404, 'Listing not found'));
  }
  //checking if the user is the owner of the listing
  if (req.user.id !== listing.userId) {
    return next(
      customError(401, 'You can only delete your own listings not others')
    );
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: 'Listing deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const updateListing = async (req, res, next) => {
  //checking if listing exists
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(customError(404, 'Listing not found'));
  }
  //checking if the user is the owner of the listing
  if (req.user.id !== listing.userId) {
    return next(
      customError(401, 'You can only update your own listings not others')
    );
  }
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ success: true, listing: updatedListing });
  } catch (error) {
    next(error);
  }
};

const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(customError(404, 'Listing not found'));
    }
    res.status(200).json({ success: true, listing });
  } catch (error) {
    next(error);
  }
};
const searchListings = async (req, res, next) => {
  try {
    let { type, offer, parking, furnished, limit, startIdx } = req.query;
    const searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || 'desc';

    limit = parseInt(limit) || 10;
    startIdx = parseInt(startIdx) || 0;

    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }
    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }
    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      address: { $regex: searchTerm, $options: 'i' },
      type,
      offer,
      furnished,
      parking,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIdx);

    return res.status(200).json({ success: true, listings });
  } catch (error) {
    next(error);
  }
};

export {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  searchListings,
};
