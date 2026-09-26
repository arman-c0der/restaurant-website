import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    slug: {
      type: String,
      required: [true, "Product slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: 0,
    },

    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
      lowercase: true,
        index: true, 
    },

    image: {
      type: String,
      required: [true, "Product image is required"],
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    tag: {
      type: String,
      default: "",
      trim: true,
    },

    time: {
      type: String,
      default: "",
      trim: true,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    badge: {
      type: String,
      default: "",
      trim: true,
    },

    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);