import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema({
  artisan: { type: mongoose.Schema.Types.ObjectId, ref: 'Artisan', required: true },
  subImages: [{
    url: { type: String, required: true },
    key: { type: String, required: true }
  }],
}, { timestamps: true });

export default mongoose.models.ArtisanGallery || mongoose.model('ArtisanGallery', GallerySchema);