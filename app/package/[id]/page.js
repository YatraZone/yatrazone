import Image from "next/image"
import {
    MapPin,
    Calendar,
    Clock,
    Tag,
    Star,
    Check,
    X,
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
import toast from "react-hot-toast"
import { DismissableInfoBox } from "@/components/Package/NoticeBox"
import RandomTourPackageSection from "@/components/RandomTourPackageSection"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import connectDB from "@/lib/connectDB"
import Package from "@/models/Package"

const getPackageById = async (id) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getPackageById/${id}`);

        if (!res.ok) {
            console.error(`Error fetching package: ${res.statusText}`);
            return null; // Return null when package is not found
        }

        const data = await res.json();
        if (data.error) {
            return null; // Return null if API returns an error
        }

        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        return null; // Return null on fetch failure
    }
};


const PackageDetailsPage = async ({ params }) => {
    const { id } = await params;
    await connectDB()
    const session = await getServerSession(authOptions);
    const packageDetails = await getPackageById(id);
    const reviews = await getReviewsById(id);

    const packages = await Package.find({}).limit(10).lean().exec();

    const user = session?.user
        ? await User.findOne({ _id: (session?.user?.id) }).lean()
        : null;
    const formatNumber = (number) => {
        return new Intl.NumberFormat('en-IN').format(number);
    };

    if (!packageDetails) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-3xl font-bold mb-4">Package Not Found</h1>
                <p className="mb-8">The package you are looking for does not exist or has been removed.</p>
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


    return (
        <SidebarInset>
            {/* Package Content */}
            <div className="min-h-screen mb-20 font-barlow">
                {/* Banner */}
                <div className="relative h-[300px] md:h-[300px] overflow-hidden w-full">
                    <Image
                        src={packageDetails.basicDetails?.imageBanner?.url || "https://dummyimage.com/600x400/000/fff"}
                        alt={packageDetails.packageName}
                        fill
                        className="object-cover md:object-fill"
                        priority
                    />
                </div>

                {/* Package Details */}
                <div className="md:w-full w-[22rem] mx-auto md:px-4 py-6">
                    <div className="bg-white rounded-lg  overflow-hidden">
                        {/* Package Header */}
                        <div className="lg:p-6 p-2 border-b">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                <div className="flex md:flex-row flex-col items-center gap-4">
                                    <Image
                                        src={packageDetails.basicDetails?.thumbnail?.url || "https://dummyimage.com/600x400/000/fff"}
                                        alt={packageDetails.packageName}
                                        width={300}
                                        height={300}
                                        className="object-cover w-full lg:w-96 rounded-xl aspect-video"
                                    />
                                    <div className="flex flex-col gap-2 lg:w-[50rem]">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Tag className="h-4 w-4" />
                                            <span className="font-medium">Package Code: <span className="font-bold tracking-wider text-black">{packageDetails.packageCode}</span></span>
                                        </div>
                                        <h2 className="text-2xl lg:text-4xl font-gilda font-bold w-full">{packageDetails.packageName}</h2>
                                        <div className="flex flex-wrap gap-4">
                                            <div className="flex items-center text-gray-600">
                                                <MapPin className="h-4 w-4 mr-1" />
                                                <span>Location: {packageDetails.basicDetails?.location}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                <span>Duration: {packageDetails.basicDetails?.duration}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Clock className="h-4 w-4 mr-1 " />
                                                <span>Tour Type: {packageDetails.basicDetails?.tourType}</span>
                                            </div>
                                            {packageDetails?.basicDetails?.heliBooking === "Yes" && (
                                                <div className="flex items-center text-gray-600">
                                                    <Image src="/helicopter.png" alt="Helicopter" width={20} height={20} className="h-6 w-6 mr-1" />
                                                    <span>Helicopter Tour: {packageDetails.basicDetails?.heliBooking}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 mt-4">
                                            <Button size="icon" className="bg-white border-2 border-blue-600 !p-6 hover:bg-blue-100 rounded-lg">
                                                <Link href={`tel:+918006000325`}><PhoneCall className="!h-6 !w-6 text-black" /></Link>
                                            </Button>
                                            <Button className="bg-green-600 border-2 border-green-300 !p-6 hover:bg-green-700 !text-white rounded-lg">
                                                <Link
                                                    href={`https://wa.me/918006000325?text=${encodeURIComponent(`I'm interested in your package ${packageDetails.packageName}`)}`}
                                                    className="flex items-center gap-2 text-lg"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <MessageCircle className="!h-6 !w-6 !text-white" />
                                                    Whatsapp
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:text-right w-fit">
                                    <div className="text-2xl font-bold text-primary">₹<span className="text-4xl text-blue-600">{formatNumber(packageDetails.price)}</span></div>
                                    <div className="text-sm text-gray-600 font-medium">{packageDetails.priceUnit}</div>
                                    <div className="flex items-center md:justify-end mt-1">
                                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                        <span className="ml-1 text-sm font-medium">{avgRating || 0}</span>
                                        <span className="ml-1 text-sm text-gray-500 font-medium">({reviews?.filter((review) => review.approved === true).length || 0} reviews)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {packageDetails?.basicDetails?.notice !== "" && <DismissableInfoBox packages={packageDetails} />}

                        {/* Action Buttons */}
                        <div className="p-6 bg-blue-100 border-b">
                            <div className="flex flex-col sm:flex-row gap-3 justify-center mx-auto">
                                <Link href={`/checkout/${packageDetails._id}`} className="flex-1">
                                    <button className="w-full flex items-center justify-center !py-4 text-lg border-2 border-blue-600 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                                        <ShoppingCart className="mr-2 !h-6 !w-6" />
                                        Package Checkout
                                    </button>
                                </Link>
                                <Link href={`/customEnquiry/${packageDetails._id}`} className="flex-1">
                                    <button className="w-full flex items-center justify-center !py-4 text-lg border-2 border-blue-600 hover:bg-white rounded-lg" variant="outline">
                                        <MessageSquare className="mr-2 !h-6 !w-6" />
                                        Custom Enquiry
                                    </button>
                                </Link>
                                {packageDetails.basicDetails?.planCalculator === 'Yes' &&
                                    (
                                        <Link href={`calculator/${packageDetails._id}`} className="flex-1">
                                            <button className="w-full flex items-center justify-center bg-transparent !py-4 text-lg border-2 border-blue-600 hover:bg-white rounded-lg">
                                                <Calculator className="mr-2 !h-6 !w-6" />
                                                Package Calculator
                                            </button>
                                        </Link>
                                    )
                                }
                            </div>
                        </div>


                        <Tabs defaultValue="overview">
                            <TabsList className="grid grid-cols-2 bg-transparent md:grid-cols-3 lg:grid-cols-6 mb-6 w-full">
                                <TabsTrigger
                                    className=" py-4 relative  border-black data-[state=active]:!shadow-none data-[state=active]:!rounded-none  data-[state=active]:text-black data-[state=active]:border-b-2 group"
                                    value="overview"
                                >
                                    Overview
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 
                    group-hover:w-full data-[state=active]:w-full"></span>
                                </TabsTrigger>

                                <TabsTrigger
                                    className="py-4 relative border-black data-[state=active]:!shadow-none data-[state=active]:!rounded-none data-[state=active]:text-black data-[state=active]:border-b-2 group"
                                    value="Day Plan"
                                >
                                    Day Plan
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 
                    group-hover:w-full data-[state=active]:w-full"></span>
                                </TabsTrigger>

                                <TabsTrigger
                                    className="py-4 relative border-black data-[state=active]:!shadow-none data-[state=active]:!rounded-none data-[state=active]:text-black data-[state=active]:border-b-2 group"
                                    value="Include/Exclude"
                                >
                                    Include/Exclude
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 
                    group-hover:w-full data-[state=active]:w-full"></span>
                                </TabsTrigger>

                                <TabsTrigger
                                    className="py-4 relative border-black data-[state=active]:!shadow-none data-[state=active]:!rounded-none data-[state=active]:text-black data-[state=active]:border-b-2 group"
                                    value="AdditionalInformation"
                                >
                                    Additional Information
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 
                    group-hover:w-full data-[state=active]:w-full"></span>
                                </TabsTrigger>

                                <TabsTrigger
                                    className="py-4 relative border-black data-[state=active]:!shadow-none data-[state=active]:!rounded-none data-[state=active]:text-black data-[state=active]:border-b-2 group"
                                    value="PolicyContent"
                                >
                                    Policy Content
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 
                    group-hover:w-full data-[state=active]:w-full"></span>
                                </TabsTrigger>

                                <TabsTrigger
                                    className="py-4 relative border-black data-[state=active]:!shadow-none data-[state=active]:!rounded-none data-[state=active]:text-black data-[state=active]:border-b-2 group"
                                    value="reviews"
                                >
                                    Reviews
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 
                    group-hover:w-full data-[state=active]:w-full"></span>
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-6 ">
                                {/* Description */}
                                {(packageDetails.basicDetails?.fullDesc) &&
                                    <div className="">
                                        <h3 className="text-2xl font-bold mb-4 px-2">• Description</h3>
                                        <div className="prose max-w-none">
                                            <div className="mb-4 capitalize font-semibold text-justify whitespace-pre-line px-6" dangerouslySetInnerHTML={{ __html: packageDetails.basicDetails?.fullDesc || "" }} />
                                        </div>
                                    </div>
                                }
                                {/* Location Map & Gallery Row (50% width each, only in overview section) */}
                                <div className="flex flex-col md:flex-row gap-8 my-8 w-full">
                                    {/* Location Map - only show if location exists */}
                                    {packageDetails.info?.filter((item) => item.typeOfSelection === "Location Map")[0]?.selectionDesc && (
                                        <div className="w-full">
                                            <h3 className="text-xl font-bold mb-4">Location</h3>
                                            <PackageMap location={packageDetails.info?.filter((item) => item.typeOfSelection === "Location Map")[0]?.selectionDesc} />
                                        </div>
                                    )}
                                    {/* Gallery */}
                                    {/* <div className="w-full md:w-1/2">
                                        <h3 className="text-xl font-bold mb-4">Gallery</h3>
                                        <PackageGallery images={packageDetails.basicDetails?.gallery || []} />
                                    </div> */}
                                </div>
                            </TabsContent>

                            {/* Day Plan */}
                            <TabsContent value="Day Plan" className="space-y-6">
                                {packageDetails.info?.filter((info) => info.typeOfSelection === "Day Plan")?.length > 0 &&
                                    <>
                                        <h3 className="text-2xl font-bold mb-4 px-2">• Day Plan</h3>
                                        <Accordion type="single" collapsible className="w-full">
                                            {packageDetails.info?.filter((info) => info.typeOfSelection === "Day Plan")?.map((day) => (
                                                <AccordionItem key={day._id} value={`day-${day.selectionTitle}`} className="my-4 border-black">
                                                    <AccordionTrigger className="text-left px-4 rounded-xl hover:no-underline">
                                                        <div>
                                                            <span className="font-bold text-lg">{day.selectionTitle}</span>
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent>
                                                        <div className="py-2 px-6 text-base whitespace-pre-line" dangerouslySetInnerHTML={{ __html: day.selectionDesc }} />
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </>
                                }
                            </TabsContent>

                            <TabsContent value="Include/Exclude" className="space-y-8">
                                {/* Inclusions & Exclusions */}
                                {packageDetails.info?.filter((info) => info.typeOfSelection === "Inclusions").length > 0 && (
                                    <div className="flex md:flex-row flex-col items-start justify-evenly gap-6">
                                        {/* Inclusions */}
                                        <div className="w-full overflow-x-auto">
                                            <h3 className="text-2xl font-bold mb-4 px-2">• Inclusions</h3>
                                            {packageDetails.info
                                                ?.filter((info) => info.typeOfSelection === "Inclusions")
                                                ?.map((item, index) => (
                                                    <div key={index} className="prose max-w-none px-6" dangerouslySetInnerHTML={{ __html: item.selectionDesc }} />
                                                ))}
                                        </div>
                                        {/* Exclusions */}
                                        <div className="w-full overflow-x-auto">
                                            <h3 className="text-2xl font-bold mb-4 px-2">• Exclusions</h3>
                                            {packageDetails.info
                                                ?.filter((info) => info.typeOfSelection === "Exclusions")
                                                ?.map((item, index) => (
                                                    <div key={index} className="prose max-w-none px-6" dangerouslySetInnerHTML={{ __html: item.selectionDesc }} />
                                                ))}
                                        </div>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="AdditionalInformation" className="space-y-8">
                                {/* FAQs */}
                                {packageDetails.info?.filter((info) => info.typeOfSelection === "Frequently Asked Questions").length > 0 && (
                                    <div>
                                        <h3 className="text-2xl font-bold mb-4 px-2">• Frequently Asked Questions</h3>
                                        {packageDetails.info
                                            ?.filter((info) => info.typeOfSelection === "Frequently Asked Questions")
                                            ?.map((item, index) => (
                                                <div key={index} className="prose max-w-none px-6" dangerouslySetInnerHTML={{ __html: item.selectionDesc }} />
                                            ))}
                                    </div>
                                )}

                                {/* Important Information */}
                                {packageDetails.info?.filter((info) => info.typeOfSelection === "Important Information").length > 0 && <div className="pt-12">
                                    <h3 className="text-2xl font-bold">• Important Information</h3>
                                    <div className="p-4">
                                        <div className="flex items-start">
                                            <Accordion type="single" collapsible className="w-full">
                                                {packageDetails.info?.filter((info) => info.typeOfSelection === "Important Information")?.map((info, index) => (
                                                    <AccordionItem key={index} value={`info-${index}`} className="border-yellow-400">
                                                        <AccordionTrigger className="text-left text-lg">{info.selectionTitle}</AccordionTrigger>
                                                        <AccordionContent>
                                                            <div className="py-2 px-6 text-base whitespace-pre-line" dangerouslySetInnerHTML={{ __html: info.selectionDesc }} />
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                ))}
                                            </Accordion>
                                        </div>
                                    </div>
                                </div>}

                                {/* Other */}
                                {packageDetails.info?.filter((info) => info.typeOfSelection === "Other").length > 0 && <div className="pt-12">
                                    <h3 className="text-2xl font-bold">• Other</h3>
                                    <div className="p-4">
                                        <div className="flex items-start">
                                            <Accordion type="single" collapsible className="w-full">
                                                {packageDetails.info?.filter((info) => info.typeOfSelection === "Other")?.map((info, index) => (
                                                    <AccordionItem key={index} value={`info-${index}`} className="border-black">
                                                        <AccordionTrigger className="text-left text-lg">{info.selectionTitle}</AccordionTrigger>
                                                        <AccordionContent>
                                                            <div className="py-2 px-6 text-base whitespace-pre-line" dangerouslySetInnerHTML={{ __html: info.selectionDesc }} />
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                ))}
                                            </Accordion>
                                        </div>
                                    </div>
                                </div>}
                            </TabsContent>

                            <TabsContent value="PolicyContent" className="space-y-8">
                                {/* Policies */}
                                {packageDetails.info?.filter((info) => info.typeOfSelection === "Policy Content").length > 0 && <div>
                                    <h3 className="text-2xl font-bold mb-4 px-2">• Policies</h3>
                                    <div className="space-y-4 px-2">
                                        {packageDetails.info?.filter((info) => info.typeOfSelection === "Policy Content")?.map((policy, index) => (
                                            <div key={index}>
                                                <h4 className="font-semibold px-4">{policy.selectionTitle}</h4>
                                                {policy.selectionDesc.split("\n")?.map((line, lineIndex) => (
                                                    <p key={lineIndex} className="text-gray-700 whitespace-pre-line px-6">{line}</p>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>}
                            </TabsContent>

                            <TabsContent value="reviews" className="space-y-6">
                                {/* Write Review Form */}
                                <div>
                                    <h3 className="text-2xl font-bold mb-4">• Write a Review</h3>
                                    <ReviewForm user={sanitizedUser} packageName={packageDetails.packageName} packageId={packageDetails._id} />
                                </div>

                                <div className="flex md:flex-row flex-col justify-between md:items-center">
                                    <h3 className="text-2xl font-bold">• Customer Reviews</h3>
                                    <div className="flex items-center">
                                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                        <span className="ml-1 font-bold">{avgRating || 0}</span>
                                        <span className="ml-1 text-gray-500">({reviews.filter((review) => review.approved === true).length || 0} reviews)</span>
                                    </div>
                                </div>

                                {/* Reviews List */}
                                <div className="space-y-4">
                                    {reviews.filter((review) => review.approved === true).length > 0 ? reviews?.filter((review) => review.approved === true)?.map((review, index) => (
                                        <Card key={index}>
                                            <CardContent>
                                                <div className="mt-4">
                                                    <h4 className="font-semibold">{review.user.name}</h4>
                                                    <div className="flex items-center mt-1">
                                                        {[...Array(5)]?.map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                                                            />
                                                        ))}
                                                        <span className="ml-2">({review.rating}.0)</span>
                                                        <span className="ml-2 text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric' })}</span>
                                                    </div>
                                                </div>
                                                <p className="mt-4 text-gray-700 italic">{review.message}</p>
                                            </CardContent>
                                        </Card>
                                    )) : (
                                        <div className="flex flex-col justify-center items-center pb-4 min-h-[20rem]">
                                            <Star className="h-10 w-10 text-yellow-500 fill-yellow-500" />
                                            <h4 className="font-semibold text-lg text-center">No Reviews</h4>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>

                        {/* Gallery */}
                        {packageDetails?.gallery?.length > 0 &&
                            <div className="p-6">
                                <h3 className="text-2xl font-bold mb-4">• Gallery</h3>
                                <PackageGallery images={packageDetails.gallery} />
                            </div>
                        }

                        {packages.length > 0 && <div className="p-6 bg-white">
                            <h3 className="text-2xl font-bold mb-4">You Might Also Like</h3>
                            <Carousel className="max-w-lg lg:max-w-3xl xl:max-w-5xl mx-auto my-6 md:my-10 w-[80%] md:w-full">
                                <CarouselContent className="-ml-1 w-full">
                                    {packages.map((item, index) => (
                                        <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3 xl:basis-1/3">
                                            <div className="p-1">
                                                <Card>
                                                    <CardContent className="p-0 rounded-xl flex flex-col h-[420px] justify-between">
                                                        <Image
                                                            src={item?.basicDetails?.thumbnail?.url || "/RandomTourPackageImages/u1.jpg"}
                                                            alt={item?.packageName}
                                                            width={1280}
                                                            height={720}
                                                            quality={50}
                                                            className="rounded-t-xl w-full h-full"
                                                        />
                                                        <div className="p-4 flex flex-col gap-2 ">
                                                            <div className="flex xl:flex-row flex-col gap-2 xl:items-center justify-between font-barlow">
                                                                <p className="flex items-center gap-2 text-blue-600 text-sm font-semibold">
                                                                    <MapPin size={20} /> {item?.basicDetails?.location}
                                                                </p>
                                                                <p className="flex items-center gap-2 text-blue-600 text-sm font-semibold">
                                                                    <CalendarClock size={20} /> {item?.basicDetails?.duration} Days {item?.basicDetails?.duration - 1} Nights
                                                                </p>
                                                            </div>
                                                            <p className="font-bold text-2xl line-clamp-2">{item?.packageName}</p>
                                                        </div>
                                                        <div className="h-px bg-gray-200" />
                                                        <div className="p-4 flex xl:flex-row flex-col xl:items-center justify-between gap-2 font-barlow">
                                                            <div>
                                                                <p className="text-sm">
                                                                    Starting From:{" "}
                                                                    <span className="font-bold text-blue-600">
                                                                        ₹<span className="text-xl">{formatNumeric(item?.price)}</span>
                                                                    </span>
                                                                </p>
                                                                <p className="text-xs font-semibold">Onwards</p>
                                                            </div>
                                                            <Link href={`/package/${item._id}`}>
                                                                <Button className="bg-blue-500 hover:bg-blue-600 uppercase rounded-sm">Learn more</Button>
                                                            </Link>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </div>}
                    </div>
                </div>
            </div>
        </SidebarInset>
    )
}

export default PackageDetailsPage