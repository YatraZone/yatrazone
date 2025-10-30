import connectDB from "@/lib/connectDB";
import mongoose from 'mongoose';
import "@/models/Promotion";
import "@/models/ArtisanBlog";
import "@/models/ArtisanStory";
import "@/models/ArtisanPlugin";
import "@/models/ArtisanBanner";
import '@/models/ArtisanGallery'
import '@/models/ArtisanHighlights'
import Artisan from '@/models/Artisan';

export async function GET(req, { params }) {
  await connectDB();
  const slug = await params.slug;
  // console.log('Requested artisan id:', id);
  const artisan = await Artisan.findOne({ slug })
    .populate('promotions')
    .populate('artisanBlogs')
    .populate('artisanStories')
    .populate('socialPlugin')
    .populate('artisanBanner')
    .populate('artisanGallery')
    .populate('artisanHighlights')
  if (!artisan || artisan.active !== true) {
    // console.log('Artisan not found for id:', id, 'Result:', artisan);
    return new Response(JSON.stringify({ message: 'Artisan not found', debug: { slug, artisan } }), { status: 404 });
  }
  return new Response(JSON.stringify(artisan), { status: 200 });
}