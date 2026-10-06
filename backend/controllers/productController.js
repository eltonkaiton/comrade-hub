import Product from "../models/Product.js";

// CREATE PRODUCT
export const createProduct = async (req, res, next) => {
  try {
    const { title, category, condition, price, location, description, phone } = req.body;

    const images = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];

    const product = await Product.create({
      title,
      category,
      condition,
      price: Number(price),
      location,
      description,
      phone,
      images,
      sellerId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Product listing created successfully!",
      product,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL PRODUCTS (with filters)
export const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      condition,
      location,
      minPrice,
      maxPrice,
      search,
      sort,
      page = 1,
      limit = 20,
    } = req.query;

    const query = { status: "active" };

    if (category && category !== "All") query.category = category;
    if (condition) query.condition = condition;
    if (location) query.location = new RegExp(location, "i");
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) query.$text = { $search: search };

    let sortBy = { createdAt: -1 };
    if (sort === "price_asc") sortBy = { price: 1 };
    if (sort === "price_desc") sortBy = { price: -1 };
    if (sort === "oldest") sortBy = { createdAt: 1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sortBy)
        .skip(skip)
        .limit(Number(limit))
        .populate("sellerId", "name firstName email"),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      products,
    });
  } catch (error) {
    next(error);
  }
};

// GET SINGLE PRODUCT
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    product.views += 1;
    await product.save();

    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (updates.price !== undefined) updates.price = Number(updates.price);

    if (req.files && req.files.length > 0) {
      updates.images = req.files.map((f) => `/uploads/${f.filename}`);
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Product updated successfully", product });
  } catch (error) {
    next(error);
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// MARK AS SOLD
export const markAsSold = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status: "sold" },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Product marked as sold", product });
  } catch (error) {
    next(error);
  }
};