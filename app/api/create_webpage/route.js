import connectDB from "@/lib/connectDB";
import Webpage from "@/models/Webpage";
import { NextResponse } from "next/server";

const ALLOWED_TEMPLATE_TYPES = new Set(["design1", "design2", "design3"]);

const sanitizeTemplateType = (templateType) => {
  if (ALLOWED_TEMPLATE_TYPES.has(templateType)) return templateType;
  return "design1";
};

export async function GET() {
  try {
    await connectDB();
    const webpages = await Webpage.find().sort({ createdAt: -1 });
    return NextResponse.json(webpages, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch webpages", message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const title = (body.title || "").trim();
    const slug = (body.slug || "").trim().toLowerCase();

    if (!title || !slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }

    const existing = await Webpage.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    const webpage = await Webpage.create({
      title,
      slug,
      active: typeof body.active === "boolean" ? body.active : true,
      templateType: sanitizeTemplateType(body.templateType),
    });

    return NextResponse.json(webpage, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create webpage", message: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    await connectDB();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Webpage id is required" }, { status: 400 });
    }

    const update = {};

    if (typeof body.title === "string") update.title = body.title.trim();
    if (typeof body.slug === "string") update.slug = body.slug.trim().toLowerCase();
    if (typeof body.active === "boolean") update.active = body.active;
    if (typeof body.templateType === "string") update.templateType = sanitizeTemplateType(body.templateType);

    const updated = await Webpage.findByIdAndUpdate(body.id, update, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json({ error: "Webpage not found" }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update webpage", message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Webpage id is required" }, { status: 400 });
    }

    const deleted = await Webpage.findByIdAndDelete(body.id);
    if (!deleted) {
      return NextResponse.json({ error: "Webpage not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Webpage deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete webpage", message: error.message }, { status: 500 });
  }
}
