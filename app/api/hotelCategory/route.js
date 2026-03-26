import connectDB from "@/lib/connectDB";
import { NextResponse } from "next/server";
import HotelCategory from "@/models/HotelCategory";

export async function GET() {
    await connectDB();
    try {
        const categories = await HotelCategory.find().sort({ name: 1 });
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    await connectDB();
    const { name } = await req.json();

    if (!name || !name.trim()) {
        return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    try {
        const existing = await HotelCategory.findOne({ name: name.trim() });
        if (existing) {
            return NextResponse.json({ error: "Category already exists" }, { status: 400 });
        }
        const category = await HotelCategory.create({ name: name.trim() });
        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    await connectDB();
    const { id } = await req.json();

    try {
        await HotelCategory.findByIdAndDelete(id);
        return NextResponse.json({ message: "Category deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
