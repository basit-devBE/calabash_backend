import mongoose from 'mongoose';

const customizableItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true   
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price_range: {
        type: {
            min: { type: Number, required: true },
            max: { type: Number, required: true }
        },
        required: true
    },
    deliveryTime: {
        type: String,
        required: true
    }
});

const CustomizableItem = mongoose.model('CustomizableItem', customizableItemSchema);
export default CustomizableItem;