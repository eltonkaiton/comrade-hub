import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [3, "Product name must be at least 3 characters"],
      maxlength: [120, "Product name is too long"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Phones",
        "Laptops",
        "Fashion",
        "Furniture",
        "Books",
        "Electronics",
        "Food",
        "Sports",
        "Cooking Appliances",
        "Other",
      ],
    },
    condition: {
      type: String,
      required: [true, "Condition is required"],
      enum: ["New", "Like New", "Used", "Good", "Fair"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [20, "Description must be at least 20 characters"],
      maxlength: [2000, "Description is too long"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[\+\d\s\-()]{7,20}$/, "Please enter a valid phone number"],
    },
    images: [{ type: String }],
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "sold", "pending", "removed"],
      default: "active",
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

productSchema.index({ title: "text", description: "text", location: "text" });
productSchema.index({ category: 1, condition: 1, price: 1, createdAt: -1 });

export default mongoose.model("Product", productSchema);