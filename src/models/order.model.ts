import mongoose, { Schema } from 'mongoose';

// Subschema für eine einzelne Bestellposition
const orderItemSchema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: false,
        },

        productName: {
            type: String,
            required: false,
            trim: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },

        color: {
             type: String,
             trim: true,
        },

        size: {
             type: String,
             trim: true,
        },
    },
    {
        _id: false,
    }
);

// Hauptschema für die Bestellung
const orderSchema = new Schema(
    {
    customerName: {
        type: String,
        required: true,
        trim: true,
    },

    //Kundentyp: 'b2b' oder 'b2c'
    customerType: {
        type: String,
        required: true,
        enum: ['b2b', 'b2c'],
    },

    originalMessage: {
        type: String,
        required: true,
        trim: true,
    },

    items: {
        type: [orderItemSchema],
        required: true,
        default: [],
    },

    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped'],
        default: 'pending',
    },

    notes: {
        type: String,
        trim: true,
    },

    aiSummary: {
        type: String,
        trim: true,
    },
},
{
    timestamps: true,
}
);

const Order = mongoose.model('Order', orderSchema);

export default Order;