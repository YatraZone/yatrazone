import { Suspense } from "react"

import CategoryBanner from "@/components/Category/category-banner"
import CategoryClient from "@/components/Category/CategoryClient"
import { Skeleton } from "@/components/ui/skeleton"
import { getReviewsById } from "@/actions/GetReviewsById"

const formatCategoryId = (categoryId) => {
    return categoryId
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export async function generateMetadata({ params }) {
    const { id } = await params
    return {
        title: `${formatCategoryId(id)}`,
    };
}

const getCategoryInfo = async (categoryId) => {
    return (
        {
            title: `${(categoryId?.title)} Tours`,
            bannerImage: `${(categoryId?.banner?.url) || `${process.env.NEXT_PUBLIC_BASE_URL}/categoryBanner.jpg`}`,
        }
    )
}

const CategoryPage = async ({ params }) => {
    const { id } = await params
    const [packageData, getCategory, menuItemsRaw] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getPackages/byId/${id}`)
            .then(res => res.json())
            .catch(() => ({})),
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getCategoryBanner/${id}`)
            .then(res => res.json())
            .catch(() => ({})),
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getAllMenuItems`)
            .then(res => res.json())
            .catch(() => []),
    ]);

    const packages = Array.isArray(packageData.packages) ? packageData.packages : [];
    const categoryInfo = await getCategoryInfo(getCategory)

    // Only show packages that are active
    const visiblePackages = packages.filter(pkg => pkg && pkg.active);

    // Pre-compute reviews for all packages
    const reviewsMap = {};
    await Promise.all(
        visiblePackages.map(async (pkg) => {
            try {
                const reviews = await getReviewsById(pkg._id);
                const approved = reviews.filter(r => r.approved);
                const total = approved.length;
                const sum = approved.reduce((acc, r) => acc + r.rating, 0);
                reviewsMap[pkg._id] = {
                    avg: total > 0 ? parseFloat((sum / total).toFixed(1)) : 0,
                    count: total,
                };
            } catch {
                reviewsMap[pkg._id] = { avg: 0, count: 0 };
            }
        })
    );

    // Serialize packages for client component
    const serializedPackages = visiblePackages.map(pkg => ({
        _id: pkg._id?.toString() || pkg._id,
        packageName: pkg.packageName,
        slug: pkg.slug,
        price: pkg.price || 0,
        basicDetails: {
            thumbnail: pkg.basicDetails?.thumbnail || null,
            location: pkg.basicDetails?.location || "",
            duration: pkg.basicDetails?.duration || 0,
            smallDesc: pkg.basicDetails?.smallDesc || "",
        },
    }));

    // Serialize menuItems for client
    const serializedMenuItems = (Array.isArray(menuItemsRaw) ? menuItemsRaw : []).map(item => ({
        _id: item._id?.toString() || item._id,
        title: item.title,
        active: item.active,
        subMenu: (item.subMenu || []).map(sub => ({
            _id: sub._id?.toString() || sub._id,
            title: sub.title,
            url: sub.url || "",
            active: sub.active,
        })),
    }));

    return (
        <div className="min-h-screen bg-gray-50 w-full mx-auto">
            {/* Banner */}
            <CategoryBanner title={categoryInfo.title} bannerImage={categoryInfo.bannerImage} />

            {/* Client-side filterable content */}
            <Suspense fallback={<PackageCardSkeleton count={6} />}>
                <CategoryClient
                    packages={serializedPackages}
                    reviews={reviewsMap}
                    menuItems={serializedMenuItems}
                    currentCategoryId={id}
                />
            </Suspense>
        </div>
    )
}

const PackageCardSkeleton = ({ count = 3 }) => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-xl p-4 mb-6">
                <Skeleton className="h-10 w-full mb-4" />
                <div className="flex gap-3">
                    <Skeleton className="h-9 w-32 rounded-full" />
                    <Skeleton className="h-9 w-24 rounded-full" />
                    <Skeleton className="h-9 w-28 rounded-full" />
                    <Skeleton className="h-9 w-28 rounded-full" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array(count)
                    .fill(0)
                    .map((_, index) => (
                        <div key={index} className="bg-white rounded-2xl overflow-hidden border">
                            <Skeleton className="h-52 w-full" />
                            <div className="p-4">
                                <Skeleton className="h-5 w-3/4 mb-3" />
                                <Skeleton className="h-4 w-1/2 mb-2" />
                                <Skeleton className="h-3 w-full mb-1" />
                                <Skeleton className="h-3 w-2/3 mb-4" />
                                <div className="flex justify-between items-center pt-3 border-t">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default CategoryPage