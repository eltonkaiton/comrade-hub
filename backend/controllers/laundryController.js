import Laundry from '../models/Laundry.js';

function buildFileUrl(req, filename) {
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
}

export const createLaundry = async (req, res, next) => {
  try {
    const {
      name,
      location,
      serviceArea,
      phone,
      price,
      priceUnit,
      description,
      services,
      contactEmail,
    } = req.body;

    if (!name || !location || !serviceArea || !phone || !description) {
      return res.status(400).json({
        success: false,
        message: 'name, location, serviceArea, phone and description are required',
      });
    }

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

    const laundry = await Laundry.create({
      name: name.trim(),
      location: location.trim(),
      serviceArea: serviceArea.trim(),
      phone: phone.trim(),
      price: Number(price) || 0,
      priceUnit: priceUnit || 'per load',
      description: description.trim(),
      services: servicesArr,
      images: [...imageUrls, ...incomingUrls],
      owner: req.user._id,
      contactEmail: contactEmail || req.user.email || '',
    });

    return res.status(201).json({
      success: true,
      message: 'Laundry service registered successfully',
      laundry,
    });
  } catch (err) {
    next(err);
  }
};

export const getLaundries = async (req, res, next) => {
  try {
    const { search, location, limit } = req.query;
    const query = {};

    if (location) query.location = new RegExp(location.trim(), 'i');

    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { location: regex },
        { serviceArea: regex },
        { description: regex },
        { services: regex },
      ];
    }

    const laundry = await Laundry.find(query)
      .populate('owner', 'name email phone')
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit ? Number(limit) : 100);

    return res.json(laundry);
  } catch (err) {
    next(err);
  }
};

export const getMyLaundries = async (req, res, next) => {
  try {
    const laundry = await Laundry.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });
    return res.json(laundry);
  } catch (err) {
    next(err);
  }
};

export const getLaundryById = async (req, res, next) => {
  try {
    const laundry = await Laundry.findById(req.params.id).populate(
      'owner',
      'name email phone'
    );
    if (!laundry) {
      return res
        .status(404)
        .json({ success: false, message: 'Laundry service not found' });
    }
    return res.json(laundry);
  } catch (err) {
    next(err);
  }
};

export const updateLaundry = async (req, res, next) => {
  try {
    const laundry = await Laundry.findById(req.params.id);
    if (!laundry) {
      return res
        .status(404)
        .json({ success: false, message: 'Laundry service not found' });
    }

    const isOwner = String(laundry.owner) === String(req.user._id);
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized to edit this listing' });
    }

    const fields = [
      'name', 'location', 'serviceArea', 'phone', 'price',
      'priceUnit', 'description', 'contactEmail', 'availability',
    ];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) laundry[f] = req.body[f];
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
      laundry.services = Array.isArray(arr) ? arr : [];
    }

    const newImages = (req.files || []).map((file) =>
      `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
    );
    if (newImages.length) laundry.images = [...laundry.images, ...newImages];

    const updated = await laundry.save();
    return res.json({
      success: true,
      message: 'Laundry updated',
      laundry: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteLaundry = async (req, res, next) => {
  try {
    const laundry = await Laundry.findById(req.params.id);
    if (!laundry) {
      return res
        .status(404)
        .json({ success: false, message: 'Laundry service not found' });
    }

    const isOwner = String(laundry.owner) === String(req.user._id);
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized to delete this listing' });
    }

    await laundry.deleteOne();
    return res.json({ success: true, message: 'Laundry deleted' });
  } catch (err) {
    next(err);
  }
};