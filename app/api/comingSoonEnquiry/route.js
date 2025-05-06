import connectDB from "@/lib/connectDB";
import ComingSoonEnquiry from "@/models/ComingSoonEnquiry";

export async function POST(req) {
  await connectDB();
  const data = await req.json();
  const enquiry = await ComingSoonEnquiry.create(data);
  return new Response(JSON.stringify(enquiry), { status: 201 });
}

export async function GET() {
  await connectDB();
  const enquiries = await ComingSoonEnquiry.find({})
    .populate("packageId")
    .sort({ createdAt: -1 })
    .lean();
  return new Response(JSON.stringify(enquiries), { status: 200 });
}

export async function DELETE(req) {
  await connectDB();
  const { id } = await req.json();
  const deleted = await ComingSoonEnquiry.findByIdAndDelete(id);
  if (deleted) {
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ success: false, error: "Not found" }), { status: 404 });
  }
}
