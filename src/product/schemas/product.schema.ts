import * as mongoose from 'mongoose';

export const ProductSchema = new mongoose.Schema({
    id: String,
    name: String,
    category: String,
    description: String,
    price: Number,
    amount: Number,
    specification: String,
});