import Image from "next/image"
import PackageDetailClient from "@/components/Package/PackageDetailClient"
import {
    MapPin,
    Calendar,
    Clock,
    Tag,
    Star,
    Check,
    AlertTriangle,
    Calculator,
    MessageSquare,
    ShoppingCart,
    PhoneCall,
    MessageCircle,
    CalendarClock,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import ReviewForm from "@/components/Category/review-form"
import PackageGallery from "@/components/Category/package-gallery"
import PackageMap from "@/components/Category/package-map"
import Link from "next/link"
import { SidebarInset } from "@/components/ui/sidebar"
import User from "@/models/User"
import { getReviewsById } from "@/actions/GetReviewsById"
import { Card, CardContent } from "@/components/ui/card"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { DismissableInfoBox } from "@/components/Package/NoticeBox"
import connectDB from "@/lib/connectDB"
import Package from "@/models/Package"
import PackageCarouselWrapper from "@/components/PackageCarouselWrapper";
import FeaturedCarouselWrapper from "@/components/FeaturedCarouselWrapper";
import ComingSoon from "@/models/ComingSoon";
import ComingSoonEnquiryForm from "@/components/ComingSoonEnquiryForm";
import ImportantNotice from "@/components/ImportantNotice"

const getPackageBySlug = async (slug) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getPackageBySlug/${slug}`);

        if (!res.ok) {
            return null; // Return null when package is not found
        }

        const data = await res.json();
        if (data.error) {
            return null; // Return null if API returns an error
        }

        return data;
    } catch (error) {
        // console.error("Fetch error:", error);
        return null; // Return null on fetch failure
    }
};

// Fetch featured packages from the API
const getFeaturedPackages = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/featured-packages`);

        if (!res.ok) return [];
        const data = await res.json();
        // console.log(data);
        return data || [];
    } catch (error) {
        // console.error('Error fetching featured packages:', error);
        return [];
    }
};

// Helper: get Coming Soon package by id
const getComingSoonById = async (id) => {
    try {
        await connectDB();
        const pkg = await ComingSoon.findById(id).lean();
        // console.log(pkg)
        return pkg || null;
    } catch (e) {
        return null;
    }
};

const PackageDetailsPage = async ({ params }) => {
    const { slug } = await params;
    await connectDB();
    const session = await getServerSession(authOptions);
    // Try Package first
    let packageDetails = await getPackageBySlug(slug);
    let isComingSoon = false;
    if (!packageDetails) {
        // Try ComingSoon
        packageDetails = await getComingSoonById(slug);
        isComingSoon = !!packageDetails;
    }
    const reviews = await getReviewsById(slug);

    const packages = await Package.find({}).limit(10).lean().exec();

    const featuredPackages = await getFeaturedPackages();
    // console.log('SSR featuredPackages:', featuredPackages);

    const user = session?.user
        ? await User.findOne({ _id: (session?.user?.id) }).lean()
        : null;
    const formatNumber = (number) => {
        return new Intl.NumberFormat('en-IN').format(number);
    };

    if (!packageDetails) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-3xl font-bold mb-4">Package Not Available</h1>
                <p className="mb-8">This package is either not found or has been disabled by the admin.</p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/">Back to Home</Link>
                </Button>
            </div>
        );
    }




    const formatNumeric = (number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(number);
    };

    const sanitizedUser = JSON.parse(
        JSON.stringify({
            ...user,
            _id: user?._id?.toString(),
            packages: user?.packages?.map(pkg => pkg.toString()),
            orders: user?.orders?.map(order => order.toString()),
            reviews: user?.reviews?.map(review => ({
                ...review,
                _id: review._id?.toString(),
            })),
            createdAt: user?.createdAt?.toISOString(),
            updatedAt: user?.updatedAt?.toISOString(),
        })
    );

    const validReviews = Array.isArray(reviews) ? reviews.filter(review => review.approved === true) : [];

    const avgRating = validReviews.length > 0
        ? parseFloat(validReviews.reduce((total, review) => total + review.rating, 0) / validReviews.length)
        : 0;


    if (isComingSoon) {
        // --- COMING SOON PAGE ---
        return (
            <SidebarInset>
                <div className="min-h-screen mb-20 font-barlow">
                    {/* Banner */}
                    <div className="relative h-[120px] md:h-[300px] w-full overflow-hidden bg-gray-300 flex items-center justify-center">
                        {packageDetails.bannerUrl ? (
                            <Image src={packageDetails.thumbUrl} alt="Banner" fill className="object-cover" />
                        ) : (
                            <span className="text-2xl md:text-4xl font-bold text-gray-400">IMAGE BANNER</span>
                        )}
                    </div>
                    <div className="lg:p-6 p-2 border-b">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                            <div className="flex md:flex-row flex-col items-center gap-4">
                                {packageDetails.thumbUrl ? (
                                    <Image
                                        src={packageDetails.bannerUrl || "https://dummyimage.com/600x400/000/fff"}
                                        alt="Tour package image"
                                        width={300}
                                        height={300}
                                        
                                        className="object-cover w-full lg:w-96 rounded-xl aspect-video"
                                    />
                                ) : (
                                    <div className="w-full aspect-video bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500">Image<br />Update Soon</div>
                                )}
                                <div className="flex flex-col gap-2 lg:w-[50rem]">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Tag className="h-4 w-4" />
                                        <span className="font-medium">Package Code: <span className="font-bold tracking-wider text-2xl text-black">Not Available</span></span>
                                    </div>
                                    <h2 className="text-2xl lg:text-4xl font-gilda font-bold w-full">{packageDetails?.title}</h2>
                                    <div className="flex flex-wrap gap-4">
                                        <div className="flex items-center text-gray-600">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            <span>Location: {packageDetails.location}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            <span>Duration: {packageDetails.days} Days</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Clock className="h-4 w-4 mr-1 " />
                                            <span>Tour Type: {packageDetails.tourType}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 mt-4">
                                        <Button size="icon" className="bg-white border-2 border-blue-600 !p-6 hover:bg-blue-100 rounded-lg">
                                            <Link href={`tel:+918006000325`}><PhoneCall className="!h-6 !w-6 text-black" /></Link>
                                        </Button>
                                        <Button className="bg-green-600 border-2 border-green-300 !p-6 hover:bg-green-700 !text-white rounded-lg">
                                            <Link
                                                href={`https://wa.me/918006000325?text=${encodeURIComponent(`I'm interested in your package $sdfg`)}`}
                                                className="flex items-center gap-2 text-lg"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <MessageCircle className="!h-6 !w-6 !text-white" />
                                                Whatsapp
                                            </Link>
                                        </Button>
                                    </div>
                                    <h2 className="text-2xl lg:text-4xl font-gilda font-bold w-full">Price Currently Not Available</h2>
                                </div>
                            </div>
                            <div className="md:text-right w-fit">
                                <div className="text-2xl font-bold text-primary">
                                    {typeof packageDetails.price !== "number" || isNaN(packageDetails.price) || packageDetails.price === 0 ? (
                                        <span className="text-4xl text-blue-600">XXXX*</span>
                                    ) : (
                                        <>₹<span className="text-4xl text-blue-600">{formatNumber(packageDetails.price)}*</span></>
                                    )}
                                </div>
                                <div className="text-sm text-gray-600 font-medium">Per Person</div>
                                <div className="flex items-center md:justify-end mt-1">
                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                    <span className="ml-1 text-sm font-medium">{0}</span>
                                    <span className="ml-1 text-sm text-gray-500 font-medium">reviews</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* ENQUIRY FORM */}
                    <div className="rounded-lg p-8 mt-10 max-w-3xl mx-auto">
                        <ComingSoonEnquiryForm packageId={packageDetails._id?.toString()} />
                    </div>
                </div>
            </SidebarInset>
        );
    }

    return (
        <PackageDetailClient
            packageDetails={JSON.parse(JSON.stringify(packageDetails))}
            reviews={JSON.parse(JSON.stringify(reviews))}
            packages={JSON.parse(JSON.stringify(packages))}
            featuredPackages={JSON.parse(JSON.stringify(featuredPackages))}
            avgRating={avgRating}
            sanitizedUser={sanitizedUser}
            formatNumericStr={formatNumeric.toString()}
        />
    )
}

export default PackageDetailsPage