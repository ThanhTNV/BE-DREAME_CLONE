import mongoose from "mongoose";

export const OrderDetailSchema = new mongoose.Schema(
  {
    orderId: String,
    productId: String,
    quantity: Number,
  },
  { timestamps: true },
);
