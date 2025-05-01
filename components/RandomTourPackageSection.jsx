"use client";

import { useEffect, useState } from "react";
import { CalendarClock, ChevronsLeft, ChevronsRight, MapPin } from "lucide-react";
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

const sampleBlogs = [
  {
    _id: "1",
    title: "Nunc sed pretium nisi",
    snippet: "Nunc sed pretium nisi. Mauris laoreet nunc felis, in condimentum exim placerat ac. Etiam tempus, orci.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    date: "10th Dec 2025",
    author: "Artist"
  },
  {
    _id: "2",
    title: "In tincidunt tellus eu elementum",
    snippet: "In tincidunt tellus eu elementum pellentesque. Vivamus in dictum massa. Quisque vitae tellus nec a.",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
    date: "12th Dec 2025",
    author: "Artist"
  },
  {
    _id: "3",
    title: "Nunc sed pretium nisi",
    snippet: "Nunc sed pretium nisi. Mauris laoreet nunc felis, in condimentum exim placerat ac. Etiam tempus, orci.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    date: "15th Dec 2025",
    author: "Artist"
  },
  {
    _id: "4",
    title: "In tincidunt tellus eu elementum",
    snippet: "In tincidunt tellus eu elementum pellentesque. Vivamus in dictum massa. Quisque vitae tellus nec a.",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
    date: "18th Dec 2025",
    author: "Artist"
  },
  {
    _id: "5",
    title: "Nunc sed pretium nisi",
    snippet: "Nunc sed pretium nisi. Mauris laoreet nunc felis, in condimentum exim placerat ac. Etiam tempus, orci.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    date: "10th Dec 2025",
    author: "Artist"
  },
  {
    _id: "6",
    title: "In tincidunt tellus eu elementum",
    snippet: "In tincidunt tellus eu elementum pellentesque. Vivamus in dictum massa. Quisque vitae tellus nec a.",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
    date: "12th Dec 2025",
    author: "Artist"
  },
  {
    _id: "7",
    title: "Nunc sed pretium nisi",
    snippet: "Nunc sed pretium nisi. Mauris laoreet nunc felis, in condimentum exim placerat ac. Etiam tempus, orci.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    date: "15th Dec 2025",
    author: "Artist"
  },
  {
    _id: "8",
    title: "In tincidunt tellus eu elementum",
    snippet: "In tincidunt tellus eu elementum pellentesque. Vivamus in dictum massa. Quisque vitae tellus nec a.",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
    date: "18th Dec 2025",
    author: "Artist"
  },
];

const RandomTourPackageSection = () => {
    const [packages, setPackages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [blogs, setBlogs] = useState([]);
    const [isBlogsLoading, setIsBlogsLoading] = useState(true);

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
                const res = await fetch("/api/getBlogs");
                const data = await res.json();
                if (data.blogs && data.blogs.length > 0) {
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

    return (
        <section className="bg-[url('/bg-custom-3.jpg')] md:mt-19 w-full px-2 md:px-8 lg:px-16 overflow-hidden max-w-screen overflow-x-hidden">
            <div className=" w-full h-full overflow-hidden max-w-screen overflow-x-hidden">
                <div className="w-full py-10 px-14">
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
                        <h1 className="text-xl md:text-3xl lg:text-4xl font-bold mb-2 text-left w-full">Our Blog Or Client Experience</h1>
                        {/* <p className="text-left w-full max-w-4xl mb-6">Paragraph text line An intuitive WordPress theme with easy to use Editor and prebuilt websites are designed firm Creative & Photography business<br/>Paragraph text line An intuitive WordPress theme with easy to use Editor and prebuilt websites are designed firm Creative & Photography business<br/>Paragraph text line An intuitive WordPress theme with easy to use Editor and prebuilt websites with easy to use.</p> */}
                        <Carousel>
                            <CarouselContent>
                                {(isBlogsLoading ? sampleBlogs : blogs.length ? blogs : sampleBlogs).map((blog, idx) => (
                                    <CarouselItem key={isBlogsLoading ? idx : blog._id || idx} className="pl-1 md:basis-1/4">
                                        <div className="bg-white rounded-xl shadow p-4 flex flex-col h-full">
                                            <div className="relative w-full h-48 mb-4">
                                                <Image
                                                    src={isBlogsLoading
                                                        ? blog.image
                                                        : blog.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'}
                                                    alt={isBlogsLoading ? blog.title : blog.title}
                                                    fill
                                                    className="object-cover rounded-lg"
                                                />
                                                <div className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">{isBlogsLoading ? blog.date : blog.date || ''}</div>
                                            </div>
                                            <div className="text-xs text-gray-500 mb-1">{isBlogsLoading ? blog.author : blog.author || ''}</div>
                                            <div className="font-semibold text-md mb-2">{isBlogsLoading ? blog.title : blog.title}</div>
                                            <div className="text-xs text-gray-600 mb-4 flex-grow">{isBlogsLoading ? blog.snippet : blog.snippet}</div>
                                            <button className="bg-yellow-400 text-white px-4 py-2 rounded text-xs font-bold w-fit">READ MORE</button>
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
                        <h2 className="text-center font-semibold text-lg md:text-xl mb-2">With YatraZone</h2>
                        {/* <p className="text-center text-xs md:text-sm text-gray-500 mb-4">Phasellus lorem malesuada ligula pulvinar commodo maecenas</p> */}
                        <Carousel>
                            <CarouselContent>
                                {instagramImages.slice(0, instagramImages.length - 4).map((src, idx) => (
                                    <CarouselItem key={src + idx} className="pl-1 md:basis-1/5">
                                        <div className="relative group rounded-lg overflow-hidden w-full h-40 md:h-52 bg-gray-100">
                                            <Image
                                                src='https://cdn.pixabay.com/photo/2020/04/21/22/55/balance-5074935_1280.jpg'
                                                alt={`Instagram ${idx}`}
                                                width={1280}
                                                height={720}
                                                className="object-cover w-full h-full"
                                            />
                                            <a
                                                href="https://www.instagram.com"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                                            >
                                                <img
                                                    src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
                                                    alt="Instagram"
                                                    className="w-10 h-10 opacity-80"
                                                />
                                            </a>
                                        </div>
                                    </CarouselItem>
                                ))}
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