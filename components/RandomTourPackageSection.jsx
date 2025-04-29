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

const RandomTourPackageSection = () => {
    const [packages, setPackages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

        fetchPackages();
    }, []);

    if (isLoading) {
        return (
            <section className="">
                <div className="bg-[url('/bg-custom-3.jpg')] w-full h-full">
                    <div className="max-w-[22rem] md:max-w-[40rem] lg:max-w-[60rem] xl:max-w-[80rem] mx-auto py-10">
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
        <section className="md:mt-19">
            <div className="bg-[url('/bg-custom-3.jpg')] w-full h-full ">
                <div className="max-w-[22rem] md:max-w-[40rem] lg:max-w-[60rem] xl:max-w-[80rem] mx-auto py-10">
                    <h2 className="flex items-center text-sm md:text-md lg:text-lg uppercase font-barlow font-semibold">
                        
                    </h2>
                    <h1 className="font-black text-xl md:text-3xl lg:text-4xl uppercase ">Trending Packages: The Best, Today</h1>
                    <Carousel className={`w-[75%] md:w-[85%] drop-shadow-xl mx-auto my-6 md:my-12 ${packages.length > 0 ? "block" : "hidden"}`}>
                        <CarouselContent className="-ml-1 w-full">
                            {packages.length > 0 && packages.map((item, index) => (
                                <CarouselItem
                                    key={index}
                                    className="pl-1 md:basis-1/2 lg:basis-1/3 min-w-0 snap-start"
                                >
                                    <div className="p-1">
                                        <Card className="h-full">
                                            <CardContent className="p-0 rounded-xl flex flex-col h-[420px] justify-between">
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
                </div>
            </div>
        </section>
    );
};

export default RandomTourPackageSection;