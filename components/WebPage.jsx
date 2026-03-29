"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Link as LinkIcon,
  Quote,
  Share2,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const isFilledText = (value) => typeof value === "string" && value.replace(/<[^>]*>/g, "").trim().length > 0;

const cleanTextArray = (items = []) => items.filter((item) => isFilledText(item));

const cleanObjectArray = (items = [], keys = []) =>
  items.filter((item) => keys.some((key) => isFilledText(item?.[key])));

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const HtmlBlock = ({ html, className = "" }) => {
  if (!isFilledText(html)) return null;
  return (
    <div
      className={`prose prose-sm max-w-none text-gray-600 leading-7 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

const StaticSidebarCard = () => (
  <div className="rounded-[20px] border-2 border-[#6a5cff] bg-white p-5 shadow-[0_20px_60px_rgba(95,76,255,0.08)]">
    <div className="rounded-2xl border-2 border-[#f15a29] bg-[#fffdf8] p-5">
      <h3 className="text-lg font-bold text-gray-900">Deliver a premium client experience with Bonsai</h3>
      <ul className="mt-4 space-y-3 text-sm text-gray-700">
        <li>Branded portal where clients access projects and docs 24/7</li>
        <li>Clear workflows for proposals, invoices, and revisions</li>
        <li>Fewer back-and-forth messages with streamlined collaboration</li>
        <li>Launch a polished client portal in less than 15 minutes</li>
      </ul>
      <div className="mt-5 space-y-3">
        <button className="w-full rounded-full bg-black px-4 py-3 text-sm font-semibold text-white">
          Try Portal for free
        </button>
        <button className="w-full rounded-full border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-800">
          Contact sales
        </button>
      </div>
    </div>
  </div>
);

const AuthorCard = ({ data }) => {
  const authorName = data.sideThumbName || "Editorial Team";
  const authorRole = data.sideThumbDesignation || "CONTENT WRITER";
  const authorImage = data.sideThumbImage?.url || data.mainProfileImage?.url || data.bannerImage?.url;
  const socials = [
    data.facebookUrl ? { href: data.facebookUrl, label: "Facebook", icon: Facebook } : null,
    data.instaUrl ? { href: data.instaUrl, label: "Instagram", icon: Instagram } : null,
    data.youtubeUrl ? { href: data.youtubeUrl, label: "Website", icon: Globe } : null,
    data.googleUrl ? { href: data.googleUrl, label: "LinkedIn", icon: Linkedin } : null,
  ].filter(Boolean);

  return (
    <div className="rounded-[20px] border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-400">About</p>
      <div className="mt-4 flex items-start gap-3">
        {authorImage ? (
          <img src={authorImage} alt={authorName} className="h-12 w-12 rounded-full object-cover" />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ebe7ff] text-base font-bold text-[#4f46e5]">
            {authorName.charAt(0)}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-gray-900">{authorName}</h3>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">{authorRole}</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-gray-600">
        Thoughtful writing, practical insights, and a polished editorial voice tailored for modern web pages.
      </p>
      <div className="mt-5 flex items-center gap-3">
        {socials.length > 0 ? (
          socials.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-[#4f46e5] hover:text-[#4f46e5]"
              aria-label={label}
            >
              <Icon className="h-4 w-4" />
            </a>
          ))
        ) : (
          <>
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600"><Globe className="h-4 w-4" /></span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600"><Instagram className="h-4 w-4" /></span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600"><Linkedin className="h-4 w-4" /></span>
          </>
        )}
      </div>
    </div>
  );
};

const ShareCard = ({ slug }) => {
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/${slug}` : "";

  const copyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // no-op
    }
  };

  return (
    <div className="rounded-[20px] border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-gray-900">Share this package</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700">
          <Share2 className="h-4 w-4" />
          Share
        </button>
        <button
          onClick={copyLink}
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700"
        >
          <LinkIcon className="h-4 w-4" />
          Copy Link
        </button>
      </div>
    </div>
  );
};

const SocialRail = ({ data }) => {
  const items = [
    data.facebookUrl ? { href: data.facebookUrl, label: "Facebook", icon: Facebook } : null,
    data.instaUrl ? { href: data.instaUrl, label: "Instagram", icon: Instagram } : null,
    data.googleUrl ? { href: data.googleUrl, label: "LinkedIn", icon: Linkedin } : null,
  ].filter(Boolean);

  return (
    <div className="flex flex-col items-center gap-4 text-gray-500">
      <div className="rounded-full border border-gray-200 bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em]">
        {formatDate(data.updatedAt || data.createdAt) || "2 Min Read"}
      </div>
      <div className="h-12 w-px bg-gray-200" />
      {items.length > 0 ? (
        items.map(({ href, label, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-gray-900"
            aria-label={label}
          >
            <Icon className="h-4 w-4" />
          </a>
        ))
      ) : (
        <>
          <Globe className="h-4 w-4" />
          <Instagram className="h-4 w-4" />
          <Linkedin className="h-4 w-4" />
        </>
      )}
    </div>
  );
};

const PopularDestinations = () => {
  const [hotels, setHotels] = useState([]);
  const [hotelCategories, setHotelCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [hotelsLoading, setHotelsLoading] = useState(true);

  useEffect(() => {
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
      } catch {
        setHotels([]);
        setHotelCategories([]);
      } finally {
        setHotelsLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const filteredHotels =
    activeCategory === "All" ? hotels : hotels.filter((hotel) => hotel.category === activeCategory);

  return (
    <section className="w-full border-t border-[#ece7df] bg-white px-4 py-10 md:px-20">
      <h2 className="font-recoleta text-2xl font-bold text-gray-900 md:text-3xl">
        Your style. These stays. A perfect match.
      </h2>
      <p className="mb-5 mt-1 font-sans text-sm text-gray-500">
        Handpicked Popular Destination curated just for you
      </p>

      <div className="mb-6 flex gap-5 overflow-x-auto border-b border-gray-200">
        <button
          onClick={() => setActiveCategory("All")}
          className={`whitespace-nowrap border-b-2 pb-2.5 px-1 text-sm font-medium transition-colors ${
            activeCategory === "All"
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          All
        </button>
        {hotelCategories.map((cat, key) => (
          <button
            key={cat._id || key}
            onClick={() => setActiveCategory(cat.name)}
            className={`whitespace-nowrap border-b-2 pb-2.5 px-1 text-sm font-medium transition-colors ${
              activeCategory === cat.name
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {hotelsLoading ? (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="mb-3 h-48 w-full rounded-xl bg-gray-200" />
              <div className="mb-2 h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-1/2 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      ) : filteredHotels.length > 0 ? (
        <Carousel className="w-full" opts={{ align: "start" }}>
          <CarouselContent className="-ml-3">
            {filteredHotels.map((hotel) => (
              <CarouselItem key={hotel._id} className="basis-1/2 pl-3 md:basis-1/4">
                <Link
                  href={hotel.imageClickLink || "#"}
                  target={hotel.imageClickLink ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="group block cursor-pointer"
                >
                  <div className="relative mb-3 h-60 w-full overflow-hidden rounded-xl bg-[#f8f5ef]">
                    {hotel.image?.url ? (
                      <img
                        src={hotel.image.url}
                        alt={hotel.name}
                        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 md:text-base">{hotel.name}</h3>
                  <p className="text-xs text-gray-500 md:text-sm">{hotel.location}</p>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="!-left-3 !top-1/3 z-10 !-translate-y-1/2 rounded-full bg-white/90 shadow-md hover:bg-white" />
          <CarouselNext className="!-right-3 !top-1/3 z-10 !-translate-y-1/2 rounded-full bg-white/90 shadow-md hover:bg-white" />
        </Carousel>
      ) : (
        <p className="py-8 text-center text-gray-400">No popular destinations found in this category.</p>
      )}
    </section>
  );
};

const WebPage = ({ data }) => {
  const [openAccordion, setOpenAccordion] = useState(0);
  const isDesignTwo = data.templateType === "design2";
  const isDesignThree = data.templateType === "design3";

  const tags = useMemo(() => cleanTextArray(data.createTags), [data.createTags]);
  const paragraphs = useMemo(
    () => cleanObjectArray(data.paragraphSections, ["title", "description"]),
    [data.paragraphSections]
  );
  const tableRows = useMemo(() => cleanObjectArray(data.tableRows, ["column1", "column2"]), [data.tableRows]);
  const highlights = useMemo(() => cleanObjectArray(data.highlights, ["title", "point"]), [data.highlights]);
  const accordionItems = useMemo(
    () => cleanObjectArray(data.accordionTags, ["left", "right"]),
    [data.accordionTags]
  );
  const blockquoteTags = useMemo(() => cleanTextArray(data.blockquoteTags), [data.blockquoteTags]);

  const paragraphImages = [data.paragraphFirstImage?.url, data.paragraphSecondImage?.url].filter(Boolean);
  const headerImage = data.bannerImage?.url || data.imageFirst?.url || paragraphImages[0] || data.sideThumbImage?.url;
  const leadParagraph = isDesignTwo ? paragraphs[0] : null;
  const contentParagraphs = isDesignTwo ? paragraphs.slice(1) : paragraphs;
  const contentParagraphImages = isDesignTwo ? [] : paragraphImages;
  const designThreeHeroImages = [
    data.imageFirst?.url,
    data.mainProfileImage?.url,
    data.bannerImage?.url,
    ...(data.imageGallery || []).map((item) => item?.url).filter(Boolean),
  ].filter(Boolean).slice(0, 3);
  const introHighlight = isDesignThree ? highlights[0] : null;
  const remainingHighlights = isDesignThree ? highlights.slice(1) : highlights;

  return (
    <div className="min-h-screen bg-[#f5f1eb] font-barlow text-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[28px] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
          <div className="border-b border-[#ece7df] bg-[#f7f3ed] px-5 py-4 sm:px-8">
            <div className="flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              <Link href="/" className="text-gray-500 transition hover:text-gray-900">
                &lt; Back to blog
              </Link>
              <span>{data.templateType || "Web Page"}</span>
            </div>
            <div className={`mt-5 grid gap-6 ${isDesignThree ? "grid-cols-1" : isDesignTwo ? "lg:grid-cols-[260px_minmax(0,760px)] lg:justify-center" : "lg:grid-cols-[320px_1fr] lg:items-center"}`}>
              {isDesignThree ? (
                <div className="grid gap-3 md:grid-cols-[120px_120px_minmax(0,1fr)]">
                  {designThreeHeroImages[0] ? (
                    <img src={designThreeHeroImages[0]} alt={data.title} className="h-[135px] w-full rounded-[14px] object-cover" />
                  ) : (
                    <div className="h-[135px] rounded-[14px] bg-[linear-gradient(135deg,#c4b5fd,#fbcfe8)]" />
                  )}
                  <div className="flex h-[135px] flex-col justify-center rounded-[14px] bg-black px-4 text-[#ffcc66]">
                    <p className="font-serif text-3xl italic">Yatra2026</p>
                    <p className="mt-1 text-lg font-bold leading-tight text-[#ffe28c]">{data.title}</p>
                    <button className="mt-3 w-fit rounded-full bg-[#ff5a1f] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                      Read More
                    </button>
                  </div>
                  {designThreeHeroImages[2] || designThreeHeroImages[1] ? (
                    <img
                      src={designThreeHeroImages[2] || designThreeHeroImages[1]}
                      alt={data.title}
                      className="h-[135px] w-full rounded-[14px] object-cover"
                    />
                  ) : (
                    <div className="h-[135px] rounded-[14px] bg-[linear-gradient(135deg,#93c5fd,#dbeafe)]" />
                  )}
                </div>
              ) : (
              <div className="overflow-hidden rounded-[18px] bg-[#efe8df]">
                {headerImage ? (
                  <img src={headerImage} alt={data.title} className="h-[240px] w-full object-cover lg:h-[220px]" />
                ) : (
                  <div className="flex h-[220px] items-center justify-center bg-[linear-gradient(135deg,#ddd6fe,#f5d0fe,#fde68a)] text-2xl font-bold text-gray-800">
                    {data.title}
                  </div>
                )}
              </div>
              )}
              <div>
                {isFilledText(data.firstTitle) && (
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8f7c62]">{data.firstTitle}</p>
                )}
                <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                  {data.title}
                </h1>
                {isFilledText(data.secondTitle) && (
                  <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600">{data.secondTitle}</p>
                )}
                {tags.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[#d9d0c3] bg-white px-3 py-1 text-xs font-semibold text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8e4ff] text-sm font-bold text-[#4f46e5]">
                      {(data.sideThumbName || "E").charAt(0)}
                    </span>
                    <span>{data.sideThumbName || "Editorial Team"}</span>
                  </div>
                  <span className="h-1 w-1 rounded-full bg-gray-300" />
                  <span>{formatDate(data.updatedAt || data.createdAt) || "January 9, 2026"}</span>
                </div>
              </div>
            </div>
          </div>

          {isDesignTwo && leadParagraph && (
            <div className="px-5 pt-8 sm:px-8">
              <section className="mx-auto max-w-3xl space-y-5 text-center">
                {isFilledText(leadParagraph.title) && (
                  <h2 className="text-4xl font-bold leading-tight text-gray-950">{leadParagraph.title}</h2>
                )}
                <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-gray-500">
                  <span>{data.postedBy?.admin ? "By Admin" : data.sideThumbName || "Editorial Team"}</span>
                  <span className="h-1 w-1 rounded-full bg-gray-300" />
                  <span>{formatDate(data.updatedAt || data.createdAt) || "January 19, 2026"}</span>
                  <span className="h-1 w-1 rounded-full bg-gray-300" />
                  <span>{highlights.length > 0 ? `${highlights.length * 67} views` : "134 views"}</span>
                </div>
                <HtmlBlock html={leadParagraph.description} className="mx-auto max-w-3xl text-left sm:text-center" />
                {paragraphImages.length > 0 && (
                  <div className={`grid gap-4 ${paragraphImages.length > 1 ? "sm:grid-cols-2" : "grid-cols-1"}`}>
                    {paragraphImages.map((image, index) => (
                      <div key={`${image}-${index}`} className="overflow-hidden rounded-[22px] bg-[#f8f5ef]">
                        <img
                          src={image}
                          alt={leadParagraph.title || `Lead image ${index + 1}`}
                          className="h-[240px] w-full object-cover sm:h-[300px]"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}

          <div className={`grid gap-10 px-5 py-8 sm:px-8 ${isDesignThree ? "lg:grid-cols-[56px_minmax(0,1fr)_180px] lg:items-start" : isDesignTwo ? "lg:grid-cols-[250px_minmax(0,1fr)] lg:items-start" : "lg:grid-cols-[290px_1fr]"}`}>
            {isDesignThree ? (
              <>
                <aside className="hidden lg:block">
                  <SocialRail data={data} />
                </aside>
                <main className="space-y-10">
                  {introHighlight && (
                    <section className="space-y-4">
                      {isFilledText(introHighlight.title) && (
                        <h2 className="text-3xl font-bold leading-tight text-gray-950">{introHighlight.title}</h2>
                      )}
                      {isFilledText(introHighlight.point) && (
                        <p className="text-base leading-7 text-gray-600">{introHighlight.point}</p>
                      )}
                    </section>
                  )}
                  {contentParagraphs.length > 0 &&
                    contentParagraphs.map((section, index) => (
                      <section key={`${section.title}-${index}`} className="space-y-5">
                        {isFilledText(section.title) && (
                          <h2 className="text-2xl font-bold leading-tight text-gray-950">{section.title}</h2>
                        )}
                        <HtmlBlock html={section.description} />
                        {paragraphImages.length > 0 && index === 0 && (
                          <div className={`grid gap-4 ${paragraphImages.length > 1 ? "sm:grid-cols-[2fr_1fr]" : "grid-cols-1"}`}>
                            {paragraphImages.map((image, imgIndex) => (
                              <div key={`${image}-${imgIndex}`} className="overflow-hidden rounded-[10px] bg-[#f8f5ef]">
                                <img
                                  src={image}
                                  alt={section.title || `Section image ${imgIndex + 1}`}
                                  className="h-[180px] w-full object-cover sm:h-[230px]"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </section>
                    ))}

                  {tableRows.length > 0 && (
                    <section className="space-y-4">
                      <h2 className="text-xl font-bold text-gray-950">{data.tableTitle || "Table Information"}</h2>
                      <div className="overflow-hidden rounded-[8px] border border-[#ddd5ca] bg-white">
                        <table className="w-full text-left text-sm">
                          <tbody>
                            {tableRows.map((row, index) => (
                              <tr key={`${row.column1}-${row.column2}-${index}`} className="border-b border-[#ece7df] last:border-b-0">
                                <td className="w-1/2 px-4 py-3 font-medium text-gray-700">{row.column1 || "-"}</td>
                                <td className="w-1/2 px-4 py-3 text-gray-600">{row.column2 || "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  )}

                  {(isFilledText(data.blockquoteDescription) || isFilledText(data.blockquoteMainTitle)) && (
                    <section className="rounded-[16px] bg-[linear-gradient(135deg,#3f3a7a,#4c4489,#6156b0)] px-6 py-7 text-white shadow-[0_25px_60px_rgba(79,70,229,0.2)]">
                      <Quote className="h-7 w-7 text-white/80" />
                      {isFilledText(data.blockquoteMainTitle) && (
                        <h2 className="mt-3 text-2xl font-bold leading-tight">{data.blockquoteMainTitle}</h2>
                      )}
                      <div className="mt-4 text-white/95">
                        <HtmlBlock html={data.blockquoteDescription} className="!text-white [&_*]:!text-white" />
                      </div>
                      {isFilledText(data.blockquoteLeftTitle) && (
                        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">{data.blockquoteLeftTitle}</p>
                      )}
                    </section>
                  )}

                  {remainingHighlights.length > 0 && (
                    <section className="space-y-4">
                      {remainingHighlights.map((item, index) => (
                        <div key={`${item.title}-${index}`} className="space-y-2">
                          {isFilledText(item.title) && <h3 className="text-xl font-bold text-gray-950">{item.title}</h3>}
                          {isFilledText(item.point) && <p className="text-sm leading-7 text-gray-600">{item.point}</p>}
                        </div>
                      ))}
                    </section>
                  )}
                </main>
                <aside className="hidden lg:block">
                  <ShareCard slug={data.slug} />
                </aside>
              </>
            ) : (
              <>
            <aside className="space-y-5">
              <StaticSidebarCard />
              <AuthorCard data={data} />
              <ShareCard slug={data.slug} />
            </aside>

            <main className="space-y-10">
              {contentParagraphs.length > 0 &&
                contentParagraphs.map((section, index) => (
                  <section key={`${section.title}-${index}`} className="space-y-5">
                    {isFilledText(section.title) && (
                      <h2 className={`${isDesignTwo ? "text-2xl" : "text-3xl"} font-bold leading-tight text-gray-950`}>
                        {section.title}
                      </h2>
                    )}
                    <HtmlBlock html={section.description} />
                    {contentParagraphImages[index] && (
                      <div className="overflow-hidden rounded-[22px] bg-[#f8f5ef]">
                        <img
                          src={contentParagraphImages[index]}
                          alt={section.title || `Section image ${index + 1}`}
                          className="h-[260px] w-full object-cover sm:h-[360px]"
                        />
                      </div>
                    )}
                  </section>
                ))}

              {tableRows.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-950">{data.tableTitle || "Table Information"}</h2>
                  <div className="overflow-hidden rounded-[18px] border border-[#ddd5ca] bg-white">
                    <table className="w-full text-left text-sm">
                      <tbody>
                        {tableRows.map((row, index) => (
                          <tr key={`${row.column1}-${row.column2}-${index}`} className="border-b border-[#ece7df] last:border-b-0">
                            <td className="w-1/2 px-4 py-3 font-medium text-gray-700">{row.column1 || "-"}</td>
                            <td className="w-1/2 px-4 py-3 text-gray-600">{row.column2 || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {(isFilledText(data.blockquoteDescription) || isFilledText(data.blockquoteMainTitle)) && (
                <section className={`rounded-[24px] bg-[linear-gradient(135deg,#3f3a7a,#4c4489,#6156b0)] px-6 py-7 text-white shadow-[0_25px_60px_rgba(79,70,229,0.2)] ${isDesignTwo ? "max-w-3xl" : ""}`}>
                  <Quote className="h-7 w-7 text-white/80" />
                  {isFilledText(data.blockquoteMainTitle) && (
                    <h2 className="mt-3 text-2xl font-bold leading-tight">{data.blockquoteMainTitle}</h2>
                  )}
                  <div className="mt-4 text-white/95">
                    <HtmlBlock html={data.blockquoteDescription} className="!text-white [&_*]:!text-white" />
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                    {isFilledText(data.blockquoteLeftTitle) && <span>{data.blockquoteLeftTitle}</span>}
                    {blockquoteTags.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/20 px-3 py-1 text-[10px] text-white/80">
                        {tag}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {highlights.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-950">More details</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {highlights.map((item, index) => (
                      <div key={`${item.title}-${index}`} className="rounded-[20px] border border-[#ece7df] bg-[#fcfaf6] p-5">
                        {isFilledText(item.title) && <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>}
                        {isFilledText(item.point) && <p className="mt-2 text-sm leading-7 text-gray-600">{item.point}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {accordionItems.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-950">Frequently asked</h2>
                  <div className="space-y-3">
                    {accordionItems.map((item, index) => {
                      const isOpen = openAccordion === index;
                      return (
                        <div key={`${item.left}-${index}`} className="overflow-hidden rounded-[18px] border border-[#ece7df] bg-[#fcfaf6]">
                          <button
                            type="button"
                            onClick={() => setOpenAccordion(isOpen ? -1 : index)}
                            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                          >
                            <span className="text-sm font-semibold text-gray-900">{item.left || `Question ${index + 1}`}</span>
                            <ChevronDown className={`h-4 w-4 shrink-0 text-gray-500 transition ${isOpen ? "rotate-180" : ""}`} />
                          </button>
                          {isOpen && (
                            <div className="border-t border-[#ece7df] px-5 py-4 text-sm leading-7 text-gray-600">
                              {item.right || "No details added yet."}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </main>
              </>
            )}
          </div>
          <PopularDestinations />
        </div>
      </div>
    </div>
  );
};

export default WebPage;
