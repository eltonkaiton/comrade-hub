import express from "express";
import upload from "../middleware/upload.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  markAsSold,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/", protect, upload.array("images", 6), createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", upload.array("images", 6), updateProduct);
router.delete("/:id", deleteProduct);
router.patch("/:id/sold", markAsSold);

export default router;