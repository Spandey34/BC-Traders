import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    mrp: {
        type: Number,
        default: null
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        default: 0
    },
    highlighted: {
        type: Boolean,
        default: false
    },
    offer: {
        type: String,
        default: ""
    }
})