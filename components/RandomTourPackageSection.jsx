"use client";

import { useEffect, useState } from "react";
import { CalendarClock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";

const instagramImages = [
    "https://cdn.pixabay.com/photo/2020/04/21/22/55/balance-5074935_1280.jpg",
    "/RandomTourPackageImages/u2.jpg",
    "/RandomTourPackageImages/u3.jpg",
    "/RandomTourPackageImages/u4.jpg",
    "/RandomTourPackageImages/u5.jpg",
    "/RandomTourPackageImages/u6.jpg",
    "/RandomTourPackageImages/u7.jpg",
    "/RandomTourPackageImages/u1.jpg",
    "/RandomTourPackageImages/u2.jpg",
    "/RandomTourPackageImages/u3.jpg",
    "/RandomTourPackageImages/u4.jpg",
    "/RandomTourPackageImages/u5.jpg",
    "/RandomTourPackageImages/u6.jpg",
    "/RandomTourPackageImages/u7.jpg"
];

const RandomTourPackageSection = () => {
    const [packages, setPackages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [blogs, setBlogs] = useState([]);
    const [isBlogsLoading, setIsBlogsLoading] = useState(true);
    const [instagramPosts, setInstagramPosts] = useState([]);
    const [isInstaLoading, setIsInstaLoading] = useState(true);
    const [facebookPosts, setFacebookPosts] = useState([]);
    const [isFbLoading, setIsFbLoading] = useState(true);

    useEffect(() => {
        const fetchInstagramPosts = async () => {
            try {
                const res = await fetch("/api/instagram-posts");
                const data = await res.json();
                // console.log(data);
                setInstagramPosts(data);
            } catch (error) {
                setInstagramPosts([]);
            } finally {
                setIsInstaLoading(false);
            }
        };
        fetchInstagramPosts();
    }, []);
    useEffect(() => {
        const fetchFacebookPosts = async () => {
            try {
                const res = await fetch("/api/facebook-posts");
                const data = await res.json();
                // console.log(data);
                setFacebookPosts(data);
            } catch (error) {
                setFacebookPosts([]);
            } finally {
                setIsFbLoading(false);
            }
        };
        fetchFacebookPosts();
    }, []);
    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res = await fetch("/api/getRandomPackages");
                const data = await res.json();

                if (data.packages && data.packages.length > 0) {
                    setPackages(data.packages);
                } else {
                    setPackages([]);
                }
            } catch (error) {
                console.error("Error fetching packages:", error);
                setPackages([]);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchBlogs = async () => {
            try {
                const res = await fetch("/api/blogs");
                const data = await res.json();
                console.log(data);  
                if (Array.isArray(data)) {
                    setBlogs(data);
                } else if (Array.isArray(data.blogs)) {
                    setBlogs(data.blogs);
                } else {
                    setBlogs([]);
                }
            } catch (error) {
                console.error("Error fetching blogs:", error);
                setBlogs([]);
            } finally {
                setIsBlogsLoading(false);
            }
        };

        fetchPackages();
        fetchBlogs();
    }, []);

    if (isLoading) {
        return (
            <section className="md:mt-19 w-full px-2 md:px-8 lg:px-16 bg-[url('/bg-custom-3.jpg')] overflow-hidden max-w-screen overflow-x-hidden">
                <div className=" w-full h-full overflow-hidden max-w-screen overflow-x-hidden">
                    <div className="w-full py-10">
                        <h2 className="flex items-center text-sm md:text-md lg:text-lg uppercase font-barlow font-semibold">

                        </h2>
                        <h1 className="font-bold text-xl md:text-3xl lg:text-4xl uppercase "> Trending Packages: The Best, Today</h1>
                        <Carousel className="w-[75%] md:w-[95%] drop-shadow-xl mx-auto xl:w-full my-6 md:my-12">
                            <CarouselContent className="-ml-1">
                                {[...Array(4)].map((_, index) => (
                                    <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                                        <div className="p-1">
                                            <Card>
                                                <CardContent className="p-0 rounded-xl flex flex-col aspect-video object-cover justify-between">
                                                    <Skeleton className="rounded-t-xl w-full h-[200px]" />
                                                    <div className="p-4 flex flex-col gap-2 h-36">
                                                        <div className="flex items-center justify-between font-barlow">
                                                            <Skeleton className="w-1/2 h-4" />
                                                            <Skeleton className="w-1/3 h-4" />
                                                        </div>
                                                        <Skeleton className="w-2/3 h-6" />
                                                    </div>
                                                    <div className="h-px bg-gray-200" />
                                                    <div className="p-4 flex items-center justify-between gap-2 font-barlow">
                                                        <div>
                                                            <Skeleton className="w-1/2 h-4" />
                                                            <Skeleton className="w-1/3 h-4" />
                                                        </div>
                                                        <Skeleton className="w-[80px] h-[30px] rounded-sm" />
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
                    </div>
                </div>
            </section>
        );
    }

    const formatNumeric = (num) => { return new Intl.NumberFormat('en-IN').format(num) };

    // Combine both Instagram and Facebook posts for the card section
    const allPosts = [...instagramPosts, ...facebookPosts];

    // Determine card width based on number of posts
    const cardBasis = allPosts.length <= 3 ? `basis-1/${allPosts.length}` : "md:basis-1/5";

    return (
        <section className="bg-[url('/bg-custom-3.jpg')] md:mt-19 w-full px-2 md:px-8 lg:px-16 overflow-hidden max-w-screen overflow-x-hidden">
            <div className=" w-full h-full overflow-hidden max-w-screen overflow-x-hidden">
                <div className="w-full py-9 px-14">
                    <h2 className="flex items-center text-sm md:text-md lg:text-lg uppercase font-barlow font-semibold">

                    </h2>
                    <h1 className="font-black text-xl md:text-3xl lg:text-4xl uppercase ">Trending Packages: The Best, Today</h1>
                    <Carousel className={`w-[85%] md:w-[100%] drop-shadow-xl mx-auto my-6 md:my-12 ${packages.length > 0 ? "block" : "hidden"}`}>
                        <CarouselContent className="-ml-1 w-full">
                            {packages.length > 0 && packages.map((item, index) => (
                                <CarouselItem
                                    key={index}
                                    className="pl-1 md:basis-1/2 lg:basis-1/4 min-w-0 snap-start"
                                >
                                    <div className="p-1">
                                        <Card className="h-full">
                                            <CardContent className="p-0 rounded-xl flex flex-col h-[400px] justify-between">
                                                <Image
                                                    src={item?.basicDetails?.thumbnail?.url || "/RandomTourPackageImages/u1.jpg"}
                                                    alt={item?.packageName}
                                                    width={1280}
                                                    height={720}
                                                    quality={50}
                                                    className="rounded-t-xl w-full h-full"
                                                />
                                                <div className="p-4 flex flex-col gap-2">
                                                    <div className="flex xl:flex-row flex-col xl:items-center justify-between gap-2 font-barlow">
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
                                                <div className="p-4 flex items-center justify-between gap-2 font-barlow">
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

                    {/* Blog Carousel Section */}
                    <div className="w-full flex flex-col items-center mt-12">
                        <h1 className="text-xl md:text-3xl lg:text-4xl font-bold mb-2 text-left w-full">Our Blog</h1>
                        {/* <p className="text-left w-full max-w-4xl mb-6">Paragraph text line An intuitive WordPress theme with easy to use Editor and prebuilt websites are designed firm Creative & Photography business<br/>Paragraph text line An intuitive WordPress theme with easy to use Editor and prebuilt websites are designed firm Creative & Photography business<br/>Paragraph text line An intuitive WordPress theme with easy to use Editor and prebuilt websites with easy to use.</p> */}
                        <Carousel
                            className="w-full"
                        >
                            <CarouselContent
                                className="sm:-ml-4 flex  px-1 sm:px-0"
                            >
                                {(isBlogsLoading ? [] : blogs).map((blog, idx) => (
                                    <CarouselItem
                                        key={blog._id || idx}
                                        className="basis-[85vw] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 max-w-xs sm:max-w-sm md:max-w-md flex-shrink-0"
                                    >
                                        <div className="bg-white rounded-xl shadow p-4 flex flex-col h-full relative overflow-hidden group">
                                            <div className="relative w-full h-40 sm:h-48 mb-3 rounded-lg overflow-hidden">
                                                <Image
                                                    src={blog.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'}
                                                    alt={blog.title}
                                                    fill
                                                    className="object-cover w-full h-full"
                                                />
                                                <div className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">
                                                    {blog.date?.slice(0, 10) || ''}
                                                </div>
                                            </div>
                                            {/* NameCode and Role in one row, spaced between */}
                                            <div className="flex flex-row items-center justify-between mb-1">
                                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">{blog.nameCode}</span>
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">{blog.role}</span>
                                            </div>
                                            {/* Title below */}
                                            <div className="font-semibold text-md mb-1 line-clamp-2">{blog.title}</div>
                                            {/* shortDesc limited to 18 words */}
                                            <div className="text-xs text-gray-600 mb-2 flex-grow">
                                                {blog.shortDesc && blog.shortDesc.split(' ').length > 18
                                                    ? blog.shortDesc.split(' ').slice(0, 18).join(' ') + '...'
                                                    : blog.shortDesc}
                                            </div>
                                            <a
                                                href={blog.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-yellow-400 text-white px-4 py-2 rounded text-xs font-bold w-fit mt-auto"
                                            >
                                                READ MORE
                                            </a>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </div>

                    {/* Instagram-like Image Carousel using Carousel classes */}
                    <div className="w-full flex flex-col items-center mt-12">
                        <h2 className="text-center font-semibold text-lg md:text-xl mb-4">With YatraZone</h2>
                        {/* <p className="text-center text-xs md:text-sm text-gray-500 mb-4">Phasellus lorem malesuada ligula pulvinar commodo maecenas</p> */}
                        <Carousel>
                            <CarouselContent>
                                {isInstaLoading || isFbLoading ? (
                                    // Show skeletons while loading
                                    Array.from({ length: 5 }).map((_, idx) => (
                                        <CarouselItem key={idx} className="pl-1 md:basis-1/5">
                                            <div className="relative rounded-lg overflow-hidden w-full h-40 md:h-52 bg-gray-200 animate-pulse" />
                                        </CarouselItem>
                                    ))
                                ) : allPosts.length > 0 ? (
                                    allPosts.map((post, idx) => (
                                        <CarouselItem key={post._id || idx} className={`pl-1 ${allPosts.length <= 3 ? cardBasis : 'md:basis-1/5'}`} style={allPosts.length <= 3 ? { minWidth: `calc(100%/${allPosts.length})` } : {}}>
                                            <div className="relative group rounded-lg overflow-hidden w-full h-40 md:h-52 bg-gray-100">
                                                <Image
                                                    src={post.image}
                                                    alt={`${post.type === "facebook" ? "Facebook" : "Instagram"} ${idx}`}
                                                    width={400}
                                                    height={400}
                                                    className="object-cover w-full h-full"
                                                />
                                                <a
                                                    href={post.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                                                >
                                                    {post.type === "facebook" ? (
                                                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" className="w-10 h-10 opacity-80" />
                                                    ) : (
                                                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" className="w-10 h-10 opacity-80" />
                                                    )}
                                                </a>
                                            </div>
                                        </CarouselItem>
                                    ))
                                ) : (
                                    <div className="text-gray-500 col-span-full text-center py-8">No posts found</div>
                                )}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                        <button className="mt-6 px-8 py-2 bg-black text-white font-semibold rounded transition hover:bg-gray-900">Follow Us</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RandomTourPackageSection;