"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkle, ChevronLeft, ChevronRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import toast from "react-hot-toast";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/context/SearchContext";
import { CalendarClock, MapPin, Search, X } from "lucide-react";
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

  const HotelSearchForm = () => {
    const [query, setQuery] = useState("");
    const [packages, setPackages] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);
    const { isSearchOpen, setIsSearchOpen } = useSearch();
    const router = useRouter();

    useEffect(() => {
      const storedSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
      setRecentSearches(storedSearches);
    }, []);

    useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.ctrlKey && event.key === "k") {
          event.preventDefault();
          setIsSearchOpen(true);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleSearch = async (event) => {
      const value = event.target.value;
      setQuery(value);

      if (value.trim().length < 2) {
        setPackages([]); // hide dropdown if less than 2 chars
        return;
      }

      try {
        const res = await fetch(`/api/packages/search?q=${value}`);
        if (res.ok) {
          const data = await res.json();
          console.log(data)
          setPackages(data);
        } else {
          setPackages([]);
        }
      } catch (error) {
        setPackages([]);
      }
    };

    const handlePackageClick = (id, name) => {
      const updatedSearches = [{ id, name }, ...recentSearches.filter(item => item.id !== id)].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));

      router.push(`/package/${encodeURIComponent(id)}`);
      setIsSearchOpen(false);
    };

    const handleSubmit = () => {
      if (!query.trim()) return;
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsSearchOpen(false);
    };

    return (
      <div className="relative rounded-3xl shadow-xl p-10 w-full max-w-md mx-auto xl:max-w-lg xl:mx-0 xl:absolute xl:top-1/2 xl:right-20 xl:-translate-y-1/2 z-[999]">

        <h2 className="text-2xl font-bold mb-1">Packages</h2>
        <p className="text-gray-500 text-sm mb-6">Experience Effortless Bookings with Adani OneApp</p>
        <Form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative z-[50] w-full h-full">
            <Input
              type="text"
              placeholder="Search hotels or places..."
              className="w-full border rounded-lg px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={query || ""}
              onChange={handleSearch}
              autoComplete="off"
            />
            {/* Only show dropdown if there are packages and query is not empty */}
            {packages && packages.length > 0 && query.trim().length >= 2 && (
            <ul
            className="bg-red-900 absolute left-0 w-full bg-white border rounded-lg max-h-72 sm:max-h-90 overflow-y-auto  shadow-lg z-[100]">
                {packages.map((pkg, index) => {
                  const duration = pkg?.basicDetails?.duration;
                  const isValidDuration = typeof duration === 'number' && !isNaN(duration) && duration > 0;
                  return (
                    <li
                      key={pkg._id || index}
                      className="flex items-center gap-3 py-6 px-2 cursor-pointer hover:bg-blue-50 transition"
                      onClick={() => handlePackageClick(pkg._id, pkg.packageName)}
                    >
                      <img
                        src={pkg?.basicDetails?.thumbnail?.url || "/placeholder.jpg"}
                        alt={pkg.packageName}
                        className="w-12 h-12 rounded object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex-col">
                        <p className="font-semibold text-base truncate">{pkg.packageName}</p>
                        <p className="flex items-center gap-1 text-blue-600 text-xs font-semibold truncate">
                          <MapPin className="h-3 w-3 inline-block" />
                          {pkg?.basicDetails?.location}
                        </p>
                        <p className="flex items-center gap-1 text-blue-600 text-xs font-semibold">
                          <CalendarClock className="h-3 w-3 inline-block" />
                          {isValidDuration ? (
                            <>{duration} Days {duration - 1} Nights</>
                          ) : (
                            "Duration N/A"
                          )}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full py-3 font-semibold text-lg my-10">Search</Button>
        </Form>
      </div>
    );
  };

  if (isLoading) {
    return (
      <section className="relative xl:h-screen w-full overflow-hidden z-[160]">
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
      <div className="hidden xl:block w-full h-full">
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
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === selectedIndex ? "bg-white w-6" : "bg-white/50"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>


      {/* Hotel Search Form: Only visible on small screens */}
      <div className="block xl:hidden w-full h-full px-4 mt-[22%] relative max-h-[90vh]">
        <HotelSearchForm />
      </div>
    </section>
  );
};

export default HeroSection;