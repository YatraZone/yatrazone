import connectDB from "@/lib/connectDB";
import mongoose from 'mongoose';
import "@/models/Promotion";
import "@/models/ArtisanBlog";
import "@/models/ArtisanStory";
import "@/models/ArtisanPlugin";
import "@/models/ArtisanBanner";
import '@/models/ArtisanGallery';
import '@/models/ArtisanHighlights';

import Artisan from '@/models/Artisan';

export async function GET(req, { params }) {
  await connectDB();
  const id = await params.id;
  // console.log('Requested artisan id:', id);
  const artisan = await Artisan.findById(id)
    .populate('promotions')
    .populate('artisanBlogs')
    .populate('artisanStories')
    .populate('socialPlugin')
    .populate('artisanBanner')
    .populate('artisanGallery')
    .populate('artisanHighlights')
  if (!artisan || artisan.active !== true) {
    // console.log('Artisan not found for id:', id, 'Result:', artisan);
    return new Response(JSON.stringify({ message: 'Artisan not found', debug: { id, artisan } }), { status: 404 });
  }
  return new Response(JSON.stringify(artisan), { status: 200 });
}