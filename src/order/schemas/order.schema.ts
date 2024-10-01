import mongoose from "mongoose";

export const OrderSchema = new mongoose.Schema(
  {
    id: String,
    customerInfo: {
      name: String,
      address: String,
      phone: String,
      email: String,
    },
    total: Number,
    status: Boolean,
  },
  { timestamps: true },
);
