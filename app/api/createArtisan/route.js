import connectDB from "@/lib/connectDB";
import mongoose from 'mongoose';
import Artisan from '@/models/Artisan';
import '@/models/ArtisanStory';
import '@/models/ArtisanPlugin';
import '@/models/ArtisanBanner';
import '@/models/ArtisanBlog';
import '@/models/Promotion'
import '@/models/ArtisanGallery'
import '@/models/ArtisanHighlights'

// Ensures all subcomponent models are registered for cascading delete
import { addSpecializationIfNotExists } from "@/lib/specialization";
import { deleteFileFromCloudinary } from "@/utils/cloudinary";
export async function POST(req) {
  try {
    await connectDB();
    // Only accept JSON payloads with image URL from UploadThing
    const data = await req.json();

    // Validate required fields
    if (!data.firstName ||!data.state) {
      return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
    }
    // Find the highest order number
    const lastBanner = await Artisan.findOne().sort({ order: -1 });
    const nextOrder = lastBanner ? lastBanner.order + 1 : 1; // Auto-increment order
    // Accept profileImage as a URL (and optionally key)
    const profileImage = data.profileImage ? data.profileImage : null;
    const artisan = new Artisan({
      slug: data.slug,
      firstName: data.firstName,
      specializations: data.specializations,
      address: {
        state: data.state
      },
      order: nextOrder,
      profileImage: (typeof profileImage === 'object' && profileImage !== null && profileImage.url && profileImage.key)
        ? { url: profileImage.url, key: profileImage.key }
        : { url: '', key: '' }
    });
    await artisan.save();
    if (Array.isArray(data.specializations)) {
      for (const spec of data.specializations) {
        await addSpecializationIfNotExists(spec);
      }
    }
    return new Response(JSON.stringify({ message: 'Artisan profile created successfully', artisan }), { status: 201 });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.artisanNumber) {
      return new Response(JSON.stringify({ message: 'Artisan number already exists', code: 11000 }), { status: 400 });
    }
    console.error('Error creating artisan profile:', err);
    return new Response(JSON.stringify({ message: 'Error creating artisan profile', error: err.message }), { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const url = new URL(req.url, `http://${req.headers.get('host') || 'localhost'}`);
    const excludeId = url.searchParams.get('exclude');
    
    // Build base query
    const query = { active: true };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    // First, try to get just the basic artisan data without populating
    let artisans = await Artisan.find(query).sort({ order: 1 });
    
    // If no artisans found, return empty array
    if (!artisans || artisans.length === 0) {
      return new Response(JSON.stringify([]), { status: 200 });
    }

    // Define the fields we want to populate
    const populateFields = [
      'promotions',
      'artisanBlogs',
      'artisanStories',
      'socialPlugin',
      'artisanBanner',
      'artisanGallery',
      'artisanHighlights'  
    ];

    // Apply population for each field with error handling
    for (const field of populateFields) {
      try {
        artisans = await Artisan.populate(artisans, { path: field });
      } catch (populateError) {
        console.error(`Error populating ${field}:`, populateError.message);
        // Continue with other fields even if one fails
      }
    }

    return new Response(JSON.stringify(artisans), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error in GET /api/createArtisan:', error);
    return new Response(JSON.stringify({ 
      message: 'Error fetching artisans', 
      error: error.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// PUT handler for editing an artisan
export async function PATCH(req) {
  try {
    await connectDB();
    const data = await req.json();
    const { id, ...updateFields } = data;
    if (!id) {
      return new Response(JSON.stringify({ message: 'Missing artisan ID' }), { status: 400 });
    }
    // Remove undefined fields and skip empty arrays from updateFields
    Object.keys(updateFields).forEach(key => {
      if (
        updateFields[key] === undefined ||
        (Array.isArray(updateFields[key]) && updateFields[key].length === 0)
      ) {
        delete updateFields[key];
      }
    });
    // If specializations is a string, parse it
    if (typeof updateFields.specializations === 'string') {
      try {
        updateFields.specializations = JSON.parse(updateFields.specializations);
      } catch { }
    }
    if (!Array.isArray(updateFields.specializations)) {
      updateFields.specializations = updateFields.specializations ? [updateFields.specializations] : [];
    }
    // Allow toggling active status
    if (typeof updateFields.active !== 'undefined') {
      updateFields.active = !!updateFields.active;
    }
    // console.log('PATCH updateFields:', updateFields); // Debug log
    // If profileImage is being updated or cleared, delete the old image from Cloudinary
    if (Object.prototype.hasOwnProperty.call(updateFields, 'profileImage')) {
      const artisan = await Artisan.findById(id);
      const oldKey = artisan?.profileImage?.key;
      const newKey = updateFields.profileImage?.key;
      // If the image is being changed or removed
      if (oldKey && oldKey !== newKey) {
        try {
          await deleteFileFromCloudinary(oldKey);
        } catch (err) {
          console.error('Cloudinary deletion failed (PATCH):', err.message);
        }
      }
    }
    // Directly replace all fields with the new data (admin full update)
    const updatedArtisan = await Artisan.findByIdAndUpdate(id, updateFields, { new: true, overwrite: false });
    if (!updatedArtisan) {
      return new Response(JSON.stringify({ message: 'Artisan not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ message: 'Artisan profile updated successfully', artisan: updatedArtisan }), { status: 200 });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.artisanNumber) {
      return new Response(JSON.stringify({ message: 'Artisan number already exists', code: 11000 }), { status: 400 });
    }
    return new Response(JSON.stringify({ message: 'Error updating artisan', error: error.message }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const { id } = await req.json();
    const artisan = await Artisan.findById(id);
    if (!artisan) {
      return new Response(JSON.stringify({ message: 'Artisan not found' }), { status: 404 });
    }
    // Delete the artisan's profile image from Cloudinary
    const imageKey = artisan.profileImage?.key;
    if (imageKey) {
      try {
        await deleteFileFromCloudinary(imageKey);
      } catch (err) {
        console.error('Cloudinary deletion failed:', err.message);
      }
    }

    // Cascade delete subcomponents and their images
    const modelsToDelete = [
      { name: 'ArtisanStory', field: 'artisan', imageField: 'images' },
      { name: 'ArtisanPlugin', field: 'artisan' },
      { name: 'ArtisanBanner', field: 'artisan', imageField: 'image' },
      { name: 'ArtisanBlog', field: 'artisan', imageField: 'images' },
      { name: 'ArtisanGallery', field: 'artisan', imageField: 'images' },
      {name:'ArtisanHighlights',field:'artisan'}
      
    ];

    for (const modelDef of modelsToDelete) {
      let Model;
      try {
        Model = require(`@/models/${modelDef.name}`).default || require(`@/models/${modelDef.name}`);
      } catch (e) {
        try { Model = require(`@/models/${modelDef.name}`); } catch (e2) { continue; }
      }
      // Find related docs
      const docs = await Model.find({ [modelDef.field]: id });
      for (const doc of docs) {
        // Delete images from Cloudinary if present
        if (modelDef.imageField && doc[modelDef.imageField]) {
          // Handle array or object
          const img = doc[modelDef.imageField];
          if (Array.isArray(img)) {
            for (const i of img) {
              if (i?.key) {
                try { await deleteFileFromCloudinary(i.key); } catch (e) { console.error('Cloudinary deletion failed:', e.message); }
              }
            }
          } else if (img?.key) {
            try { await deleteFileFromCloudinary(img.key); } catch (e) { console.error('Cloudinary deletion failed:', e.message); }
          }
        }
        await Model.findByIdAndDelete(doc._id);
      }
    }

    // Finally, delete the artisan
    await Artisan.findByIdAndDelete(id);
    return new Response(JSON.stringify({ message: 'Artisan and all related data deleted successfully' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), { status: 500 });
  }
}

