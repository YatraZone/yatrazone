"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, Calendar, Clock, Tag, Star, Check, X, AlertTriangle,
  Calculator, MessageSquare, ShoppingCart, PhoneCall, MessageCircle,
  Share2, Copy, ChevronRight, ChevronLeft, Hotel, Bus, Utensils, Camera, Users,
  Ticket, ArrowRight, Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ReviewForm from "@/components/Category/review-form";
import PackageGallery from "@/components/Category/package-gallery";
import PackageMap from "@/components/Category/package-map";
import PackageCarouselWrapper from "@/components/PackageCarouselWrapper";
import FeaturedCarouselWrapper from "@/components/FeaturedCarouselWrapper";
import { DismissableInfoBox } from "@/components/Package/NoticeBox";
import ImportantNotice from "@/components/ImportantNotice";

export default function PackageDetailClient({
  packageDetails,
  reviews,
  packages,
  featuredPackages,
  avgRating,
  sanitizedUser,
  formatNumericStr,
}) {
  // console.log(packageDetails)
  const [activeTab, setActiveTab] = useState("overview");
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const dayRefs = useRef([]);
  const sidebarRef = useRef(null);

  const formatNumber = (number) => new Intl.NumberFormat("en-IN").format(number);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "dayplan", label: "Day Plan" },
    { id: "include", label: "Include/Exclude" },
    { id: "additional", label: "Additional Information" },
    { id: "policy", label: "Policy Content" },
    { id: "hotels", label: "Hotels" },
    { id: "summary", label: "Summary" },
    { id: "reviews", label: "Reviews" },
  ];

  const dayPlans = packageDetails.info?.filter(
    (info) => info.typeOfSelection === "Day Plan"
  ) || [];

  // Scroll-based day tracking
  useEffect(() => {
    if (activeTab !== "dayplan" || dayPlans.length === 0) return;

    const handleScroll = () => {
      const scrollY = window.scrollY + 200;
      let currentIndex = 0;
      dayRefs.current.forEach((ref, index) => {
        if (ref && ref.offsetTop <= scrollY) {
          currentIndex = index;
        }
      });
      setActiveDayIndex(currentIndex);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeTab, dayPlans.length]);

  const scrollToDay = (index) => {
    setActiveDayIndex(index);
    dayRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: packageDetails.packageName,
          url: window.location.href,
        });
      } catch { }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Gallery modal
  const openGallery = (index = 0) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeGallery = () => {
    setGalleryOpen(false);
    document.body.style.overflow = "";
  };

  const nextImage = () => setGalleryIndex((prev) => (prev + 1) % galleryImages.length);
  const prevImage = () => setGalleryIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

  // Gallery images from packageDetails
  const galleryImages = packageDetails?.gallery || [];
  // Keyboard navigation for gallery
  useEffect(() => {
    if (!galleryOpen) return;
    const handleKey = (e) => {
      if (e.key === "ArrowRight") nextImage();
      else if (e.key === "ArrowLeft") prevImage();
      else if (e.key === "Escape") closeGallery();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [galleryOpen, galleryImages.length]);

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setCouponApplied(true);
    }
  };


  // Itinerary summary counts
  const totalDays = dayPlans.length;
  // Inclusions/Exclusions
  const inclusions = packageDetails.info?.filter(i => i.typeOfSelection === "Inclusions") || [];
  const exclusions = packageDetails.info?.filter(i => i.typeOfSelection === "Exclusions") || [];
  const faqs = packageDetails.info?.filter(i => i.typeOfSelection === "Frequently Asked Questions") || [];
  const importantInfo = packageDetails.info?.filter(i => i.typeOfSelection === "Important Information") || [];
  const others = packageDetails.info?.filter(i => i.typeOfSelection === "Other") || [];
  const policies = packageDetails.info?.filter(i => i.typeOfSelection === "Policy Content") || [];
  const hotels = packageDetails.hotels || [];
  const summary = packageDetails.info?.filter(i => i.typeOfSelection === "Summary") || [];
  const validReviews = Array.isArray(reviews) ? reviews.filter(r => r.approved === true) : [];

  // Night stops for itinerary bar
  const nightStops = packageDetails.basicDetails?.nightStops || [];
  const basicHighlights = Array.isArray(packageDetails.basicDetails?.highlights)
    ? packageDetails.basicDetails.highlights
    : [];
  const basicTableData = Array.isArray(packageDetails.basicDetails?.tableData)
    ? packageDetails.basicDetails.tableData
    : [];
  const includePackageData = Array.isArray(packageDetails.includePackage) && packageDetails.includePackage.length > 0
    ? packageDetails.includePackage[0]
    : null;
  const includedDesc = includePackageData?.selectionDesc || "";
  const includedHighlights = includePackageData?.selectionHighlight || "";
  const includedTables = includePackageData?.selectionTable || "";

  return (
    <div className="min-h-screen bg-white font-barlow w-full">
      {/* ========== HEADER: Package Name + Tags + Itinerary ========== */}
      <div className="w-full bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5">
          <h1 className="text-2xl font-giest md:text-3xl font-bold text-gray-900 mb-3">
            {packageDetails.packageName}
          </h1>

          {/* Tags row */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {packageDetails.basicDetails?.tourType && (
              <span className="border border-gray-300 text-gray-700 text-xs font-medium px-3 py-1 rounded">
                ✈️ {packageDetails.basicDetails.tourType}
              </span>
            )}
            <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded">
              {packageDetails.basicDetails?.duration || "7N/8D"}
            </span>

            {/* Night stops */}
            {nightStops.length > 0 && (
              <div className="flex items-center gap-1 text-md text-gray-600 ml-2 flex-wrap">
                {nightStops.map((stop, i) => (
                  <div key={i} className="flex items-center gap-2 border  border-gray-200 rounded-lg px-2 py-1">
                    <span className="text-md mx-1">•</span>
                    <span className="font-medium">{stop}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========== GALLERY SECTION ========== */}
      {galleryImages.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 rounded-xl overflow-hidden h-[300px] md:h-[320px]">
            {/* Main large image */}
            <div onClick={() => openGallery(0)} className="col-span-2 row-span-2 relative group cursor-pointer overflow-hidden rounded-xl">
              <Image
                src={galleryImages[0]?.url || packageDetails.basicDetails?.thumbnail?.url || ""}
                alt="Gallery main"
                fill
                loading="lazy"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <Camera className="h-3.5 w-3.5" />
                VIEW GALLERY →
              </div>
            </div>
            {/* Secondary images */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} onClick={() => galleryImages[i] && openGallery(i)} className="relative overflow-hidden rounded-xl group cursor-pointer">
                {galleryImages[i] ? (
                  <Image
                    src={galleryImages[i]?.url}
                    alt={`Gallery ${i}`}
                    fill
                    loading="lazy"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Camera className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========== MAIN CONTENT: Left (75%) + Right Sidebar (25%) ========== */}
      <div className="w-full md:w-[85%] mx-auto px-4 md:px-8 pb-12">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ===== LEFT CONTENT (75%) ===== */}
          <div className="w-full lg:w-[72%]">
            {/* ========== SUMMARY BANNER ========== */}
            <div className="my-1 border border-gray-500 rounded-xl p-6 md:p-8">
              {packageDetails.basicDetails?.notice && packageDetails.basicDetails.notice.trim() !== "" && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-700 font-medium flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>Availability Notice - "No booking hold, rates are tentative & a matter of subject to availability."</span>
                  </p>
                </div>
              )}
              <div className="bg-yellow-50 border border-yellow-500 rounded-lg p-4">
                <p className="text-sm text-yellow-800 font-medium flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>Important Notice - For the 2026 Char Dham Yatra, <a href="https://registrationandtouristcare.uk.gov.in/" target="_blank" rel="noopener noreferrer" className="underline text-black">registration</a> is mandatory to obtain e-cards done online through the <a href="https://registrationandtouristcare.uk.gov.in/" target="_blank" className="underline text-black">Uttarakhand Tourism website</a></span>
                </p>
              </div>
            </div>
            {/* Tabs Navigation */}
            <div className="sticky top-0 z-30 bg-white border-b border-gray-200 mb-6">
              <div className="flex overflow-x-auto gap-0 no-scrollbar">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap px-4 py-3.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === tab.id
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ---- OVERVIEW TAB ---- */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Activities & Inclusions Highlight */}
                <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-5">
                  <h3 className="text-base font-bold text-blue-800 mb-3">
                    🎯 Here's a list of Activities & Inclusions in this package for you
                  </h3>

                  {inclusions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={() => setActiveTab("include")}
                        className="text-blue-600 text-sm font-semibold underline hover:text-blue-700"
                      >
                        View All Exclusions
                      </button>
                    </div>
                  )}
                </div>

                {/* Included in this package */}
                {includePackageData && (
                  <div>
                    <h4 className="text-md font-semibold text-bold mb-3 uppercase tracking-wide">Included in this Package</h4>
                    <div className="bg-sky-50 border border-sky-200 rounded-xl p-5">
                      {/* Description */}
                      {includedDesc && (
                      <div className="prose max-w-none leading-relaxed custom-desc-list text-gray-700">
                        <div dangerouslySetInnerHTML={{ __html: includedDesc }} />
                      </div>
                    )}

                    {/* Highlights */}
                    {includedHighlights.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-sky-200">
                        <ul className="list-disc pl-5 space-y-2">
                          {includedHighlights.map((hl, hIdx) => (
                            <li key={hIdx}>
                              <p className="text-xl font-semibold text-gray-800">{hl.highlightName}</p>
                              {hl.highlightDesc?.length > 0 && (
                                <ul className="list-disc pl-5 mt-1 space-y-1">
                                  {hl.highlightDesc.map((desc, dIdx) => (
                                    <li key={dIdx} className="text-md text-gray-700">{desc}</li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* Table */}
                    {includedTables.length > 0 && (
                      <div className="mt-4 pt-4">
                        {includedTables.map((tbl, tIdx) => (
                          <div key={tIdx} className="mb-4">
                            <h5 className="text-md font-semibold text-gray-900 mb-2">{tbl.tableName}</h5>
                            <table className="w-full text-sm border-collapse">
                              <tbody>
                                {Array.from(
                                  { length: Math.ceil((tbl.tableDesc?.length || 0) / 2) },
                                  (_, rowIdx) => {
                                    const col1 = tbl.tableDesc[rowIdx * 2];
                                    const col2 = tbl.tableDesc[rowIdx * 2 + 1];

                                    return (
                                      <tr
                                        key={rowIdx}
                                        className={rowIdx % 2 === 0 ? "bg-gray-100 hover:bg-gray-200 " : "bg-white hover:bg-gray-100"}
                                      >
                                        {/* Left */}
                                        <td className="w-[32%] px-6 py-4 text-gray-700 font-semibold border-b border-r border-gray-900">
                                          {col1 || ""}
                                        </td>

                                        {/* Right */}
                                        <td className="w-[68%] px-6 py-4 text-gray-700 font-medium border-b border-gray-900">
                                          {col2 || ""}
                                        </td>
                                      </tr>
                                    );
                                  }
                                )}
                              </tbody>
                            </table>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                )}
                {/* Description */}
                {packageDetails.basicDetails?.fullDesc && (
                  <div className="prose max-w-none leading-relaxed custom-desc-list">
                    <div dangerouslySetInnerHTML={{ __html: packageDetails.basicDetails.fullDesc }} />
                  </div>
                )}
                {/* Highlights */}
                {basicHighlights.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <ul className="list-disc pl-5 space-y-2">
                      {basicHighlights.map((hl, hIdx) => (
                        <li key={hIdx}>
                          <p className="text-md font-semibold text-gray-800">
                            {hl.highlightName}
                          </p>

                          {hl.highlightDesc?.length > 0 && (
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                              {hl.highlightDesc.map((desc, dIdx) => (
                                <li key={dIdx} className="text-md text-gray-600">
                                  {desc}
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Table */}
                {basicTableData.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    {basicTableData.map((tbl, tIdx) => (
                      <div key={tIdx} className="mb-4">
                        <h5 className="text-md font-bold text-gray-900 mb-2">{tbl.tableName}</h5>
                        <table className="w-full text-sm border border-gray-300 rounded-lg overflow-hidden">
                          <tbody>
                            {Array.from({ length: Math.ceil((tbl.tableDesc?.length || 0) / 2) }, (_, rowIdx) => {
                              const col1 = tbl.tableDesc[rowIdx * 2];
                              const col2 = tbl.tableDesc[rowIdx * 2 + 1];
                              return (
                                <tr key={rowIdx} className={rowIdx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                  <td className="border border-gray-500 px-3 py-2 text-gray-700 font-medium">{col1 || ""}</td>
                                  <td className="border border-gray-500 font-medium px-3 py-2 text-gray-600">{col2 || ""}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                )}


                {/* Map */}
                {packageDetails.info?.filter(i => i.typeOfSelection === "Location Map")[0]?.selectionDesc && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">📍 Map Location</h3>
                    <PackageMap
                      location={packageDetails.info.filter(i => i.typeOfSelection === "Location Map")[0].selectionDesc}
                    />
                  </div>
                )}

                {faqs.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold mb-4">❓ Frequently Asked Questions</h3>
                    <div className="space-y-3">
                      {faqs.map((faq, i) => (
                        <details key={i} className="group border border-gray-200 rounded-lg overflow-hidden">
                          <summary className="cursor-pointer px-5 py-3.5 text-md font-semibold text-gray-800 bg-gray-50 hover:bg-gray-100 flex items-center justify-between">
                            {faq.selectionTitle}
                            <ChevronRight className="h-4 w-4 text-gray-400 group-open:rotate-90 transition-transform" />
                          </summary>
                          <div className="px-5 py-4 text-sm text-gray-600 prose prose-sm max-w-none custom-desc-list">
                            {faq.selectionDesc ? (
                              <div dangerouslySetInnerHTML={{ __html: faq.selectionDesc }} />
                            ) : (
                              <p>No description available</p>
                            )}
                            {faq.selectionHighlight?.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-green-200 not-prose">
                                <ul className="list-disc pl-5 space-y-2">
                                  {faq.selectionHighlight.map((hl, hIdx) => (
                                    <li key={hIdx}>
                                      <p className="text-md font-bold text-black">
                                        {hl.highlightName}
                                      </p>
                                      {hl.highlightDesc?.length > 0 && (
                                        <ul className="list-disc pl-5 mt-1 space-y-1">
                                          {hl.highlightDesc.map((desc, dIdx) => (
                                            <li key={dIdx} className="text-md text-black">
                                              {desc}
                                            </li>
                                          ))}
                                        </ul>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {faq.selectionTable?.length > 0 && (
                              <div className="mt-4 pt-4">
                                {faq.selectionTable?.map((tbl, tIdx) => (
                                  <div key={tIdx} className="mb-4 not-prose">
                                    <h5 className="text-md font-bold text-gray-900 mb-2">{tbl.tableName}</h5>
                                    <table className="w-full text-sm border-collapse border border-gray-300 rounded overflow-hidden">
                                      <tbody>
                                        {Array.from({ length: Math.ceil((tbl.tableDesc?.length || 0) / 2) }, (_, rowIdx) => {
                                          const col1 = tbl.tableDesc[rowIdx * 2];
                                          const col2 = tbl.tableDesc[rowIdx * 2 + 1];
                                          return (
                                            <tr key={rowIdx} className={rowIdx % 2 === 0 ? "bg-gray-100 hover:bg-gray-100" : "bg-white hover:bg-gray-100"}>
                                              <td className="w-[32%] md:!px-6 !px-2 !py-4 text-gray-700 text-wrap font-semibold border-b border-r border-gray-900 text-sm">{col1 || ""}</td>
                                              <td className="w-[68%] md:!px-6 !px-2 !py-4 text-gray-700 text-wrap font-medium border-b border-gray-900 text-sm">{col2 || ""}</td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ---- DAY PLAN TAB ---- */}
            {activeTab === "dayplan" && (() => {
              // Calculate dates for the timeline starting from a near future Saturday
              const startDate = new Date();
              // Find next Saturday
              const dayOfWeek = startDate.getDay();
              const daysUntilSat = (6 - dayOfWeek + 7) % 7 || 7;
              startDate.setDate(startDate.getDate() + daysUntilSat);

              const getDayDate = (index) => {
                const d = new Date(startDate);
                d.setDate(d.getDate() + index);
                return d;
              };

              const formatDate = (date) => {
                const day = date.getDate();
                const month = date.toLocaleString("en-IN", { month: "short" });
                const weekday = date.toLocaleString("en-IN", { weekday: "short" });
                return `${day} ${month}, ${weekday}`;
              };

              return (
                <div className="flex gap-6">
                  {/* Day plan sidebar - vertical timeline with dates */}

                  <div className="hidden md:block w-48 shrink-0" ref={sidebarRef}>
                    <div className="sticky top-16">
                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 mb-5">Day Plan</h3>

                      {/* Timeline */}
                      <div className="relative">
                        {/* Vertical line */}
                        <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-gray-300" />

                        {dayPlans.map((day, index) => {
                          const date = getDayDate(index);
                          const isActive = activeDayIndex === index;
                          return (
                            <button
                              key={day._id || index}
                              onClick={() => scrollToDay(index)}
                              className="relative flex items-center gap-3 w-full text-left py-2.5 group"
                            >
                              {/* Dot */}
                              <div className={`relative z-10 w-4 h-4 rounded-full border-2 shrink-0 transition-all ${isActive
                                ? "bg-gray-800 border-gray-800 scale-110"
                                : "bg-white border-gray-400 group-hover:border-gray-600"
                                }`} />
                              {/* Date text */}
                              <span className={`text-sm transition-all ${isActive
                                ? "font-bold text-gray-900"
                                : "text-gray-500 group-hover:text-gray-700"
                                }`}>
                                {formatDate(date)}
                              </span>
                            </button>
                          );
                        })}

                        {/* Day End */}
                        <div className="relative flex items-center gap-3 py-2.5">
                          <div className="relative z-10 w-4 h-4 rounded-full border-2 bg-white border-gray-300 shrink-0" />
                          <span className="text-sm text-gray-400">Day End</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Day plan content */}
                  <div className="flex-1 space-y-6">
                    {/* Summary bar */}
                    <div className="flex items-center justify-end mx-2 gap-5 text-xs text-gray-500 pb-4 border-b border-gray-200 flex-wrap">
                      <span className="bg-gray-100 px-2.5 py-1 rounded font-semibold text-gray-800 text-sm">{totalDays} DAY PLAN</span>
                    </div>

                    {dayPlans.map((day, index) => (
                      <div
                        key={day._id || index}
                        ref={(el) => (dayRefs.current[index] = el)}
                        className="border border-gray-100 p-5 shadow-sm"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <span className="bg-orange-500 text-white text-xs font-bold whitespace-nowrap px-3 py-2 rounded">
                            Day {index + 1}
                          </span>
                          <h4 className="text-base font-bold text-gray-900">
                            {day.selectionTitle}
                          </h4>
                        </div>

                        {/* Day details chips */}
                        {/* <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
                          <span className="uppercase tracking-wide font-medium">INCLUDED:</span>
                          <span className="flex items-center gap-1"><Hotel className="h-3.5 w-3.5" /> 1 Hotel</span>
                          <span className="flex items-center gap-1"><Bus className="h-3.5 w-3.5" /> 1 Transfer</span>
                          <span className="flex items-center gap-1"><Camera className="h-3.5 w-3.5" /> 1 Activity</span>
                          <span className="flex items-center gap-1"><Utensils className="h-3.5 w-3.5" /> 1 Meal</span>
                        </div> */}

                        {day.selectionDesc && (
                          <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed custom-desc-list">
                            <div dangerouslySetInnerHTML={{ __html: day.selectionDesc }} />
                          </div>
                        )}
                        {/* Highlights */}
                        {day.selectionHighlight?.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            {/* <h5 className="text-md font-semibold text-gray-900 mb-3">
                              Itinerary Highlights
                            </h5> */}

                            <ul className="list-disc pl-5 space-y-2">
                              {day.selectionHighlight.map((hl, hIdx) => (
                                <li key={hIdx}>
                                  <p className="text-sm font-semibold text-gray-800">
                                    {hl.highlightName}
                                  </p>

                                  {hl.highlightDesc?.length > 0 && (
                                    <ul className="list-disc pl-5 mt-1 space-y-1">
                                      {hl.highlightDesc.map((desc, dIdx) => (
                                        <li key={dIdx} className="text-sm text-gray-600">
                                          {desc}
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Table */}
                        {day.selectionTable?.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            {day.selectionTable.map((tbl, tIdx) => (
                              <div key={tIdx} className="mb-4">
                                <h5 className="text-md font-semibold text-gray-900 mb-2">{tbl.tableName}</h5>
                                <table className="w-full text-sm border border-gray-300 rounded-lg overflow-hidden">
                                  <tbody>
                                    {Array.from({ length: Math.ceil((tbl.tableDesc?.length || 0) / 2) }, (_, rowIdx) => {
                                      const col1 = tbl.tableDesc[rowIdx * 2];
                                      const col2 = tbl.tableDesc[rowIdx * 2 + 1];
                                      return (
                                        <tr key={rowIdx} className={rowIdx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                          <td className="border border-gray-500 px-3 py-2 text-gray-700 font-medium">{col1 || ""}</td>
                                          <td className="border border-gray-500 font-medium px-3 py-2 text-gray-600">{col2 || ""}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
            {/* ---- INCLUDE/EXCLUDE TAB ---- */}
            {activeTab === "include" && (
              <div className="space-y-8">
                {inclusions.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-600" /> Inclusions
                    </h3>
                    <div className="space-y-3">
                      {inclusions.map((item, i) => (
                        <div key={i} className="bg-green-50/50 border border-green-100 rounded-lg p-4 prose prose-sm max-w-none custom-desc-list">
                          {item.selectionDesc ? (
                            <div dangerouslySetInnerHTML={{ __html: item.selectionDesc }} />
                          ) : (
                            <p>No description available</p>
                          )}

                          {item.selectionHighlight?.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-green-200 not-prose">
                              <ul className="list-disc pl-5 space-y-2">
                                {item.selectionHighlight.map((hl, hIdx) => (
                                  <li key={hIdx}>
                                    <p className="text-md font-bold text-black">
                                      {hl.highlightName}
                                    </p>
                                    {hl.highlightDesc?.length > 0 && (
                                      <ul className="list-disc pl-5 mt-1 space-y-1">
                                        {hl.highlightDesc.map((desc, dIdx) => (
                                          <li key={dIdx} className="text-md text-black">
                                            {desc}
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {item.selectionTable?.length > 0 && (
                            <div className="mt-4 pt-4">
                              {item.selectionTable?.map((tbl, tIdx) => (
                                <div key={tIdx} className="mb-4 not-prose">
                                  <h5 className="text-md font-bold text-gray-900 mb-2">{tbl.tableName}</h5>
                                  <table className="w-full text-sm border-collapse border border-gray-500 rounded overflow-hidden">
                                    <tbody>
                                      {Array.from({ length: Math.ceil((tbl.tableDesc?.length || 0) / 2) }, (_, rowIdx) => {
                                        const col1 = tbl.tableDesc[rowIdx * 2];
                                        const col2 = tbl.tableDesc[rowIdx * 2 + 1];
                                        return (
                                          <tr key={rowIdx} className={rowIdx % 2 === 0 ? "bg-gray-100 hover:bg-gray-100" : "bg-white hover:bg-gray-100"}>
                                            <td className="w-[32%] md:!px-6 !px-4 !py-4 text-gray-700 text-wrap font-semibold border-b border-r border-gray-900">{col1 || ""}</td>
                                            <td className="w-[68%] md:!px-6 !px-4 !py-4 text-gray-700 text-wrap font-medium border-b border-gray-900">{col2 || ""}</td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {exclusions.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <X className="h-5 w-5 text-red-500" /> Exclusions
                    </h3>
                    <div className="space-y-3">
                      {exclusions.map((item, i) => (
                        <div key={i} className="bg-red-50/50 border border-red-100 rounded-lg p-4 prose prose-sm max-w-none custom-desc-list">
                          {item.selectionDesc ? (
                            <div dangerouslySetInnerHTML={{ __html: item.selectionDesc }} />
                          ) : (
                            <p>No description available</p>
                          )}

                          {item.selectionHighlight?.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-red-200 not-prose">
                              <ul className="list-disc pl-5 space-y-2">
                                {item.selectionHighlight.map((hl, hIdx) => (
                                  <li key={hIdx}>
                                    <p className="text-md font-bold text-black">
                                      {hl.highlightName}
                                    </p>
                                    {hl.highlightDesc?.length > 0 && (
                                      <ul className="list-disc pl-5 mt-1 space-y-1">
                                        {hl.highlightDesc.map((desc, dIdx) => (
                                          <li key={dIdx} className="text-md text-black">
                                            {desc}
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {item.selectionTable?.length > 0 && (
                            <div className="mt-4 pt-4">
                              {item.selectionTable?.map((tbl, tIdx) => (
                                <div key={tIdx} className="mb-4 not-prose">
                                  <h5 className="text-md font-bold text-gray-900 mb-2">{tbl.tableName}</h5>
                                  <table className="w-full text-sm border-collapse border border-gray-300 rounded overflow-hidden">
                                    <tbody>
                                      {Array.from({ length: Math.ceil((tbl.tableDesc?.length || 0) / 2) }, (_, rowIdx) => {
                                        const col1 = tbl.tableDesc[rowIdx * 2];
                                        const col2 = tbl.tableDesc[rowIdx * 2 + 1];
                                        return (
                                          <tr key={rowIdx} className={rowIdx % 2 === 0 ? "bg-gray-100 hover:bg-gray-200" : "bg-white hover:bg-gray-200"}>
                                            <td className="w-[32%] !px-6 !py-4 text-gray-700 font-semibold border-b border-r border-gray-900">{col1 || ""}</td>
                                            <td className="w-[68%] !px-6 !py-4 text-gray-700 font-medium border-b border-gray-900">{col2 || ""}</td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ---- ADDITIONAL INFO TAB ---- */}
            {activeTab === "additional" && (
              <div className="space-y-6">

                {importantInfo.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">⚠️ Important Information</h3>
                    <div className="space-y-3">
                      {importantInfo.map((info, i) => (
                        <details key={i} className="group border border-yellow-200 rounded-lg overflow-hidden">
                          <summary className="cursor-pointer px-5 py-3.5 text-sm font-semibold text-gray-800 bg-yellow-50 hover:bg-yellow-100 flex items-center justify-between">
                            {info.selectionTitle}
                            <ChevronRight className="h-4 w-4 text-gray-400 group-open:rotate-90 transition-transform" />
                          </summary>
                          <div className="px-5 py-4 text-sm text-gray-600 prose prose-sm max-w-none custom-desc-list">
                            {info.selectionDesc ? (
                              <div dangerouslySetInnerHTML={{ __html: info.selectionDesc }} />
                            ) : (
                              <p>No description available</p>
                            )}

                            {info.selectionHighlight?.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-green-200 not-prose">
                                <ul className="list-disc pl-5 space-y-2">
                                  {info.selectionHighlight.map((hl, hIdx) => (
                                    <li key={hIdx}>
                                      <p className="text-md font-bold text-black">
                                        {hl.highlightName}
                                      </p>
                                      {hl.highlightDesc?.length > 0 && (
                                        <ul className="list-disc pl-5 mt-1 space-y-1">
                                          {hl.highlightDesc.map((desc, dIdx) => (
                                            <li key={dIdx} className="text-md text-black">
                                              {desc}
                                            </li>
                                          ))}
                                        </ul>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {info.selectionTable?.length > 0 && (
                              <div className="mt-4 pt-4">
                                {info.selectionTable?.map((tbl, tIdx) => (
                                  <div key={tIdx} className="mb-4 not-prose">
                                    <h5 className="text-md font-bold text-gray-900 mb-2">{tbl.tableName}</h5>
                                    <table className="w-full text-sm border-collapse border border-gray-300 rounded overflow-hidden">
                                      <tbody>
                                        {Array.from({ length: Math.ceil((tbl.tableDesc?.length || 0) / 2) }, (_, rowIdx) => {
                                          const col1 = tbl.tableDesc[rowIdx * 2];
                                          const col2 = tbl.tableDesc[rowIdx * 2 + 1];
                                          return (
                                            <tr key={rowIdx} className={rowIdx % 2 === 0 ? "bg-gray-100 hover:bg-gray-200" : "bg-white hover:bg-gray-200"}>
                                              <td className="w-[32%] md:!px-6 !px-1 !py-4 text-gray-700 text-wrap font-semibold border-b border-r border-gray-900 text-xs md:text-sm">{col1 || ""}</td>
                                              <td className="w-[68%] md:!px-6 !px-2 !py-4 text-gray-700 text-wrap font-medium border-b border-gray-900 text-sm md:text-sm">{col2 || ""}</td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                )}
                {others.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">📋 Other Information</h3>
                    <div className="space-y-3">
                      {others.map((info, i) => (
                        <details key={i} className="group border border-gray-200 rounded-lg overflow-hidden">
                          <summary className="cursor-pointer px-5 py-3.5 text-sm font-semibold text-gray-800 bg-gray-50 hover:bg-gray-100 flex items-center justify-between">
                            {info.selectionTitle}
                            <ChevronRight className="h-4 w-4 text-gray-400 group-open:rotate-90 transition-transform" />
                          </summary>
                          <div className="px-5 py-4 text-sm text-gray-600 prose prose-sm max-w-none custom-desc-list">
                            {info.selectionDesc ? (
                              <div dangerouslySetInnerHTML={{ __html: info.selectionDesc }} />
                            ) : (
                              <p>No description available</p>
                            )}

                            {info.selectionHighlight?.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-green-200 not-prose">
                                <ul className="list-disc pl-5 space-y-2">
                                  {info.selectionHighlight.map((hl, hIdx) => (
                                    <li key={hIdx}>
                                      <p className="text-md font-bold text-black">
                                        {hl.highlightName}
                                      </p>
                                      {hl.highlightDesc?.length > 0 && (
                                        <ul className="list-disc pl-5 mt-1 space-y-1">
                                          {hl.highlightDesc.map((desc, dIdx) => (
                                            <li key={dIdx} className="text-md text-black">
                                              {desc}
                                            </li>
                                          ))}
                                        </ul>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {info.selectionTable?.length > 0 && (
                              <div className="mt-4 pt-4">
                                {info.selectionTable?.map((tbl, tIdx) => (
                                  <div key={tIdx} className="mb-4 not-prose">
                                    <h5 className="text-md font-bold text-gray-900 mb-2">{tbl.tableName}</h5>
                                    <table className="w-full text-sm border-collapse border border-gray-300 rounded overflow-hidden">
                                      <tbody>
                                        {Array.from({ length: Math.ceil((tbl.tableDesc?.length || 0) / 2) }, (_, rowIdx) => {
                                          const col1 = tbl.tableDesc[rowIdx * 2];
                                          const col2 = tbl.tableDesc[rowIdx * 2 + 1];
                                          return (
                                            <tr key={rowIdx} className={rowIdx % 2 === 0 ? "bg-gray-100 hover:bg-gray-200" : "bg-white hover:bg-gray-200"}>
                                              <td className="w-[32%] md:!px-6 !px-2 !py-4 text-gray-700 text-wrap font-semibold border-b border-r border-gray-900 text-sm">{col1 || ""}</td>
                                              <td className="w-[68%] md:!px-6 !px-2 !py-4 text-gray-700 text-wrap font-medium border-b border-gray-900 text-sm">{col2 || ""}</td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ---- POLICY TAB ---- */}
            {activeTab === "policy" && (
              <div className="space-y-6">
                {policies.length > 0 ? policies.map((policy, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-5">
                    <h4 className="font-bold text-lg mb-3">{policy.selectionTitle}</h4>
                    <div className="prose prose-sm max-w-none text-gray-600 custom-desc-list">
                      {policy.selectionDesc.split("\n").map((line, li) => (
                        line ? (
                          <p key={li} className="whitespace-pre-line">
                            <span dangerouslySetInnerHTML={{ __html: line }} />
                          </p>
                        ) : <br key={li} />
                      ))}
                    </div>
                    {/* Highlights */}
                    {policy.selectionHighlight?.length > 0 && (
                      <div className="mt-4 pt-4">
                        <ul className="list-disc pl-5 space-y-2">
                          {policy.selectionHighlight.map((hl, hIdx) => (
                            <li key={hIdx}>
                              <p className="text-md font-semibold text-gray-800">
                                {hl.highlightName}
                              </p>

                              {hl.highlightDesc?.length > 0 && (
                                <ul className="list-disc pl-5 mt-1 space-y-1">
                                  {hl.highlightDesc.map((desc, dIdx) => (
                                    <li key={dIdx} className="text-md text-gray-600">
                                      {desc}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Table */}
                    {policy.selectionTable?.length > 0 && (
                      <div className="mt-4 pt-4 ">
                        {policy.selectionTable.map((tbl, tIdx) => (
                          <div key={tIdx} className="mb-4">
                            <h5 className="text-md font-semibold text-gray-900 mb-2">{tbl.tableName}</h5>
                            <table className="w-full text-sm border-collapse">
                              <tbody>
                                {Array.from(
                                  { length: Math.ceil((tbl.tableDesc?.length || 0) / 2) },
                                  (_, rowIdx) => {
                                    const col1 = tbl.tableDesc[rowIdx * 2];
                                    const col2 = tbl.tableDesc[rowIdx * 2 + 1];

                                    return (
                                      <tr key={rowIdx} className="align-top">
                                        {/* Left */}
                                        <td className="w-[32%] bg-gray-100 px-6 py-4 text-gray-700 font-semibold border-b border-r border-gray-900">
                                          {col1 || ""}
                                        </td>

                                        {/* Right */}
                                        <td className="w-[68%] bg-gray-100 px-6 py-4 text-gray-700 font-medium border-b border-gray-900">
                                          {col2 || ""}
                                        </td>
                                      </tr>
                                    );
                                  }
                                )}
                              </tbody>
                            </table>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                )) : (
                  <p className="text-gray-500">No policies available.</p>
                )}

              </div>
            )}

            {/* ---- HOTELS TAB ---- */}
            {activeTab === "hotels" && (
              <div className="space-y-2 md:space-y-5">
                {hotels.length > 0 ? (
                  <>
                    <div className="flex items-start px-2 gap-0">
                      <div className="md:w-28 w-20 shrink-0">
                        <span className="font-bold text-gray-900 text-sm md:text-[15px]">Tag :-</span>
                      </div>
                      <div className="flex-1 px-4 border-l-2 border-transparent">
                        <span className="font-bold text-gray-900 text-sm md:text-[15px]">City :-</span>
                      </div>
                      <div className="flex-1 px-1 md:px-4 border-l-2 border-transparent">
                        <span className="font-bold text-gray-900 text-sm md:text-[15px]">Hotel :-</span>
                      </div>
                    </div>

                    {hotels.map((hotel, i) => (
                      <div key={i} className="flex items-center border border-gray-200 px-2 py-2 gap-0">
                        {/* Day Badge */}
                        <div className="md:w-28 w-20 shrink-0">
                          <span className="bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs font-bold px-4 py-2 rounded-full">
                            {hotel.days}
                          </span>
                        </div>
                        {/* City */}
                        <div className="flex-1 flex flex-col md:flex-row items-center gap-2 px-4 border-l-2 border-gray-300">
                          <span className="text-gray-700 text-xs md:text-[15px]">{hotel.cityName}</span>
                        </div>
                        {/* Hotel */}
                        <div className="flex-1 flex flex-col md:flex-row items-center gap-1 md:gap-2 px-2 md:px-4 border-l-2 border-gray-300">
                          <span className="text-gray-700 text-xs md:text-[15px] text-start md:text-center">{hotel.hotelName}</span>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="text-gray-500 py-4">No hotels available.</p>
                )}
                {/* Important Notes & Accommodation Policy */}
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-5">
                  <h4 className="font-bold text-xl text-yellow-900 mb-4 flex items-center gap-2">
                    📋 Important Notes & Accommodation Policy
                  </h4>
                  <div className="space-y-3 text-md text-gray-700">
                    <div>
                      <p className="font-bold  text-gray-800 mb-1">Property Substitution:</p>
                      <p className="">In the event of unforeseen circumstances or operational constraints, the company reserves the right to change the designated hotel to another property of a similar category, subject to availability.</p>
                    </div>
                    <div>
                      <p className="font-bold  text-gray-800 mb-1">Room Configuration:</p>
                      <p>All tour packages are based on double-sharing accommodation only.</p>
                    </div>
                    <div>
                      <p className="font-bold  text-gray-800 mb-1">Single Occupancy Surcharge:</p>
                      <p>Guests requesting a private room (single occupancy) will incur a single supplement fee. The total amount is subject to availability and includes all applicable taxes for the duration of the stay</p>
                    </div>
                    <div>
                      <p className="font-bold  text-gray-800 mb-1">Force Majeure Stays:</p>
                      <p>In the event of flight cancellations or delays caused by adverse weather, technical snags, or other unavoidable situations, any costs arising from additional accommodation or meals beyond the scheduled itinerary must be borne directly by the guest at the location.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ---- SUMMARY TAB ---- */}
            {activeTab === "summary" && (() => {
              const summary = packageDetails.summary || [];

              return (
                <div className="space-y-0">
                  {summary.length > 0 ? summary.map((item, i) => (
                    <div key={i} className="flex border-b border-gray-200">
                      {/* Left: Day + Date */}
                      <div className="w-36 shrink-0 py-5 px-4 border-l-4 border-orange-400 bg-gray-50">
                        <p className="font-bold text-gray-900 text-lg">{item.days}</p>
                      </div>

                      {/* Right: Description grid (2 per row) */}
                      <div className="flex-1 py-5 px-4">
                        {(() => {
                          const descs = item.description || [];
                          // Group descriptions into rows of 2
                          const rows = [];
                          for (let r = 0; r < descs.length; r += 2) {
                            rows.push(descs.slice(r, r + 2));
                          }
                          return rows.map((row, ri) => (
                            <div key={ri}>
                              {ri > 0 && rows.length > 1 && (
                                <hr className="border-gray-400 my-3" />
                              )}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-0 md:divide-x md:divide-gray-400">
                                {row.map((desc, di) => (
                                  <div key={di} className="flex items-start gap-3 px-2">
                                    <Image
                                      className="w-6 h-6"
                                      src="/square.png"
                                      alt="Check"
                                      width={20}
                                      height={20}
                                    />
                                    <span className="text-sm text-gray-700">{desc}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  )) : (
                    <p className="text-gray-500 py-4">No summary available.</p>
                  )}
                </div>
              );
            })()}

            {/* ---- REVIEWS TAB ---- */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-4">✍️ Write a Review</h3>
                  <ReviewForm
                    user={sanitizedUser}
                    packageName={packageDetails.packageName}
                    packageId={packageDetails._id}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">⭐ Customer Reviews</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-sm">{avgRating || 0}</span>
                    <span className="text-sm text-gray-500">({validReviews.length} reviews)</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {validReviews.length > 0 ? validReviews.map((review, i) => (
                    <Card key={i} className="border border-gray-100">
                      <CardContent className="pt-4">
                        <h4 className="font-semibold">{review.user.name}</h4>
                        <div className="flex items-center mt-1 gap-1">
                          {[...Array(5)].map((_, si) => (
                            <Star
                              key={si}
                              className={`h-4 w-4 ${si < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                            />
                          ))}
                          <span className="ml-1 text-sm">({review.rating}.0)</span>
                          <span className="ml-2 text-xs text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric", month: "short", year: "numeric"
                            })}
                          </span>
                        </div>
                        <p className="mt-3 text-gray-700 italic">{review.message}</p>
                      </CardContent>
                    </Card>
                  )) : (
                    <div className="flex flex-col items-center py-12 text-gray-500">
                      <Star className="h-10 w-10 text-yellow-500 fill-yellow-500 mb-2" />
                      <p className="font-semibold">No Reviews Yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========== SPIRITUAL JOURNEY ========== */}
            {/* <section className="mt-12 mb-8">
              <h3 className="font-bold text-2xl text-center mb-4">Be a part of a spiritual journey.</h3>
              <p className="text-gray-600 text-center w-[90%] mx-auto text-sm mb-6">
                YatraZone is more than just a travel company; we are facilitators of spiritual exploration and cultural
                immersion tailored for Indian pilgrims and global adventurers.
              </p>
              <FeaturedCarouselWrapper
                featuredPackages={JSON.parse(JSON.stringify(featuredPackages))}
              />
            </section> */}
          </div>

          {/* ===== RIGHT SIDEBAR (28%) ===== */}
          <div className="w-full lg:w-[28%]">
            {/* Price Card - Sticky */}
            <div className="sticky top-14 space-y-4">
              {/* Main Price Card */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {/* Discount badge */}
                {packageDetails.price > 0 && packageDetails.basicDetails?.originalPrice > packageDetails.price && (
                  <div className="bg-green-600 text-white text-center text-xs font-bold py-1.5 px-3">
                    🏷️ FLAT {Math.round(((packageDetails.basicDetails.originalPrice - packageDetails.price) / packageDetails.basicDetails.originalPrice) * 100)}% OFF
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-baseline gap-2 mb-1">
                    {packageDetails.price === 0 ? (
                      <span className="text-3xl font-bold text-gray-900">XXXX*</span>
                    ) : (
                      <>
                        <span className="text-3xl font-bold text-gray-900">₹{formatNumber(packageDetails.price)}</span>
                        <span className="text-sm text-gray-500">/Adult</span>
                      </>
                    )}
                  </div>
                  {packageDetails.basicDetails?.originalPrice > packageDetails.price && (
                    <p className="text-sm text-gray-400 line-through mb-1">
                      ₹{formatNumber(packageDetails.basicDetails.originalPrice)}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mb-4">Excluding applicable taxes</p>

                  {/* Proceed to Payment */}
                  {packageDetails.price === 0 ? (
                    <button className="w-full bg-orange-400 text-white py-3 rounded-lg text-sm font-bold opacity-50 cursor-not-allowed" disabled>
                      PROCEED TO PAYMENT
                    </button>
                  ) : (
                    <Link href={`/checkout/${packageDetails._id}`} className="block">
                      <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-lg text-sm font-bold transition-all shadow-md">
                        PROCEED TO PAYMENT
                      </button>
                    </Link>
                  )}

                  {/* Contact buttons */}
                  <div className="flex gap-2 mt-3">
                    <Link
                      href={`tel:+918006000325`}
                      target="_blank"
                      className="p-4 flex items-center justify-center border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-lg transition-colors"
                    >
                      <PhoneCall className="h-4 w-4" />

                    </Link>
                    <Link
                      href={`https://wa.me/918006000325?text=${encodeURIComponent(`I'm interested in ${packageDetails.packageName}`)}`}
                      target="_blank"
                      className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Whatsapp
                    </Link>
                    <button className="flex-1 flex items-center justify-center gap-1.5 text-black hover:bg-gray-50 text-sm font-semibold py-2.5 rounded-lg transition-colors">
                      Happy to help
                    </button>
                  </div>
                </div>
              </div>

              {/* Category Type Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                <h4 className="text-base font-bold text-gray-800 ">Category Type :</h4>
                <p className="text-sm text-black text-wrap">
                  {packageDetails.basicDetails?.tourType || "Group Package"}
                </p>
              </div>

              {/* Coupons & Offers Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h4 className="text-base font-bold text-gray-800 mb-3">Coupons & Offers</h4>
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Have a Coupon Code?"
                    className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-300"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="text-sm font-semibold text-orange-600 hover:text-orange-700 px-2"
                  >
                    Enter Code
                  </button>
                </div>
                {couponApplied && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-green-700">✅ DHAMSPECIAL</p>
                      <p className="text-xs text-green-600">Coupon Applied Successfully</p>
                    </div>
                    <span className="text-sm font-bold text-green-700">-₹6,517</span>
                  </div>
                )}
              </div>

              {/* Share Section */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h4 className="text-sm font-bold text-gray-800 mb-3">Share this Package</h4>
                <div className="flex gap-2">
                  <button
                    onClick={handleShare}
                    className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs py-2.5 rounded-lg transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs py-2.5 rounded-lg transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                    {copied ? "Copied!" : "Copy Link"}
                  </button>
                </div>
              </div>

              {/* Plan Your Own Way */}
              {packageDetails.basicDetails?.planCalculator === "Yes" && (
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 text-center text-white">
                  <Link href={`/calculator/${packageDetails._id}`}>
                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold py-2.5 rounded-lg transition-colors">
                      <Calculator className="h-4 w-4 inline mr-1.5" />
                      Package Calculator
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      {/* ========== YOU MIGHT ALSO LIKE ========== */}
      {packages.length > 0 && (
        <div className="mt-10 w-full md:w-[85%] mx-auto px-5 md:px-0">
          <h3 className="text-2xl font-recoleta text-gray-900 mb-2">You Might Also Like</h3>
          <p className="text-sm text-gray-500 mb-6 font-sans">
            We don't just suggest—we predict. Based on your current interests, we've gathered a collection of insights and products
            designed to complement your style. Whether you're looking to dive deeper into this topic or find the perfect finishing touch,
            these recommendations are tailored to meet you right where you are.
          </p>
          <PackageCarouselWrapper
            packages={JSON.parse(JSON.stringify(packages))}
            formatNumeric={formatNumericStr}
          />
        </div>
      )}
      {/* ========== GALLERY LIGHTBOX MODAL ========== */}
      {galleryOpen && galleryImages.length > 0 && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col" onClick={closeGallery}>
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3 text-white" onClick={(e) => e.stopPropagation()}>
            <span className="text-sm font-medium">
              {galleryIndex + 1} / {galleryImages.length}
            </span>
            <button
              onClick={closeGallery}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Main image area */}
          <div className="flex-1 flex items-center justify-center relative px-4" onClick={(e) => e.stopPropagation()}>
            {/* Prev button */}
            <button
              onClick={prevImage}
              className="absolute left-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Image */}
            <div className="relative w-full max-w-5xl h-[70vh]">
              <Image
                src={galleryImages[galleryIndex]?.url}
                alt={`Gallery image ${galleryIndex + 1}`}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Next button */}
            <button
              onClick={nextImage}
              className="absolute right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Thumbnail strip */}
          <div className="px-4 py-3 overflow-x-auto no-scrollbar" onClick={(e) => e.stopPropagation()}>
            <div className="flex gap-2 justify-center">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setGalleryIndex(i)}
                  className={`relative w-16 h-12 rounded-md overflow-hidden shrink-0 border-2 transition-all ${i === galleryIndex
                    ? "border-white opacity-100"
                    : "border-transparent opacity-50 hover:opacity-80"
                    }`}
                >
                  <Image
                    src={img?.url}
                    alt={`Thumb ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
