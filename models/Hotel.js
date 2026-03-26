import { models, Schema, model } from "mongoose";

const HotelSchema = new Schema({
    category: { type: String, required: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    image: {
        url: { type: String },
        key: { type: String },
    },
    imageClickLink: { type: String },
}, { timestamps: true });

export default models.Hotel || model("Hotel", HotelSchema);
