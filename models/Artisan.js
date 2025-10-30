const mongoose = require('mongoose');

const artisanSchema = new mongoose.Schema({
  active: {
    type: Boolean,
    default: true
  },
  order: { type: Number, required: true },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  specializations: [{
    type: String,
    trim: true
  }],
  artisanBanner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ArtisanBanner'
  },
  address: {
    state: {
      type: String,
      required: true,
      trim: true
    }
  },
  profileImage: {
    url: { type: String, default: '' },
    key: { type: String, default: '' }
  },
  promotions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Promotion'
  }],
  artisanGallery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ArtisanGallery'
  },
  artisanBlogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ArtisanBlog'
  }],
  artisanStories: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    default: null
  },
  socialPlugin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ArtisanPlugin',
    default: null
  },
  artisanHighlights:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ArtisanHighlights',
    default: null
  },
}, {
  timestamps: true
});

const Artisan = mongoose.models.Artisan || mongoose.model('Artisan', artisanSchema);
export default Artisan;
export { artisanSchema };


// module.exports = mongoose.models.ArtisanBanner || mongoose.model('ArtisanBanner', ArtisanBanner);
