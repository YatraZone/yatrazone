// app/api/createPropertyDetails/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import Package from '@/models/Package';
export async function GET() {
    try {
        await connectDB();
        const properties = await Package.find({isTrending:true})
        .select('packageName')
        .sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: properties });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch properties' },
            { status: 500 }
        );
    }
}