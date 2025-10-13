import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    user: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
    },

   
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product', 
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            price: {
                type: Number, 
                required: true,
            },
        },
    ],

    totalAmount: {
        type: Number,
        required: true,
    },

    status: {
        type: String,
        required: true,
        enum: ['pending', 'delivered', 'cancelled'],
        default: 'pending',
    },

    paymentStatus: {
        type: String,
        required: true,
        enum: ['paid', 'unpaid'],
        default: 'unpaid',
    },

    paymentMethod: {
        type: String,
        required: true,
        enum: ['cash', 'online'],
    },
}, {
    timestamps: true,
});

const Order = mongoose.model("Order", OrderSchema);

export default Order;