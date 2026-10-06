import House from '../models/House.js';

/**
 * @route   POST /api/houses
 * @desc    Create a new house listing
 * @access  Private (protect)
 */
export const createHouse = async (req, res, next) => {
  try {
    const {
      title,
      description,
      location,
      distance,
      type,
      rent,
      availability,
      amenities,
      contactPhone,
      contactEmail,
    } = req.body;

    if (!title || !location || !type || rent === undefined) {
      return res.status(400).json({
        success: false,
        message: 'title, location, type and rent are required',
      });
    }

    // Amenities: accept JSON array or comma-separated string
    let amenitiesArr = [];

    if (Array.isArray(amenities)) {
      amenitiesArr = amenities;
    } else if (typeof amenities === 'string' && amenities.trim()) {
      try {
        const parsed = JSON.parse(amenities);

        amenitiesArr = Array.isArray(parsed)
          ? parsed
          : amenities
              .split(',')
              .map((a) => a.trim())
              .filter(Boolean);
      } catch {
        amenitiesArr = amenities
          .split(',')
          .map((a) => a.trim())
          .filter(Boolean);
      }
    }

    // Uploaded files -> Cloudinary URLs
    const imageUrls = (req.files || []).map(
      (file) => file.path || file.secure_url
    );

    // Allow client to also send existing image URLs
    let incomingUrls = [];

    if (req.body.images) {
      try {
        const parsed = JSON.parse(req.body.images);
        incomingUrls = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        incomingUrls = [req.body.images];
      }
    }

    const house = await House.create({
      title: title.trim(),
      description: description?.trim() || '',
      location: location.trim(),
      distance: distance?.trim() || '',
      type,
      rent: Number(rent),
      availability: availability || 'Available Now',
      amenities: amenitiesArr,
      images: [...imageUrls, ...incomingUrls],
      owner: req.user._id,
      contactPhone: contactPhone || req.user.phone || '',
      contactEmail: contactEmail || req.user.email || '',
    });

    return res.status(201).json({
      success: true,
      message: 'House posted successfully',
      house,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   GET /api/houses
 * @desc    Get all houses (with optional search + filters)
 * @access  Public
 */
export const getHouses = async (req, res, next) => {
  try {
    const {
      search,
      type,
      minRent,
      maxRent,
      verified,
      featured,
      limit,
    } = req.query;

    const query = {};

    if (type && type !== 'All') {
      query.type = type;
    }

    if (verified === 'true') {
      query.verified = true;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (minRent || maxRent) {
      query.rent = {};

      if (minRent) {
        query.rent.$gte = Number(minRent);
      }

      if (maxRent) {
        query.rent.$lte = Number(maxRent);
      }
    }

    if (search) {
      const regex = new RegExp(search.trim(), 'i');

      query.$or = [
        { title: regex },
        { location: regex },
        { distance: regex },
        { amenities: regex },
        { type: regex },
      ];
    }

    const houses = await House.find(query)
      .populate('owner', 'name email phone')
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit ? Number(limit) : 100);

    return res.json(houses);
  } catch (err) {
    next(err);
  }
};

/**
 * @route   GET /api/houses/:id
 * @desc    Get a single house by ID
 * @access  Public
 */
export const getHouseById = async (req, res, next) => {
  try {
    const house = await House.findById(req.params.id).populate(
      'owner',
      'name email phone'
    );

    if (!house) {
      return res.status(404).json({
        success: false,
        message: 'House not found',
      });
    }

    return res.json(house);
  } catch (err) {
    next(err);
  }
};

/**
 * @route   GET /api/houses/mine
 * @desc    Get houses owned by the logged-in user
 * @access  Private
 */
export const getMyHouses = async (req, res, next) => {
  try {
    const houses = await House.find({
      owner: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.json(houses);
  } catch (err) {
    next(err);
  }
};

/**
 * @route   PUT /api/houses/:id
 * @desc    Update a house (owner or admin)
 * @access  Private
 */
export const updateHouse = async (req, res, next) => {
  try {
    const house = await House.findById(req.params.id);

    if (!house) {
      return res.status(404).json({
        success: false,
        message: 'House not found',
      });
    }

    const isOwner = String(house.owner) === String(req.user._id);
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this listing',
      });
    }

    const fields = [
      'title',
      'description',
      'location',
      'distance',
      'type',
      'rent',
      'availability',
      'contactPhone',
      'contactEmail',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        house[field] = req.body[field];
      }
    });

    if (req.body.amenities !== undefined) {
      let arr = req.body.amenities;

      if (typeof arr === 'string') {
        try {
          arr = JSON.parse(arr);
        } catch {
          arr = arr
            .split(',')
            .map((a) => a.trim())
            .filter(Boolean);
        }
      }

      house.amenities = Array.isArray(arr) ? arr : [];
    }

    // New uploaded images -> Cloudinary URLs
    const newImages = (req.files || []).map(
      (file) => file.path || file.secure_url
    );

    if (newImages.length) {
      house.images = [...house.images, ...newImages];
    }

    const updated = await house.save();

    return res.json({
      success: true,
      message: 'House updated',
      house: updated,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   DELETE /api/houses/:id
 * @desc    Delete a house (owner or admin)
 * @access  Private
 */
export const deleteHouse = async (req, res, next) => {
  try {
    const house = await House.findById(req.params.id);

    if (!house) {
      return res.status(404).json({
        success: false,
        message: 'House not found',
      });
    }

    const isOwner = String(house.owner) === String(req.user._id);
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this listing',
      });
    }

    await house.deleteOne();

    return res.json({
      success: true,
      message: 'House deleted',
    });
  } catch (err) {
    next(err);
  }
};
