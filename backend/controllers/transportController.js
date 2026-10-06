import Transport from '../models/Transport.js';

function buildFileUrl(req, filename) {
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
}

/**
 * @route   POST /api/transport
 * @desc    Create a new transport listing
 * @access  Private
 */
export const createTransport = async (req, res, next) => {
  try {
    const {
      name,
      type,
      location,
      serviceArea,
      phone,
      price,
      description,
      services,
      contactEmail,
    } = req.body;

    if (!name || !type || !location || !serviceArea || !phone || !description) {
      return res.status(400).json({
        success: false,
        message:
          'name, type, location, serviceArea, phone and description are required',
      });
    }

    // Services: array, JSON string, or comma-separated
    let servicesArr = [];
    if (Array.isArray(services)) {
      servicesArr = services;
    } else if (typeof services === 'string' && services.trim()) {
      try {
        const parsed = JSON.parse(services);
        servicesArr = Array.isArray(parsed)
          ? parsed
          : services.split(',').map((s) => s.trim()).filter(Boolean);
      } catch {
        servicesArr = services.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }

    const imageUrls = (req.files || []).map((file) =>
      buildFileUrl(req, file.filename)
    );

    let incomingUrls = [];
    if (req.body.images) {
      try {
        const parsed = JSON.parse(req.body.images);
        incomingUrls = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        incomingUrls = [req.body.images];
      }
    }

    const transport = await Transport.create({
      name: name.trim(),
      type,
      location: location.trim(),
      serviceArea: serviceArea.trim(),
      phone: phone.trim(),
      price: Number(price) || 0,
      description: description.trim(),
      services: servicesArr,
      images: [...imageUrls, ...incomingUrls],
      owner: req.user._id,
      contactEmail: contactEmail || req.user.email || '',
    });

    return res.status(201).json({
      success: true,
      message: 'Transport service registered successfully',
      transport,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   GET /api/transport
 * @desc    Get all transport listings
 * @access  Public
 */
export const getTransports = async (req, res, next) => {
  try {
    const { search, type, location, limit } = req.query;

    const query = {};

    if (type && type !== 'All') query.type = type;
    if (location) query.location = new RegExp(location.trim(), 'i');

    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { location: regex },
        { serviceArea: regex },
        { description: regex },
        { services: regex },
        { type: regex },
      ];
    }

    const transports = await Transport.find(query)
      .populate('owner', 'name email phone')
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit ? Number(limit) : 100);

    return res.json(transports);
  } catch (err) {
    next(err);
  }
};

/**
 * @route   GET /api/transport/mine
 * @desc    Get transports owned by the logged-in user
 * @access  Private
 */
export const getMyTransports = async (req, res, next) => {
  try {
    const transports = await Transport.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });
    return res.json(transports);
  } catch (err) {
    next(err);
  }
};

/**
 * @route   GET /api/transport/:id
 * @desc    Get a single transport by ID
 * @access  Public
 */
export const getTransportById = async (req, res, next) => {
  try {
    const transport = await Transport.findById(req.params.id).populate(
      'owner',
      'name email phone'
    );
    if (!transport) {
      return res
        .status(404)
        .json({ success: false, message: 'Transport service not found' });
    }
    return res.json(transport);
  } catch (err) {
    next(err);
  }
};

/**
 * @route   PUT /api/transport/:id
 * @desc    Update a transport listing (owner or admin)
 * @access  Private
 */
export const updateTransport = async (req, res, next) => {
  try {
    const transport = await Transport.findById(req.params.id);
    if (!transport) {
      return res
        .status(404)
        .json({ success: false, message: 'Transport service not found' });
    }

    const isOwner = String(transport.owner) === String(req.user._id);
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized to edit this listing' });
    }

    const fields = [
      'name',
      'type',
      'location',
      'serviceArea',
      'phone',
      'price',
      'description',
      'contactEmail',
    ];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) transport[f] = req.body[f];
    });

    if (req.body.services !== undefined) {
      let arr = req.body.services;
      if (typeof arr === 'string') {
        try {
          arr = JSON.parse(arr);
        } catch {
          arr = arr.split(',').map((s) => s.trim()).filter(Boolean);
        }
      }
      transport.services = Array.isArray(arr) ? arr : [];
    }

    const newImages = (req.files || []).map((file) =>
      `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
    );
    if (newImages.length) transport.images = [...transport.images, ...newImages];

    const updated = await transport.save();
    return res.json({
      success: true,
      message: 'Transport updated',
      transport: updated,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   DELETE /api/transport/:id
 * @desc    Delete a transport listing (owner or admin)
 * @access  Private
 */
export const deleteTransport = async (req, res, next) => {
  try {
    const transport = await Transport.findById(req.params.id);
    if (!transport) {
      return res
        .status(404)
        .json({ success: false, message: 'Transport service not found' });
    }

    const isOwner = String(transport.owner) === String(req.user._id);
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized to delete this listing' });
    }

    await transport.deleteOne();
    return res.json({ success: true, message: 'Transport deleted' });
  } catch (err) {
    next(err);
  }
};