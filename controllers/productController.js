import productModel from "../models/productModel.js";
import { v2 as cloudinary } from 'cloudinary';

const addProduct = async (req, res) => {
  try {
    const { name, price, description, sizes, bestseller, category, subCategory } = req.body;

    if (!name || !price || !description || !sizes || !category || !subCategory) {
      return res.json({ success: false, message: "Please fill all required fields" });
    }

    const parsedSizes = JSON.parse(sizes);

    const images = [req.files?.image1?.[0], req.files?.image2?.[0], req.files?.image3?.[0], req.files?.image4?.[0]]
      .filter(Boolean);

    const imagesUrl = await Promise.all(
      images.map((file) =>
        cloudinary.uploader.upload(file.path, { resource_type: 'image' }).then((res) => res.secure_url)
      )
    );

    const product = new productModel({
      name,
      description,
      price: Number(price),
      sizes: parsedSizes,
      category,
      subCategory,
      bestseller: String(bestseller).toLowerCase() === "true",
      image: imagesUrl,
      date: Date.now()
    });

    await product.save();
    res.json({ success: true, message: "Product added successfully", product });
  } catch (error) {
    console.error("Add Product Error:", error);
    res.json({ success: false, message: error.message });
  }
};

const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, message: "Products fetched successfully", products });
  } catch (error) {
    console.error("List Products Error:", error);
    res.json({ success: false, message: "Failed to load products" });
  }
};

const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.json({ success: false, message: "Product ID missing" });

    await productModel.findByIdAndDelete(id);
    console.log("Product Removed:", id);
    res.json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    console.error("Remove Product Error:", error);
    res.json({ success: false, message: "Failed to remove product" });
  }
};

const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.json({ success: false, message: "Product ID missing" });

    const product = await productModel.findById(productId);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error("Single Product Error:", error);
    res.json({ success: false, message: "Failed to fetch product" });
  }
};

export { addProduct, removeProduct, listProduct, singleProduct };