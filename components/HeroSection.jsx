"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkle, ChevronLeft, ChevronRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import toast from "react-hot-toast";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";

const HeroSection = () => {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [api, setApi] = useState();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));

  const dummyBanners = [
    { 
      title: "Welcome", 
      subTitle: "Explore Our Collection", 
      image: { url: "https://dummyimage.com/1280x720/000/fff" },
      link: "/"
    },
    { 
      title: "Discover", 
      subTitle: "Find Amazing Deals", 
      image: { url: "https://dummyimage.com/1280x720/333/fff" },
      link: "/products"
    },
    { 
      title: "Shop Now", 
      subTitle: "Limited Time Offers", 
      image: { url: "https://dummyimage.com/1280x720/666/fff" },
      link: "/offers"
    },
  ];

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch("/api/addBanner");
        const data = await response.json();
        setBanners(data.length ? data : dummyBanners);
      } catch (error) {
        toast.error("Failed to fetch banners");
        setBanners(dummyBanners);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setSelectedIndex(api.selectedScrollSnap());
    });
  }, [api]);

  if (isLoading) {
    return (
      <section className="relative xl:h-screen w-full overflow-hidden z-0">
        <Carousel className="h-full w-full" plugins={[plugin.current]} onMouseLeave={plugin.current.reset}>
          <CarouselContent className="h-full">
            {[...Array(4)].map((_, index) => (
              <CarouselItem key={index} className="h-[100vh] md:h-full">
                <div className="relative h-full w-full">
                  <Skeleton className="h-[100vh] w-full" />
                  <div className="absolute translate-y-1/2 top-1/3 translate-x-1/2 right-1/2 z-20 w-full">
                    <Skeleton className="h-6 w-3/4 mx-auto" />
                  </div>
                  <div className="absolute translate-y-1/2 bottom-1/2 translate-x-1/2 right-1/2 z-20 w-full">
                    <Skeleton className="h-12 w-3/4 mx-auto" />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>
    );
  }

  return (
    <section className="relative xl:h-screen w-full overflow-hidden z-0 group">
      <Carousel 
        className="h-full w-full" 
        plugins={[plugin.current]} 
        onMouseLeave={plugin.current.reset}
        setApi={setApi}
      >
        <CarouselContent className="h-full">
          {banners.map((item, index) => (
            <CarouselItem key={index} className="h-[100vh] md:h-full">
              <Link href={item.link || "#"} className="block h-full w-full">
                <div className="relative h-full w-full">
                  <Image
                    src={item?.image?.url}
                    alt={item?.title || "Banner Image"}
                    width={1280}
                    height={720}
                    quality={100}
                    priority
                    className="h-[100vh] w-full object-cover"
                  />
                  {item.subTitle || item.title ? (
                    <>
                      <div className="absolute translate-y-1/2 top-1/3 translate-x-1/2 right-1/2 z-20">
                        <h2 className="flex items-center gap-4 text-white text-lg md:text-xl lg:text-2xl text-center">
                          <Sparkle className="hidden md:block size-4 md:size-6" />
                          {item.subTitle}
                          <Sparkle className="hidden md:block size-4 md:size-6" />
                        </h2>
                      </div>
                      <div className="absolute translate-y-1/2 bottom-1/2 translate-x-1/2 right-1/2 z-20 w-full">
                        <h2 className="text-white font-bold text-3xl md:text-5xl lg:text-7xl text-center">
                          {item.title}
                        </h2>
                      </div>
                    </>
                  ) : null}
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows */}
        <CarouselPrevious className="left-4 md:left-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CarouselNext className="right-4 md:right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Carousel>

      {/* Custom Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === selectedIndex ? "bg-white w-6" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;