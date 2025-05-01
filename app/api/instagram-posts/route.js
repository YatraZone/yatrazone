import connectDB from "@/lib/connectDB";
import InstagramPost from '@/models/InstagramPost';

export async function GET(req) {
  await connectDB();
  const posts = await InstagramPost.find().sort({ createdAt: -1 });
  return Response.json(posts);
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const { image, link } = body;
  if (!image || !link) {
    return new Response(JSON.stringify({ error: 'Image and link are required.' }), { status: 400 });
  }
  const post = await InstagramPost.create({ image, link });
  return Response.json(post, { status: 201 });
}
export async function PATCH(req) {
  await connectDB();
  const body = await req.json();
  const { image, link, id } = body;
  if (!image || !link || !id) {
    return new Response(JSON.stringify({ error: 'Image, link, and id are required.' }), { status: 400 });
  }
  const post = await InstagramPost.findByIdAndUpdate(id, { image, link }, { new: true });
  return Response.json(post, { status: 200 });
}

export async function DELETE(req) {
  await connectDB();
  const body = await req.json();
  const { id } = body;
  if (!id) {
    return new Response(JSON.stringify({ error: 'ID is required.' }), { status: 400 });
  }
  const post = await InstagramPost.findByIdAndDelete(id);
  return Response.json(post, { status: 200 });
}