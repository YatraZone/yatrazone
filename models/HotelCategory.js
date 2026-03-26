import { models, Schema, model } from "mongoose";

const HotelCategorySchema = new Schema({
    name: { type: String, required: true, unique: true },
}, { timestamps: true });

export default models.HotelCategory || model("HotelCategory", HotelCategorySchema);
