import { Schema, models, model } from "mongoose";

const OfferDetailsSchema = new Schema(
    {
        // Section 1: More Offers card (SearchSection right sidebar)
        moreOffers: {
            title: { type: String, default: "More offers" },
            description: { type: String, default: "" },
            knowMoreLink: { type: String, default: "/packages" },
        },
        // Section 2: Last Minute Deal banner (AboutUsSection)
        lastMinuteDeal: {
            heading: { type: String, default: "Last Minute Deal" },
            description: { type: String, default: "" },
            link: { type: String, default: "/packages" },
        },
        // Section 3: Promo banner (AboutUsSection)
        promoBanner: {
            description: { type: String, default: "" },
            link: { type: String, default: "/packages" },
        },
    },
    { timestamps: true }
);

export default models.OfferDetails || model("OfferDetails", OfferDetailsSchema);
