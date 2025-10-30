import mongoose from 'mongoose';

// ArtisanHighlights: Associates multiple highlights with an artisan.
const ArtisanHighlightsSchema = new mongoose.Schema({
  artisan: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Artisan', 
    required: true,
    unique: true // Ensure one document per product
  },
  highlights: { 
    type: [{
      type: String,
      trim: true
    }],
    default: [],
    validate: {
      validator: function(v) {
        // Ensure at least one highlight is provided
        return v.length > 0;
      },
      message: 'At least one highlight is required'
    }
  }
}, { 
  timestamps: true,
});

// Add a pre-save hook to ensure at least one of tagLine or highlights is provided
ArtisanHighlightsSchema.pre('save', function(next) {
  if (!this.highlights || this.highlights.length === 0) {
    const error = new Error('At least one highlight is required');
    return next(error);
  }
  next();
});

// Export the ArtisanHighlights model
export default mongoose.models.ArtisanHighlights || mongoose.model('ArtisanHighlights', ArtisanHighlightsSchema);
