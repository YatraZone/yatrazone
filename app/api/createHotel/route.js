import connectDB from "@/lib/connectDB";
import { NextResponse } from "next/server";
import Hotel from "@/models/Hotel";

export async function GET() {
    await connectDB();
    try {
        const hotels = await Hotel.find().sort({ createdAt: -1 });
        return NextResponse.json(hotels);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    await connectDB();
    const body = await req.json();

    const { category, name, location, image, imageClickLink } = body;

    if (!category || !name || !location) {
        return NextResponse.json({ error: "Category, name and location are required" }, { status: 400 });
    }

    try {
        const hotel = await Hotel.create({ category, name, location, image, imageClickLink });
        return NextResponse.json(hotel);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    await connectDB();
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
        return NextResponse.json({ error: "Hotel ID is required" }, { status: 400 });
    }

    try {
        const hotel = await Hotel.findByIdAndUpdate(id, updateData, { new: true });
        if (!hotel) {
            return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
        }
        return NextResponse.json(hotel);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    await connectDB();
    const { id } = await req.json();

    try {
        const hotel = await Hotel.findByIdAndDelete(id);
        if (!hotel) {
            return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Hotel deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
