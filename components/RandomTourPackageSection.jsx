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

const RandomTourPackageSection = () => {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const [bannerSection2nd, setBannerSection2nd] = useState([]);
  const fetchPackages = async () => {
    try {
      const res = await fetch("/api/getRandomPackages");
      const data = await res.json();
      // console.log(data.packages);

      if (data.packages && data.packages.length > 0) {
        setPackages(data.packages);
      } else {
        setPackages([]);
      }
    } catch (error) {
      // console.error("Error fetching packages:", error);
      setPackages([]);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBannerSection2nd = async () => {
    try {
      const response = await fetch("/api/bannerSection2nd");
      const data = await response.json();
      // console.log(data);
      setBannerSection2nd(data); // Use dummy data if API returns empty
    } catch (error) {
      // console.error('Error fetching data:', error);
      setBannerSection2nd([]); // Use dummy data on error
    } finally {
      setIsLoading(false);
      setLoading1(false);
    }
  };
  useEffect(() => {
    fetchBannerSection2nd();
    fetchPackages();
  }, []);

  if (isLoading) {
    return (
      <section className="md:mt-19 w-full px-2 md:px-8 lg:px-16 bg-[url('/bg-custom-3.jpg')] overflow-hidden max-w-screen overflow-x-hidden">
        <div className=" w-full h-full overflow-hidden max-w-screen overflow-x-hidden">
          <div className="w-full py-10">
            <h2 className="flex items-center text-sm md:text-md lg:text-lg uppercase font-barlow font-semibold"></h2>
            <h1 className="font-bold text-xl md:text-3xl lg:text-4xl uppercase text-center">
              Trending Packages: The Best, Today
            </h1>
            <Carousel className="w-[75%] md:w-[95%] drop-shadow-xl mx-auto xl:w-full my-6 md:my-12">
              <CarouselContent className="-ml-1">
                {[...Array(4)].map((_, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
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

  const formatNumeric = (num) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };

  return (
    <>
      <section className="bg-[url('/bg-custom-5.jpg')] bg-cover bg-center md:mt-19 w-full md:px-8 lg:px-16 overflow-hidden max-w-screen overflow-x-hidden">
        <div className=" w-full h-full overflow-hidden max-w-screen ">
          <div className="w-full py-9 px-1 md:px-12">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mt-10">
              Trending Packages: The Best, Today
            </h1>
            <p className=" text-gray-600 py-8 text-center font-barlow w-[80%] mx-auto">
              Discover the hottest deals with our Trending Packages! Curated
              daily, these top-rated picks offer the best value and quality —
              handpicked for professionals who demand the best, today. Don’t
              miss out — elevate your experience now!
            </p>
            <Carousel
              className={`w-full md:w-[95%] drop-shadow-xl mx-auto my-4 ${
                packages.length > 0 ? "block" : "hidden"
              }`}
            >
              <CarouselContent className="-ml-1 w-full ">
                {packages.length > 0 &&
                  packages.map((item, index) => (
                    <CarouselItem
                      key={index}
                      className="pl-1 md:basis-1/2 lg:basis-1/4 min-w-0 snap-start"
                    >
                      <div className="p-1">
                        <Card>
                          <CardContent className="justify-between bg-white rounded-xl shadow p-2 flex flex-col h-full relative overflow-hidden group">
                            <div className="relative w-full h-48 md:h-48 mb-3 rounded-lg overflow-hidden">
                              <Image
                                src={
                                  item?.basicDetails?.thumbnail?.url ||
                                  "/RandomTourPackageImages/u1.jpg"
                                }
                                alt={item?.packageName || "Tour package image"}
                                width={1280}
                                height={720}
                                quality={50}
                                className="rounded-t-xl w-full h-full object-fill"
                              />
                            </div>
                            <div className="px-2 py-4 flex flex-col gap-2">
                              <div className="flex gap-2 xl:items-center justify-between font-barlow">
                                <p className="flex items-center gap-2 text-blue-600 text-sm font-semibold">
                                  <MapPin size={20} />{" "}
                                  {item?.basicDetails?.location}
                                </p>
                                <p className="flex items-center gap-2 text-blue-600 text-sm font-semibold">
                                  <CalendarClock size={20} />{" "}
                                  {item?.basicDetails?.duration} Days{" "}
                                  {item?.basicDetails?.duration - 1} Nights
                                </p>
                              </div>
                              <p className="font-bold text-md line-clamp-2">
                                {item?.packageName}
                              </p>
                            </div>
                            <div className="h-px bg-gray-200 my-1" />

                            <div className="p-4 flex xl:flex-row flex-col xl:items-center justify-between gap-2 font-barlow">
                              <div>
                                <p className="text-sm">
                                  Starting From:{" "}
                                  <span className="font-bold text-blue-600">
                                    {item?.price === 0 ? (
                                      <span className="text-xl">XXXX*</span>
                                    ) : (
                                      <>
                                        ₹
                                        <span className="text-xl">
                                          {formatNumeric(item?.price)}*
                                        </span>
                                      </>
                                    )}
                                  </span>
                                </p>
                                <p className="text-xs font-semibold">Onwards</p>
                              </div>
                              <Link href={`/package/${item._id}`}>
                                <Button className="bg-blue-500 hover:bg-blue-600 uppercase rounded-sm">
                                  Learn more
                                </Button>
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
      <section className="relative w-full">
        {loading1 ? (
          // Skeleton loader
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-4">
              {[...Array(2)].map((_, idx) => (
                <div
                  key={idx}
                  className="h-[220px] md:h-[400px] rounded-2xl overflow-hidden bg-gray-200 animate-pulse"
                />
              ))}
            </div>
          </div>
        ) : (
          // Actual content
          bannerSection2nd.map((item, idx) => (
            <div className="w-full" key={item._id}>
              <div className="grid grid-cols-1 gap-5 md:gap-4 overflow-hidden">
                <div className="hidden md:flex flex-col md:h-[430px] overflow-hidden relative group">
                  <Link
                    href={item.buttonLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <img
                      src={item.image?.url}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>
                </div>
                <div className="md:hidden flex flex-col h-[450px] overflow-hidden relative group">
                  <Link
                    href={item.buttonLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <img
                      src={item.mobileImage?.url}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    </>
  );
};

export default RandomTourPackageSection;
