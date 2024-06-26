"use strict";
/* -------------------------------------------------------
    CAR MODEL
------------------------------------------------------- */
const { mongoose } = require("../configs/dbConnection");
/* ------------------------------------------------------- */

const CarSchema = new mongoose.Schema(
  {
    plateNumber: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    brand: {
      type: String,
      trim: true,
      required: true,
    },
    model: {
      type: String,
      trim: true,
      required: true,
    },
    year: {
      type: Number,
      min: 1950,
      max: new Date().getFullYear(),
      required: true,
    },
    isAutomatic: {
      type: Boolean,
      default: false,
    },
    pricePerDay: {
      type: Number,
      required: true,
    },
    images: {
      type: Array,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    createdId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { collection: "cars", timestamps: true }
);

/* ------------------------------------------------------- */
module.exports = mongoose.model("Car", CarSchema);
