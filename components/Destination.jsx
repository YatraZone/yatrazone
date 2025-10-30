"use client";
import { useEffect, useState } from "react";
import { Star, X } from "lucide-react";
import {
  CalendarClock,
  MapPin,
  Heart,
  Bookmark,
  ArrowRight,
  Globe,
} from "lucide-react";
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
// import { useCart } from "../context/CartContext";
import { toast } from "react-hot-toast";

const RandomTourPackageSection = () => {
  const [products, setProducts] = useState([]);
  const [artisan, setArtisan] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [loading1, setLoading1] = useState(true);
  const [bannerSection3rd, setBannerSection3rd] = useState([]);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedReviews, setSelectedReviews] = useState([]);
  const ReviewModal = ({ open, onClose, reviews }) => {
    if (!open) return null;
    console.log(reviews);
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
        onClick={onClose}
      >
        <div
          className="max-w-xl w-full p-4 relative bg-white rounded-lg shadow-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute z-50 bg-gray-200 rounded-full p-2 top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
            onClick={onClose}
          >
            <X />
          </button>

          {reviews && reviews.length > 0 ? (
            <div className="h-[400px] overflow-y-auto px-2 py-5">
              {reviews.map((review, idx) => (
                <div
                  key={idx}
                  className="bg-[#f9fafb] border border-gray-200 rounded-xl p-6 mb-6 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    {/* Avatar and Name */}
                    <div className="flex items-center gap-3 mb-2">
                      <Image
                        src={review.image?.url || "/placeholder.jpeg"}
                        alt={review.createdBy}
                        width={48}
                        height={48}
                        className="rounded-full h-10 w-10 object-cover border border-gray-300"
                        style={{ minWidth: 48, minHeight: 48 }}
                      />
                      <span className="font-semibold text-base text-gray-900">
                        {review.createdBy}
                      </span>
                    </div>

                    {/* Stars and Verified */}
                    <div className="flex flex-col md:flex-row  items-center gap-2 md:mb-3">
                      <div className="flex">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star
                            key={i}
                            size={20}
                            color="#12b76a"
                            fill="#12b76a"
                          />
                        ))}
                      </div>
                      <span className="text-green-600 font-medium flex items-center gap-1 text-sm ml-2">
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="#12b76a"
                            d="M9.5 17.5l-5-5 1.4-1.4 3.6 3.6 7.6-7.6 1.4 1.4-9 9z"
                          />
                        </svg>
                        Verified
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="text-[16px] font-bold text-gray-800 my-2">
                    {review.title}
                  </div>

                  {/* Review Text */}
                  <div
                    className="text-gray-500 text-[15px] font-normal leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: review.shortDescription,
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">No reviews yet.</div>
          )}
        </div>
      </div>
    );
  };
  // Prevent background scroll when Quick View is open
  useEffect(() => {
    if (quickViewProduct) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [quickViewProduct]);

  // Fetch Artisan
  const fetchArtisan = async () => {
    try {
      const res = await fetch("/api/createArtisan");
      const data = await res.json();
      // console.log(data);
      // Ensure artisan is always an array
      if (Array.isArray(data)) {
        setArtisan(data);
      } else if (Array.isArray(data.artisans)) {
        setArtisan(data.artisans);
      } else {
        setArtisan([]);
      }
    } catch (error) {
      setArtisan([]);
    }
  };
  const fetchBannerSection3rd = async () => {
    try {
      const response = await fetch("/api/bannerSection3rd");
      const data = await response.json();
      // console.log(data);
      setBannerSection3rd(data); // Use dummy data if API returns empty
    } catch (error) {
      // console.error('Error fetching data:', error);
      setBannerSection3rd([]); // Use dummy data on error
    } finally {
      setLoading1(false);
    }
  };

  useEffect(() => {
    fetchBannerSection3rd();
    fetchArtisan();
  }, []);

  return (
    <>
      <section className=" md:mt-19 w-full overflow-hidden max-w-screen overflow-x-hidden">
        <div className=" w-full h-full overflow-hidden max-w-screen">
          <section className="relative w-full">
            {loading1 ? (
              // Skeleton loader
              <div className="w-full">
                <div className="grid grid-cols-1 gap-5 md:gap-4">
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
              bannerSection3rd.map((item, idx) => (
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
          {/* Artisan Carousel Section */}
          <div className="w-full py-10 md:py-20">
            {/* Desktop: Grid/List */}
            <div className="w-full max-w-[90%] mx-auto">
              <div className="flex flex-col md:flex-row items-start gap-5">
                {/* Left: Heading and description */}
                <div className="flex-1 flex flex-col justify-center md:pr-8">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-start mb-5 uppercase">
                    “Sacred India — One Journey, Infinite Blessings.”
                  </h2>
                  <h2 className="text-xl font-bold mb-2">
                    “Across India, Into Yourself — A Spiritual Journey
                    Beyond Boundaries.”
                  </h2>
                  <div className="text-md text-gray-700 text-justify mb-6">
                    Step into a soulful exploration that spans India’s sacred
                    landscapes — the Himalayas, Ganga, ancient temples, and
                    coastal ashrams. This journey is more than travel; it’s a
                    pilgrimage of the heart. Reconnect with the divine through
                    yoga, meditation, rituals, and cultural experiences that
                    celebrate the spiritual spirit of Bharat.
                  </div>
                  {/* <Link
                    href="/allArtisans"
                    className="bg-black text-white py-3 px-6 rounded-lg font-semibold text-lg w-fit mb-6"
                  >
                    View All Artisans
                  </Link> */}
                </div>
                {/* Right: Top 2 artisan cards in new style */}
                <div className="hidden md:flex flex-row gap-4 justify-end">
                  {artisan &&
                    artisan.slice(0, 2).map((item, idx) => {
                      const card = {
                        id: item._id || idx,
                        slug: item.slug,
                        name:
                          `${item.title ? item.title + " " : ""}${
                            item.firstName || ""
                          } ${item.lastName || ""}`.trim() || "Unknown Artisan",
                        date: item.createdAt
                          ? new Date(item.createdAt)
                              .toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                              .toUpperCase()
                          : "N/A",
                        image:
                          item.profileImage?.url ||
                          item.image ||
                          "/bg-custom-1.jpg",
                        title:
                          item.specializations &&
                          item.specializations.length > 0
                            ? item.specializations.join(", ")
                            : "Artisan",
                        subtitle: item.shgName || "",
                        experience: item.yearsOfExperience
                          ? `${item.yearsOfExperience} years experience`
                          : "",
                        promotions: item.promotions,
                        location: item.address
                          ? `${item.address.city}, ${item.address.state}`
                          : "",
                        socials: [
                          {
                            icon: (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-facebook-icon lucide-facebook"
                              >
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                              </svg>
                            ),
                            url: item.socialPlugin?.facebook || "#",
                          },
                          {
                            icon: (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-instagram-icon lucide-instagram"
                              >
                                <rect
                                  width="20"
                                  height="20"
                                  x="2"
                                  y="2"
                                  rx="5"
                                  ry="5"
                                />
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                              </svg>
                            ),
                            url: item.socialPlugin?.instagram || "#",
                          },
                          {
                            icon: (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-youtube-icon lucide-youtube"
                              >
                                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                                <path d="m10 15 5-3-5-3z" />
                              </svg>
                            ),
                            url: item.socialPlugin?.youtube || "#",
                          },
                          {
                            icon: (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="black"
                                viewBox="0 0 24 24"
                              >
                                <path d="M21.35 11.1h-9.18v2.83h5.43c-.24 1.38-1.42 4.04-5.43 4.04-3.27 0-5.94-2.71-5.94-6.05s2.67-6.05 5.94-6.05c1.86 0 3.11.8 3.82 1.49l2.6-2.57C17.36 3.43 15.01 2.5 12 2.5 6.95 2.5 2.9 6.53 2.9 11.5S6.95 20.5 12 20.5c6.89 0 9.1-4.82 9.1-7.22 0-.48-.05-.8-.15-1.18z" />
                              </svg>
                            ),
                            url: item.socialPlugin?.google || "#",
                          },
                          {
                            icon: <Globe />,
                            url: item.socialPlugin?.website || "#",
                          },
                        ],
                      };
                      return (
                        <div
                          key={card.id}
                          className="flex flex-col items-center gap-2"
                        >
                          <div className="relative rounded-2xl shadow-md group transition-all h-full w-[340px] flex flex-col bg-[#fbeff2] overflow-hidden">
                            {/* Card Image */}
                            <div className="relative w-full h-96">
                              <img
                                src={card.image}
                                alt={card.name}
                                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                style={{ objectFit: "cover" }}
                              />

                              <Link
                                href={`/destination/${card.slug}`}
                                className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              >
                                <span className="bg-white text-black font-medium px-4 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                  View Details
                                </span>
                              </Link>
                            </div>
                            {/* Card Content Overlay */}
                            <div className="absolute left-0 bottom-0 w-full flex justify-between items-end p-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                              <div className="flex flex-col">
                                <Link
                                  href={`/destination/${card.slug}`}
                                  className="font-bold text-2xl text-white mb-2 leading-tight drop-shadow-md hover:underline hover:decoration-2 hover:underline-offset-4 transition cursor-pointer"
                                  title={card.name}
                                >
                                  {card.name}
                                </Link>
                                {/* Date Badge */}
                                {/* <div className="absolute top-5 left-5 z-20 flex items-center gap-2"> */}
                                <span className="text-white rounded text-md text-wrap font-bold shadow">
                                  {card.subtitle}
                                </span>
                                {/* </div> */}
                              </div>
                              {/* Arrow Button with Socials on Hover */}
                              <div className="relative group/arrow">
                                <button className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center shadow transition group-hover/arrow:bg-[#e84393] group-hover/arrow:text-white">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-6 h-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                </button>
                                {/* Social Icons: show on arrow hover */}
                                <div className="absolute bottom-12 right-0 flex flex-col gap-4 opacity-0 group-hover/arrow:opacity-100 transition-opacity duration-300 z-30 items-center">
                                  {card.socials.slice(0, 6).map((s, i) => (
                                    <a
                                      key={i}
                                      href={s.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`
                          bg-white rounded-full w-12 h-12 flex items-center justify-center shadow hover:bg-gray-100 transition
                          transform translate-y-5 group-hover/arrow:translate-y-0
                        `}
                                      style={{
                                        transitionProperty:
                                          "transform, opacity, background-color, box-shadow",
                                        transitionDuration: "0.6s",
                                        transitionTimingFunction:
                                          "cubic-bezier(0.4,0,0.2,1)",
                                        transitionDelay: `${i * 60}ms`,
                                      }}
                                    >
                                      {s.icon}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Reviews with stars */}
                          <div className="flex items-center justify-between w-full flex-shrink text-black px-5">
                            <button
                              className="flex flex-row items-center justify-between w-full px-2 cursor-pointer group bg-transparent border-0 p-0"
                              onClick={() => {
                                setSelectedReviews(card.promotions || []);
                                setReviewModalOpen(true);
                              }}
                              style={{ outline: "none" }}
                              aria-label="Show reviews"
                            >
                              <div className="flex items-center gap-1">
                                {(() => {
                                  const avgRating =
                                    card.promotions &&
                                    card.promotions.length > 0
                                      ? card.promotions.reduce(
                                          (sum, p) => sum + (p.rating || 0),
                                          0
                                        ) / card.promotions.length
                                      : 0;
                                  return [...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={18}
                                      className={
                                        i < avgRating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      }
                                      fill={i < avgRating ? "#facc15" : "none"}
                                    />
                                  ));
                                })()}
                              </div>
                              <span className="ml-2 hover:underline text-black flex flex-row text-md">
                              Based on {card.promotions?.length || 0} Reviews
                              </span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
              {/* Carousel for remaining artisans in new style in Laptop View*/}
              {artisan && artisan.length > 2 && (
                <div className="hidden md:flex mt-10">
                  <Carousel className="w-full">
                    <CarouselContent className="flex ">
                      {artisan.slice(2).map((item, idx) => {
                        const card = {
                          id: item._id || idx,
                          slug: item.slug,
                          name:
                            `${item.title ? item.title + " " : ""}${
                              item.firstName || ""
                            } ${item.lastName || ""}`.trim() ||
                            "Unknown Artisan",
                          date: item.createdAt
                            ? new Date(item.createdAt)
                                .toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                                .toUpperCase()
                            : "N/A",
                          image:
                            item.profileImage?.url ||
                            item.image ||
                            "/bg-custom-1.jpg",
                          title:
                            item.specializations &&
                            item.specializations.length > 0
                              ? item.specializations.join(", ")
                              : "Artisan",
                          subtitle: item.shgName || "",
                          promotions: item.promotions,
                          experience: item.yearsOfExperience
                            ? `${item.yearsOfExperience} years experience`
                            : "",
                          location: item.address
                            ? `${item.address.city}, ${item.address.state}`
                            : "",
                          socials: [
                            {
                              icon: (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-facebook-icon lucide-facebook"
                                >
                                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                </svg>
                              ),
                              url: item.socialPlugin?.facebook || "#",
                            },
                            {
                              icon: (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-instagram-icon lucide-instagram"
                                >
                                  <rect
                                    width="20"
                                    height="20"
                                    x="2"
                                    y="2"
                                    rx="5"
                                    ry="5"
                                  />
                                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                  <line
                                    x1="17.5"
                                    x2="17.51"
                                    y1="6.5"
                                    y2="6.5"
                                  />
                                </svg>
                              ),
                              url: item.socialPlugin?.instagram || "#",
                            },
                            {
                              icon: (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-youtube-icon lucide-youtube"
                                >
                                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                                  <path d="m10 15 5-3-5-3z" />
                                </svg>
                              ),
                              url: item.socialPlugin?.youtube || "#",
                            },
                            {
                              icon: (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  fill="black"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M21.35 11.1h-9.18v2.83h5.43c-.24 1.38-1.42 4.04-5.43 4.04-3.27 0-5.94-2.71-5.94-6.05s2.67-6.05 5.94-6.05c1.86 0 3.11.8 3.82 1.49l2.6-2.57C17.36 3.43 15.01 2.5 12 2.5 6.95 2.5 2.9 6.53 2.9 11.5S6.95 20.5 12 20.5c6.89 0 9.1-4.82 9.1-7.22 0-.48-.05-.8-.15-1.18z" />
                                </svg>
                              ),
                              url: item.socialPlugin?.google || "#",
                            },
                            {
                              icon: <Globe />,
                              url: item.socialPlugin?.website || "#",
                            },
                          ],
                        };
                        return (
                          <CarouselItem
                            key={card.id}
                            className="pl-5 md:basis-1/2 lg:basis-1/5 min-w-0 snap-start"
                          >
                            <div className="flex flex-col items-center gap-2">
                              <div className="relative rounded-2xl overflow-hidden shadow-md group transition-all h-full flex flex-col bg-[#fbeff2]">
                                {/* Card Image */}
                                <div className="relative w-full h-80">
                                  <img
                                    src={card.image}
                                    alt={card.name}
                                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                    style={{ objectFit: "cover" }}
                                  />
                                  <Link
                                    href={`/destination/${card.slug}`}
                                    className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                  >
                                    <span className="bg-white text-black font-medium px-4 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                      View Details
                                    </span>
                                  </Link>
                                </div>
                                {/* Card Content Overlay */}
                                <div className="absolute left-0 bottom-0 w-full flex justify-between items-end p-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                                  <div className="flex flex-col">
                                    <Link
                                      href={`/destination/${card.slug}`}
                                      className="font-bold text-xl text-white mb-2 leading-tight drop-shadow-md hover:underline hover:decoration-2 hover:underline-offset-4 transition cursor-pointer"
                                      title={card.name}
                                    >
                                      {card.name}
                                    </Link>
                                    {/* Date Badge */}
                                    {/* <div className="absolute top-5 left-5 z-20 flex items-center gap-2"> */}
                                    <span className="text-white rounded text-sm text-wrap font-bold shadow">
                                      {card.subtitle}
                                    </span>
                                    {/* </div> */}
                                  </div>
                                  {/* Arrow Button with Socials on Hover */}
                                  <div className="relative group/arrow">
                                    <button className="bg-white text-black rounded-full w-10 h-10 flex items-center justify-center shadow transition group-hover/arrow:bg-[#e84393] group-hover/arrow:text-white">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-6 h-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M9 5l7 7-7 7"
                                        />
                                      </svg>
                                    </button>
                                    {/* Social Icons: show on arrow hover */}
                                    <div className="absolute bottom-12 right-0 flex flex-col gap-4 opacity-0 group-hover/arrow:opacity-100 transition-opacity duration-300 z-30 items-center">
                                      {card.socials.slice(0, 6).map((s, i) => (
                                        <a
                                          key={i}
                                          href={s.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className={`
                          bg-white rounded-full w-9 h-9 flex items-center justify-center shadow hover:bg-gray-100 transition
                          transform translate-y-5 group-hover/arrow:translate-y-0
                        `}
                                          style={{
                                            transitionProperty:
                                              "transform, opacity, background-color, box-shadow",
                                            transitionDuration: "0.6s",
                                            transitionTimingFunction:
                                              "cubic-bezier(0.4,0,0.2,1)",
                                            transitionDelay: `${i * 60}ms`,
                                          }}
                                        >
                                          {s.icon}
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* Reviews with stars */}
                              <div className="flex items-center justify-between w-full flex-shrink text-black px-5">
                                <button
                                  className="flex flex-row items-center justify-between w-full px-2 cursor-pointer group bg-transparent border-0 p-0"
                                  onClick={() => {
                                    setSelectedReviews(card.promotions || []);
                                    setReviewModalOpen(true);
                                  }}
                                  style={{ outline: "none" }}
                                  aria-label="Show reviews"
                                >
                                  <div className="flex items-center gap-1">
                                    {(() => {
                                      const avgRating =
                                        card.promotions &&
                                        card.promotions.length > 0
                                          ? card.promotions.reduce(
                                              (sum, p) => sum + (p.rating || 0),
                                              0
                                            ) / card.promotions.length
                                          : 0;
                                      return [...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          size={18}
                                          className={
                                            i < avgRating
                                              ? "fill-yellow-400 text-yellow-400"
                                              : "text-gray-300"
                                          }
                                          fill={
                                            i < avgRating ? "#facc15" : "none"
                                          }
                                        />
                                      ));
                                    })()}
                                  </div>
                                  <span className="ml-2 hover:underline text-black flex flex-row text-md">
                                    Based On{card.promotions?.length || 0} Reviews
                                  </span>
                                </button>
                              </div>
                            </div>
                          </CarouselItem>
                        );
                      })}
                    </CarouselContent>
                    <div className="flex items-center gap-3 mt-4 justify-center">
                      <CarouselPrevious className="bg-[#f7eedd] absolute left-5 !rounded-full !w-12 !h-12 !flex !items-center !justify-center transition" />
                      <CarouselNext className="bg-[#f7eedd] !rounded-full absolute right-5 !w-12 !h-12 !flex !items-center !justify-center transition" />
                    </div>
                  </Carousel>
                </div>
              )}
              {/* Carousel for remaining artisans in new style */}
              {artisan && artisan.length > 1 && (
                <div className="md:hidden lg:hidden mt-10">
                  <Carousel className="w-full">
                    <CarouselContent className="flex gap-4">
                      {artisan.map((item, idx) => {
                        const card = {
                          id: item._id || idx,
                          slug: item.slug,
                          name:
                            `${item.title ? item.title + " " : ""}${
                              item.firstName || ""
                            } ${item.lastName || ""}`.trim() ||
                            "Unknown Artisan",
                          date: item.createdAt
                            ? new Date(item.createdAt)
                                .toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                                .toUpperCase()
                            : "N/A",
                          image:
                            item.profileImage?.url ||
                            item.image ||
                            "/bg-custom-1.jpg",
                          title:
                            item.specializations &&
                            item.specializations.length > 0
                              ? item.specializations.join(", ")
                              : "Artisan",
                          subtitle: item.shgName || "",
                          promotions: item.promotions,
                          experience: item.yearsOfExperience
                            ? `${item.yearsOfExperience} years experience`
                            : "",
                          location: item.address
                            ? `${item.address.city}, ${item.address.state}`
                            : "",
                          socials: [
                            {
                              icon: (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-facebook-icon lucide-facebook"
                                >
                                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                </svg>
                              ),
                              url: item.socialPlugin?.facebook || "#",
                            },
                            {
                              icon: (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-instagram-icon lucide-instagram"
                                >
                                  <rect
                                    width="20"
                                    height="20"
                                    x="2"
                                    y="2"
                                    rx="5"
                                    ry="5"
                                  />
                                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                  <line
                                    x1="17.5"
                                    x2="17.51"
                                    y1="6.5"
                                    y2="6.5"
                                  />
                                </svg>
                              ),
                              url: item.socialPlugin?.instagram || "#",
                            },
                            {
                              icon: (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-youtube-icon lucide-youtube"
                                >
                                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                                  <path d="m10 15 5-3-5-3z" />
                                </svg>
                              ),
                              url: item.socialPlugin?.youtube || "#",
                            },
                            {
                              icon: (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  fill="black"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M21.35 11.1h-9.18v2.83h5.43c-.24 1.38-1.42 4.04-5.43 4.04-3.27 0-5.94-2.71-5.94-6.05s2.67-6.05 5.94-6.05c1.86 0 3.11.8 3.82 1.49l2.6-2.57C17.36 3.43 15.01 2.5 12 2.5 6.95 2.5 2.9 6.53 2.9 11.5S6.95 20.5 12 20.5c6.89 0 9.1-4.82 9.1-7.22 0-.48-.05-.8-.15-1.18z" />
                                </svg>
                              ),
                              url: item.socialPlugin?.google || "#",
                            },
                            {
                              icon: <Globe />,
                              url: item.socialPlugin?.website || "#",
                            },
                          ],
                        };
                        return (
                          <CarouselItem
                            key={card.id}
                            className="pl-5 md:basis-1/2 lg:basis-1/4 min-w-0 snap-start"
                          >
                            <div className="flex flex-col items-center gap-2">
                              <div className="relative rounded-2xl overflow-hidden shadow-md group transition-all h-full flex flex-col bg-[#fbeff2]">
                                {/* Card Image */}
                                <div className="relative w-full h-96">
                                  <img
                                    src={card.image}
                                    alt={card.name}
                                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                    style={{ objectFit: "cover" }}
                                  />
                                  <Link
                                    href={`/destination/${card.slug}`}
                                    className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                  >
                                    <span className="bg-white text-black font-medium px-4 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                      View Details
                                    </span>
                                  </Link>
                                </div>
                                {/* Card Content Overlay */}
                                <div className="absolute left-0 bottom-0 w-full flex justify-between items-end p-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                                  <div className="flex flex-col">
                                    <Link
                                      href={`/destination/${card.slug}`}
                                      className="font-bold text-2xl text-white mb-2 leading-tight drop-shadow-md hover:underline hover:decoration-2 hover:underline-offset-4 transition cursor-pointer"
                                      title={card.name}
                                    >
                                      {card.name}
                                    </Link>
                                    {/* Date Badge */}
                                    {/* <div className="absolute top-5 left-5 z-20 flex items-center gap-2"> */}
                                    <span className="text-white rounded text-md text-wrap font-bold shadow">
                                      {card.subtitle}
                                    </span>
                                    {/* </div> */}
                                  </div>
                                  {/* Arrow Button with Socials on Hover */}
                                  <div className="relative group/arrow">
                                    <button className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center shadow transition group-hover/arrow:bg-[#e84393] group-hover/arrow:text-white">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-6 h-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M9 5l7 7-7 7"
                                        />
                                      </svg>
                                    </button>
                                    {/* Social Icons: show on arrow hover */}
                                    <div className="absolute bottom-12 right-0 flex flex-col gap-4 opacity-0 group-hover/arrow:opacity-100 transition-opacity duration-300 z-30 items-center">
                                      {card.socials.slice(0, 6).map((s, i) => (
                                        <a
                                          key={i}
                                          href={s.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className={`
                          bg-white rounded-full w-12 h-12 flex items-center justify-center shadow hover:bg-gray-100 transition
                          transform translate-y-5 group-hover/arrow:translate-y-0
                        `}
                                          style={{
                                            transitionProperty:
                                              "transform, opacity, background-color, box-shadow",
                                            transitionDuration: "0.6s",
                                            transitionTimingFunction:
                                              "cubic-bezier(0.4,0,0.2,1)",
                                            transitionDelay: `${i * 60}ms`,
                                          }}
                                        >
                                          {s.icon}
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* Reviews with stars */}
                              <div className="flex items-center justify-between w-full flex-shrink text-black px-5">
                                <button
                                  className="flex flex-row items-center justify-between w-full px-2 cursor-pointer group bg-transparent border-0 p-0"
                                  onClick={() => {
                                    setSelectedReviews(card.promotions || []);
                                    setReviewModalOpen(true);
                                  }}
                                  style={{ outline: "none" }}
                                  aria-label="Show reviews"
                                >
                                  <div className="flex items-center gap-1">
                                    {(() => {
                                      const avgRating =
                                        card.promotions &&
                                        card.promotions.length > 0
                                          ? card.promotions.reduce(
                                              (sum, p) => sum + (p.rating || 0),
                                              0
                                            ) / card.promotions.length
                                          : 0;
                                      return [...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          size={18}
                                          className={
                                            i < avgRating
                                              ? "fill-yellow-400 text-yellow-400"
                                              : "text-gray-300"
                                          }
                                          fill={
                                            i < avgRating ? "#facc15" : "none"
                                          }
                                        />
                                      ));
                                    })()}
                                  </div>
                                  <span className="ml-2 hover:underline text-black flex flex-row text-md">
                                    Based On {card.promotions?.length || 0} Reviews
                                  </span>
                                </button>
                              </div>
                            </div>
                          </CarouselItem>
                        );
                      })}
                    </CarouselContent>
                    <div className="flex items-center gap-3 mt-4 justify-center">
                      <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 p-5" />
                      <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 p-5" />
                    </div>
                  </Carousel>
                </div>
              )}
            </div>
            <ReviewModal
              open={reviewModalOpen}
              onClose={() => setReviewModalOpen(false)}
              reviews={selectedReviews}
            />
          </div>
        </div>
      </section>
    </>
  );
};
export default RandomTourPackageSection;
