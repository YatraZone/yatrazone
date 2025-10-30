"use client";
import React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
// import ViewNews from "./ViewNews";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { Button } from "./ui/button";
import { Star } from "lucide-react";
// import ReviewModal from "./ReviewModal";
import toast from "react-hot-toast";
const InstaBlog = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [isBlogsLoading, setIsBlogsLoading] = useState(true);
  const [instagramPosts, setInstagramPosts] = useState([]);
  const [isInstaLoading, setIsInstaLoading] = useState(true);
  const [facebookPosts, setFacebookPosts] = useState([]);
  const [isFbLoading, setIsFbLoading] = useState(true);
  const [news, setNews] = useState([]);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blogs");
      const data = await res.json();
      // console.log(data);
      if (Array.isArray(data)) {
        setBlogs(data);
      } else if (Array.isArray(data.blogs)) {
        setBlogs(data.blogs);
      } else {
        setBlogs([]);
      }
    } catch (error) {
      // console.error("Error fetching blogs:", error);
      setBlogs([]);
    } finally {
      setIsBlogsLoading(false);
    }
  };
  
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
  useEffect(() => {
    fetchBlogs();
    fetchFacebookPosts();
    fetchInstagramPosts();
  }, []);

  // Combine and sort posts by createdAt date
  const allPosts = [...instagramPosts, ...facebookPosts].sort((a, b) => {
    // Sort by createdAt field (newest first)
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA; // Sort from newest to oldest
  });

  // Determine card width based on number of posts
  const cardBasis =
    allPosts.length <= 3 ? `basis-1/${allPosts.length}` : "md:basis-1/5";

  return (
    <div className="bg-[url('/bg-custom-5.jpg')] bg-cover bg-center w-full overflow-hidden max-w-screen overflow-x-hidden">
      {/* Blog Section with full-width background */}
      {!isBlogsLoading && blogs && blogs.length > 0 && (
        <div className="w-full flex flex-col items-center mt-12">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold w-full text-center md:pt-10">
            Our Blog
          </h1>
          <p className="text-gray-600 py-8 text-center font-barlow w-[80%] mx-auto">
            Stay ahead of the curve with Trending Packages – The Best, Today. We
            bring you a curated selection of the most popular, high-value deals
            and experiences that are capturing attention right now. From
            must-have products to top-rated services, each package is handpicked
            for quality, relevance, and impact. Updated daily to reflect what’s
            hot and happening, it’s your go-to source for discovering what’s
            trending – and making the most of it. Don’t just follow the trend,
            be part of it.
          </p>
          {/* Two Promotional Banners */}
          <div className="w-full flex flex-col md:flex-row gap-4 mb-8">
            {/* First Banner */}
            {blogs.length > 0 && (
              <div className="w-full md:w-1/2 bg-amber-100 rounded-lg overflow-hidden relative">
                <div className="flex h-[250px]">
                  {/* <div className="text-sm font-semibold mb-1">STAY 4 NIGHTS</div> */}
                  <div className="w-1/2 p-4 flex flex-col justify-center">
                    <div className="absolute top-2 left-2 text-gray-700 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">
                      {blogs?.[0]?.date?.slice(0, 10) || ""}
                    </div>
                    {/* NameCode and Role in one row, spaced between */}
                    <div className="flex flex-row items-center justify-between mb-1">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">
                        {blogs?.[0]?.nameCode}
                      </span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">
                        {blogs?.[0]?.role}
                      </span>
                    </div>
                    <div className="text-2xl md:text-3xl font-black mb-2">
                      {blogs?.[0]?.title}
                    </div>
                    <p className="text-xs md:text-sm mb-4">
                      {blogs?.[0]?.shortDesc?.split(" ").length > 18
                        ? blogs?.[0]?.shortDesc
                            .split(" ")
                            .slice(0, 18)
                            .join(" ") + "..."
                        : blogs?.[0]?.shortDesc}
                    </p>
                    <a
                      href={blogs?.[0]?.url ? blogs?.[0].url : "#"}
                      className="bg-black text-white text-xs font-bold py-2 px-4 inline-block w-fit rounded"
                    >
                      Read More
                    </a>
                  </div>
                  <div className="w-1/2 relative">
                    <Image
                      src={
                        blogs?.[0]?.image
                          ? blogs?.[0].image
                          : "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                      }
                      alt={
                        blogs?.[0]?.title
                          ? blogs?.[0].title
                          : "Promotional offer"
                      }
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            )}
            {/* Second Banner */}
            {blogs.length > 1 && (
              <div className="w-full md:w-1/2 bg-gray-900 text-white rounded-lg overflow-hidden relative">
                <div className="flex h-[250px]">
                  <div className="w-1/2 p-4 flex flex-col justify-center">
                    {/* <div className="text-sm font-semibold mb-1">MEMBER GET</div> */}
                    <div className="absolute top-2 left-2 text-gray-700 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">
                      {blogs?.[1]?.date?.slice(0, 10) || ""}
                    </div>
                    {/* NameCode and Role in one row, spaced between */}
                    <div className="flex flex-row items-center justify-between mb-1">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">
                        {blogs?.[1]?.nameCode}
                      </span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">
                        {blogs?.[1]?.role}
                      </span>
                    </div>
                    <div className="text-2xl md:text-3xl font-black text-amber-400 mb-2">
                      {blogs?.[1]?.title}
                    </div>
                    <p className="text-xs md:text-sm mb-4">
                      {blogs?.[1]?.shortDesc?.split(" ").length > 18
                        ? blogs?.[1]?.shortDesc
                            .split(" ")
                            .slice(0, 18)
                            .join(" ") + "..."
                        : blogs?.[1]?.shortDesc}
                    </p>
                    <a
                      href={blogs?.[1]?.url ? blogs?.[1].url : "#"}
                      className="border border-white text-white text-xs font-bold py-2 px-4 inline-block w-fit rounded"
                    >
                      Read More
                    </a>
                  </div>
                  <div className="w-1/2 relative">
                    <Image
                      src={
                        blogs?.[1]?.image
                          ? blogs?.[1].image
                          : "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                      }
                      alt={
                        blogs?.[1]?.title ? blogs?.[1].title : "Member discount"
                      }
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <Carousel className="w-full">
            <CarouselContent className="sm:-ml-4 flex  px-1 sm:px-0">
              {blogs.slice(2).map((blog, idx) => (
                <CarouselItem
                  key={blog._id || idx}
                  className="basis-[85vw] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 max-w-xs sm:max-w-sm md:max-w-md flex-shrink-0"
                >
                  <div className="bg-white rounded-xl shadow p-4 flex flex-col h-full relative overflow-hidden group">
                    <div className="relative w-full h-40 sm:h-48 mb-3 rounded-lg overflow-hidden">
                      <Image
                        src={
                          blog.image ||
                          "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                        }
                        alt={blog.title}
                        fill
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">
                        {blog.date?.slice(0, 10) || ""}
                      </div>
                    </div>
                    {/* NameCode and Role in one row, spaced between */}
                    <div className="flex flex-row items-center justify-between mb-1">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">
                        {blog.nameCode}
                      </span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">
                        {blog.role}
                      </span>
                    </div>
                    {/* Title below */}
                    <div className="font-semibold text-lg md:text-xl mb-1 line-clamp-2">
                      {blog.title}
                    </div>
                    {/* shortDesc limited to 18 words */}
                    <div className="text-xs text-gray-600 mb-2 flex-grow">
                      {blog.shortDesc && blog.shortDesc.split(" ").length > 18
                        ? blog.shortDesc.split(" ").slice(0, 18).join(" ") +
                          "..."
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
      )}

      {allPosts.length > 0 && (
        <div className="w-full flex flex-col items-center md:py-12 py-10">
          <h2 className="text-center font-bold text-xl md:text-3xl lg:text-4xl uppercase">
            Don’t just watch the trends — live them!
          </h2>
          <p className="text-gray-600 py-4 text-center font-barlow w-full md:w-[90%] mx-auto px-5">
            Follow us on social media for your daily dose of Trending Packages,
            exclusive offers, behind-the-scenes peeks, and real-time updates.
            Join our community of trendsetters and be the first to explore
            what’s new, what’s hot, and what everyone’s talking about. Your next
            favorite find is just a follow away!
          </p>
          <div className="w-full px-3">
            <Carousel className="w-full" plugins={[Autoplay({ delay: 4000 })]}>
              <CarouselContent>
                {allPosts.map((post, idx) => (
                  <CarouselItem
                    key={post._id || idx}
                    className={`pl-5 ${
                      allPosts.length <= 3 ? cardBasis : "md:basis-1/5"
                    }`}
                    style={
                      allPosts.length <= 3
                        ? { minWidth: `calc(100%/${allPosts.length})` }
                        : {}
                    }
                  >
                    <div className="relative group border-4 border-white overflow-hidden w-full h-60">
                      <Image
                        src={post.image}
                        alt={`${
                          post.type === "facebook" ? "Facebook" : "Instagram"
                        } ${idx}`}
                        width={400}
                        height={400}
                        className="object-cover md:object-cover w-full h-full"
                      />
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                      >
                        {post.type === "facebook" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="50"
                            height="50"
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
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="50"
                            height="50"
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
                        )}
                      </a>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-1 top-1/2 -translate-y-1/2 p-5" />
              <CarouselNext className="absolute right-1 top-1/2 -translate-y-1/2 p-5" />
            </Carousel>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstaBlog;
