import { NextResponse } from "next/server";
import Package from "@/models/Package";
import connectDB from "@/lib/connectDB";

export async function GET(req) {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim();

    if (!query || query.length < 2) {
        return NextResponse.json([], { status: 200 });
    }

    try {
        // Create a search string that requires all words to match
        const searchTerms = query.split(/\s+/).filter(term => term.length > 0);
        const searchQueries = searchTerms.map(term => ({
            $or: [
                { packageName: { $regex: term, $options: "i" } },
                { 'info.selectionTitle': { $regex: term, $options: "i" } },
                { 'info.selectionDesc': { $regex: term, $options: "i" } }
            ]
        }));

        const packages = await Package.find({
            $and: searchQueries
        })
        .limit(5)
        .select("packageName _id basicDetails.thumbnail.url basicDetails.location");

        return NextResponse.json(packages, { status: 200 });
    } catch (error) {
        console.error("Error fetching packages:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
