import ArtisanHighlights from '@/models/ArtisanHighlights';
import connectDB from "@/lib/connectDB";
import Artisan from '@/models/Artisan';

// GET: Return product highlights or all unique highlights if allTags=1
export async function GET(req) {
    await connectDB();
    const url = new URL(req.url, 'http://localhost');

    // Return all unique highlights
    if (url.searchParams.get('allTags') === '1') {
        const allHighlightsDocs = await ArtisanHighlights.find({}, 'highlights');
        const highlightsSet = new Set();
        allHighlightsDocs.forEach(doc => {
            if (Array.isArray(doc.highlights)) {
                doc.highlights.forEach(highlight => highlight && highlightsSet.add(highlight));
            }
        });
        return Response.json({ highlights: Array.from(highlightsSet) });
    }

    // Get highlights for a specific artisan
    const artisan = url.searchParams.get('artisan');
    if (artisan) {
        try {
            const entry = await ArtisanHighlights.findOne({ artisan });
            // If no entry exists, return empty highlights array
            if (!entry) {
                return Response.json({
                    success: true,
                    data: {
                        artisan,
                        highlights: []
                    }
                });
            }
            return Response.json({ success: true, data: entry });
        } catch (error) {
            return Response.json({ error: error.message }, { status: 500 });
        }
    }

    return Response.json({
        error: 'Missing required query parameter: allTags=1 or artisan=ID'
    }, { status: 400 });
}
// POST: Create or update highlights for an artisan
export async function POST(req) {
    await connectDB();
    try {
        const { artisan, highlights } = await req.json();

        // Validate input
        if (!artisan) {
            return Response.json({ error: 'Artisan ID is required.' }, { status: 400 });
        }

        // Validate highlights
        if (!Array.isArray(highlights) || highlights.length === 0) {
            return Response.json({
                error: 'At least one highlight is required.'
            }, { status: 400 });
        }

        // Clean and validate highlights
        const cleanHighlights = highlights
            .map(h => typeof h === 'string' ? h.trim() : '')
            .filter(h => h.length > 0);

        if (cleanHighlights.length === 0) {
            return Response.json({
                error: 'At least one valid highlight is required.'
            }, { status: 400 });
        }

        // Update or create the document
        const options = {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
        };

        const result = await ArtisanHighlights.findOneAndUpdate(
            { artisan },
            { $set: { highlights: cleanHighlights } },
            options
        );

        // Update the Artisan reference
        if (result?._id) {
            await Artisan.findByIdAndUpdate(
                artisan,
                { $set: { artisanHighlights: result._id } }
            );
        }

        return Response.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error saving highlights:', error);
        return Response.json({
            error: error.message || 'Failed to save highlights'
        }, { status: 500 });
    }
}

// PATCH: Update highlights for an artisan (only if exists)
export async function PATCH(req) {
    await connectDB();
    try {
        const { artisan, highlights } = await req.json();

        if (!artisan) {
            return Response.json({ error: 'Artisan ID is required.' }, { status: 400 });
        }

        // Check if the document exists first
        const existing = await ArtisanHighlights.findOne({ artisan });
        if (!existing) {
            return Response.json({
                error: 'No highlights found for this artisan. Use POST to create.'
            }, { status: 404 });
        }

        // Validate highlights
        if (!Array.isArray(highlights) || highlights.length === 0) {
            return Response.json({
                error: 'At least one highlight is required.'
            }, { status: 400 });
        }

        // Clean and validate highlights
        const cleanHighlights = highlights
            .map(h => typeof h === 'string' ? h.trim() : '')
            .filter(h => h.length > 0);

        if (cleanHighlights.length === 0) {
            return Response.json({
                error: 'At least one valid highlight is required.'
            }, { status: 400 });
        }

        const updated = await ArtisanHighlights.findOneAndUpdate(
            { artisan },
            { $set: { highlights: cleanHighlights } },
            { new: true }
        );

        return Response.json({
            success: true,
            data: updated
        });
    } catch (error) {
        console.error('Error updating highlights:', error);
        return Response.json({
            error: error.message || 'Failed to update highlights'
        }, { status: 500 });
    }
}

// DELETE: Delete highlights for an artisan
export async function DELETE(req) {
    await connectDB();
    try {
        const url = new URL(req.url, 'http://localhost');
        const artisan = url.searchParams.get('artisan');
        const id = url.searchParams.get('id');

        let result;
        let deletedArtisanId;

        if (artisan) {
            const doc = await ArtisanHighlights.findOne({ artisan });
            if (doc) {
                deletedArtisanId = doc.artisan;
                result = await ArtisanHighlights.deleteOne({ artisan });
                // Don't delete the Artisan, just remove the highlights reference
                await Artisan.findByIdAndUpdate(deletedArtisanId, { $unset: { artisanHighlights: 1 } });
            }
        } else if (id) {
            const doc = await ArtisanHighlights.findById(id);
            if (doc) {
                deletedArtisanId = doc.artisan;
                result = await ArtisanHighlights.deleteOne({ _id: id });
                // Remove the reference from the Artisan document
                if (deletedArtisanId) {
                    await Artisan.findByIdAndUpdate(deletedArtisanId, { $unset: { artisanHighlights: 1 } });
                }
            }
        } else {
            return Response.json({ error: "Artisan ID or highlights ID required." }, { status: 400 });
        }
        return Response.json({ success: true, data: result });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}