import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    }
})

const addonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

const Menu = mongoose.model("Menu", menuSchema);
const Addon = mongoose.model("Addon", addonSchema);
export default Menu;
export {Addon};