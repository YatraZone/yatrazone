"use client";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
const Banner = () => {
  const [promotinalBanner, setPromotinalBanner] = useState([]);
  const [featuredOffer, setFeaturedOffer] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const [bannerSection2nd, setBannerSection2nd] = useState([]);

  const [consultancyBanner, setConsultancyBanner] = useState([]);

  // Hotels state
  const [hotels, setHotels] = useState([]);
  const [hotelCategories, setHotelCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [hotelsLoading, setHotelsLoading] = useState(true);
  // console.log(promotinalBanner)
  const fetchPromotinalBanner = async () => {
    try {
      const res = await fetch("/api/addConsultancyBanner");
      const data = await res.json();
      // console.log("Consultancy Banner API response:", data);
      if (data && data.length > 0) {
        setConsultancyBanner(data);
      } else {
        setConsultancyBanner([]);
      }
    } catch (error) {
      // console.error("Error fetching products:", error);
      setConsultancyBanner([]);
    }
  };

  const fetchHotels = async () => {
    setHotelsLoading(true);
    try {
      const [hotelsRes, catsRes] = await Promise.all([
        fetch("/api/createHotel"),
        fetch("/api/hotelCategory"),
      ]);
      const hotelsData = await hotelsRes.json();
      const catsData = await catsRes.json();
      setHotels(Array.isArray(hotelsData) ? hotelsData : []);
      setHotelCategories(Array.isArray(catsData) ? catsData : []);
    } catch (error) {
      setHotels([]);
      setHotelCategories([]);
    }
    setHotelsLoading(false);
  };

  useEffect(() => {
    fetchPromotinalBanner();
    fetchHotels();
  }, []);

  const filteredHotels = activeCategory === "All"
    ? hotels
    : hotels.filter((h) => h.category === activeCategory);

  return (
    <>
      <div className="w-full overflow-hidden max-w-screen overflow-x-hidden">
        {consultancyBanner.length > 0 && (
          <div className="w-full px-2 md:py-10">
            <h2 className="font-recoleta text-2xl md:text-3xl font-bold text-center mb-2 uppercase">
              India Awaits - Walk the Land of Saints, Seekers, and Silence
            </h2>
            <p className="text-gray-600 text-center py-4 mx-auto md:w-[50%] font-sans">
              Traverse the spiritual heart of India where divinity flows, through every river and prayer echoes in every breeze, This all-India spiritual tour is designed for seekers fo peace , prupose and presence, From Himalayan shrine to souhtern ashrams, discover timeless traditions, guieded practices and sacred wisdom that nurture both body and soul.
            </p>
            <Carousel className="w-full md:px-20 mx-auto">
              <CarouselContent>
                {consultancyBanner.map((item, idx) => (
                  <CarouselItem
                    key={item._id || idx}
                    className="w-full md:basis-1/2"
                  >
                    <div className="flex flex-col md:flex-row md:h-[400px] h-[700px] rounded-xl overflow-hidden group px-2">
                      {/* Image Section */}
                      <div className="w-full h-full overflow-hidden border rounded-md border-gray-300">
                        <div className="relative w-full h-full">
                          <Image
                            src={item?.image?.url || "/placeholder.jpeg"}
                            alt={item?.title || "Consultancy Service"}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            priority={idx === 0}
                          />
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="w-full p-6 flex flex-col justify-center rounded-md">
                        <div>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`w-7 h-7 ${star <= (item.rating || 0)
                                  ? "text-orange-400"
                                  : "text-gray-300"
                                  }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="ml-2 text-sm text-gray-600">
                              {item.rating || 0}/5
                            </span>
                          </div>
                          <h3 className="text-2xl md:text-xl font-bold text-gray-900 my-3 line-clamp-2">
                            {item.title || "Title Come Here"}
                          </h3>
                          <p className="text-gray-600 max-h-60 overflow-hidden">
                            {item.shortDescription || "Short Description"}
                          </p>
                        </div>
                        <div className="mt-4">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              window.open(
                                item.buttonLink,
                                "_blank",
                                "noopener,noreferrer"
                              );
                            }}
                            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto md:mx-0 w-full justify-center"
                          >
                            View Details <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselNext className="!right-2 !top-1/2 !-translate-y-1/2 z-10 bg-white/80 hover:bg-white w-10 h-10 rounded-full shadow-md" />
              <CarouselPrevious className="!left-2 !top-1/2 !-translate-y-1/2 z-10 bg-white/80 hover:bg-white w-10 h-10 rounded-full shadow-md" />
            </Carousel>
          </div>
        )}

        {/* ===== HOTELS SECTION ===== */}
        <div className="w-full px-4 md:px-20 py-10">
          <h2 className="font-recoleta text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            Your style. These stays. A perfect match.
          </h2>
          <p className="text-sm text-gray-500 mb-5 font-sans">
            Handpicked hotels curated just for you
          </p>

          {/* Category Carousel */}
          <div className="mb-6 border-b border-gray-200 flex gap-5">
            <button
              onClick={() => setActiveCategory("All")}
              className={`pb-2.5 px-1 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${activeCategory === "All"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
              All
            </button>
            {hotelCategories.map((cat,key) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`pb-2.5 px-1 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${activeCategory === cat.name
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                  {cat.name}
                </button>
            ))}
          </div>
          {/* Skeleton Loading */}
          {hotelsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-xl h-48 w-full mb-3"></div>
                  <div className="bg-gray-200 rounded h-4 w-3/4 mb-2"></div>
                  <div className="bg-gray-200 rounded h-3 w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredHotels.length > 0 ? (
            <Carousel className="w-full" opts={{ align: "start" }}>
              <CarouselContent className="-ml-3">
                {filteredHotels.map((hotel) => (
                  <CarouselItem key={hotel._id} className="basis-1/2 md:basis-1/4 pl-3">
                    <Link
                      href={hotel.imageClickLink || "#"}
                      target={hotel.imageClickLink ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className="group cursor-pointer block"
                    >
                      <div className="relative w-full h-60 rounded-xl overflow-hidden mb-3">
                        {hotel.image?.url ? (
                          <Image
                            src={hotel.image.url}
                            alt={hotel.name}
                            fill
                            className="object-contain transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                            No Image
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm md:text-base">{hotel.name}</h3>
                      <p className="text-gray-500 text-xs md:text-sm">{hotel.location}</p>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="!-left-3 !top-1/3 !-translate-y-1/2 z-10 bg-white/90 hover:bg-white w-10 h-10 rounded-full shadow-md" />
              <CarouselNext className="!-right-3 !top-1/3 !-translate-y-1/2 z-10 bg-white/90 hover:bg-white w-10 h-10 rounded-full shadow-md" />
            </Carousel>
          ) : (
            <p className="text-gray-400 text-center py-8">No destination blogs found in this category.</p>
          )}
        </div>

      </div>
    </>

  );
};

export default Banner;
