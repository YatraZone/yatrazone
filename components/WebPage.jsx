"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
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
import toast from "react-hot-toast";

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
      className={`prose prose-sm max-w-none  leading-7 font-geist font-bold ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

const StaticSidebarCard = ({ data }) => {
  const adImage = data.advertisementImage?.url;
  const adUrl = data.advertisementUrl;

  if (adImage) {
    const card = (
      <div className="overflow-hidden h-[250px] bg-white">
        <img src={adImage} alt={data.title || "Advertisement"} className="h-full w-full object-contain" />
      </div>
    );

    if (adUrl) {
      return (
        <a href={adUrl} target="_blank" rel="noreferrer" className="block transition hover:opacity-95">
          {card}
        </a>
      );
    }

    return card;
  }

};

const AuthorCard = ({ data }) => {
  const authorName = data.sideThumbName || "";
  const authorRole = data.sideThumbDesignation || "";
  const authorDescription = data.sideThumbDescription || "";
  const authorImage = data.sideThumbImage?.url || data.mainProfileImage?.url || data.bannerImage?.url;
  const socials = [
    data.facebookUrl ? { href: data.facebookUrl, label: "Facebook", icon: Facebook } : null,
    data.instaUrl ? { href: data.instaUrl, label: "Instagram", icon: Instagram } : null,
    data.youtubeUrl ? { href: data.youtubeUrl, label: "Website", icon: Globe } : null,
    data.googleUrl ? { href: data.googleUrl, label: "LinkedIn", icon: Linkedin } : null,
  ].filter(Boolean);

  return (
    <div className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
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
        {authorDescription}
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

  const sharePage = async () => {
    if (!shareUrl) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "YatraZone Webpage",
          url: shareUrl,
        });
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied for sharing");
    } catch (error) {
      if (error?.name !== "AbortError") {
        toast.error("Unable to share this page");
      }
    }
  };

  const copyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="rounded-md border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-gray-900">Share this package</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <button
          onClick={sharePage}
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700"
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>
        <button
          onClick={copyLink}
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-2 py-3 text-sm font-medium text-gray-700"
        >
          <LinkIcon className="h-4 w-4" />
          Copy Link
        </button>
      </div>
    </div>
  );
};

// const SocialRail = ({ data }) => {
//   const items = [
//     data.facebookUrl ? { href: data.facebookUrl, label: "Facebook", icon: Facebook } : null,
//     data.instaUrl ? { href: data.instaUrl, label: "Instagram", icon: Instagram } : null,
//     data.googleUrl ? { href: data.googleUrl, label: "LinkedIn", icon: Linkedin } : null,
//   ].filter(Boolean);

//   return (
//     <div className="flex flex-col items-center gap-4 text-gray-500">
//       <div className="rounded-full border border-gray-500 bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em]">
//         {formatDate(data.updatedAt || data.createdAt) || "2 Min Read"}
//       </div>
//       {/* <div className="h-12 w-px bg-gray-200" /> */}
//       {items.length > 0 ? (
//         items.map(({ href, label, icon: Icon }) => (
//           <a
//             key={label}
//             href={href}
//             target="_blank"
//             rel="noreferrer"
//             className="transition hover:text-gray-900"
//             aria-label={label}
//           >
//             <Icon className="h-4 w-4" />
//           </a>
//         ))
//       ) : (
//         <>

//         </>
//       )}
//     </div>
//   );
// };

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
    <section className="w-full border-t border-[#ece7df] bg-white px-2 py-10 md:px-20">
      <h2 className="font-recoleta text-2xl font-bold text-gray-900 md:text-3xl">
        Your style. These stays. A perfect match.
      </h2>
      <p className="mb-5 mt-1 font-sans text-sm text-gray-500">
        Handpicked Popular Destination curated just for you
      </p>

      <div className="mb-6 flex gap-5 overflow-x-auto border-b border-gray-200">
        <button
          onClick={() => setActiveCategory("All")}
          className={`whitespace-nowrap border-b-2 pb-2.5 px-1 text-sm font-medium transition-colors ${activeCategory === "All"
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
            className={`whitespace-nowrap border-b-2 pb-2.5 px-1 text-sm font-medium transition-colors ${activeCategory === cat.name
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
              <CarouselItem key={hotel._id} className="pl-3 md:basis-1/4">
                <Link
                  href={hotel.imageClickLink || "#"}
                  target={hotel.imageClickLink ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="group block cursor-pointer"
                >
                  <div className="relative mb-3 md:h-60 h-80 w-full overflow-hidden rounded-xl">
                    {hotel.image?.url ? (
                      <img
                        src={hotel.image.url}
                        alt={hotel.name}
                        className="h-full w-full object-contain md:object-contain transition-transform duration-500 group-hover:scale-110"
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
  console.log(data)
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
  const hasTopMetaContent =
    isFilledText(data.firstTitle) ||
    isFilledText(data.secondTitle) ||
    tags.length > 0;
  const hasMainTopImage = !!data.imageFirst?.url;
  const hasTopHeaderContent = hasTopMetaContent || hasMainTopImage;
  const isBannerOnlyTop = !isDesignThree && !!data.bannerImage?.url && !hasTopHeaderContent;
  const headerImage = data.imageFirst?.url || paragraphImages[0] || data.sideThumbImage?.url;
  const leadParagraph = isDesignTwo ? paragraphs[0] : null;
  const contentParagraphs = isDesignTwo ? paragraphs.slice(1) : paragraphs;
  const designOneLeadParagraph = !isDesignTwo && !isDesignThree ? paragraphs[0] : null;
  const designOneRemainingParagraphs = !isDesignTwo && !isDesignThree ? paragraphs.slice(1) : contentParagraphs;
  const designThreeHeroImages = [
    data.imageFirst?.url,
    data.mainProfileImage?.url,
    data.bannerImage?.url,
    ...(data.imageGallery || []).map((item) => item?.url).filter(Boolean),
  ].filter(Boolean).slice(0, 3);
  const introHighlight = isDesignThree ? highlights[0] : null;
  const remainingHighlights = isDesignThree ? highlights.slice(1) : highlights;

  return (
    <div className="min-h-screen bg-white font-recoleta text-gray-900 ">
      <div className={`w-full border-b border-[#ece7df] ${!isDesignThree ? "bg-[#efefef]" : "bg-[#f7f3ed]"}`}>
        <div className="mx-auto max-w-7xl md:px-4 md:py-2 sm:px-6 lg:px-12">
          {!isDesignThree && (
            <div className="flex items-center justify-between py-6 text-gray-600">

              {/* <span className="w-[120px] md:w-[180px]" /> */}
            </div>
          )}
          <div className={`grid gap-2 ${isDesignThree ? "grid-cols-1" : isBannerOnlyTop ? "grid-cols-1" : "lg:grid-cols-[520px_minmax(0,1fr)] lg:items-center"}`}>
            {isDesignThree ? (
              <div className="flex items-center gap-2">
                {designThreeHeroImages[0] && (
                  <img src={designThreeHeroImages[0]} alt={data.title} className="md:h-[300px] w-full object-contain" />
                )}
              </div>
            ) : isBannerOnlyTop ? (
              <div className="overflow-hidden rounded-md">
                <img src={data.bannerImage.url} alt={data.title} className="h-[240px] md:h-[360px] w-full object-cover" />
              </div>
            ) : (
              <div className="overflow-hidden">
                {headerImage && (
                  <img src={headerImage} alt={data.title} className="h-[220px] w-full object-contain md:h-[250px]" />
                )}
              </div>
            )}
            {!isDesignThree && (
              <div>
                {isFilledText(data.firstTitle) && (
                  <span className="hidden text-md my-5 font-medium text-gray-600 md:block">{data.firstTitle}</span>
                )}
                <h1 className="max-w-4xl text-2xl font-geist font-semibold leading-[1.05] tracking-tight text-black sm:text-5xl">
                  {data.title}
                </h1>
                {isFilledText(data.secondTitle) && (
                  <p className="mt-4 max-w-3xl text-md leading-8 text-gray-700">{data.secondTitle}</p>
                )}
                {tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tags.map((tag, idx) => (
                      <span
                        key={tag + idx}
                        className="rounded-md border border-[#d4d4d4] bg-[#efefef] px-2 py-2 text-md font-medium text-black"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-7 flex flex-wrap items-center gap-4 text-md text-black">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8e4ff] text-sm font-bold text-[#4f46e5]">
                      {(data.sideThumbName || "E").charAt(0)}
                    </span>
                    <span>{data.sideThumbName || "Editorial Team"}</span>
                  </div>
                  <span className="h-10 w-px bg-gray-400" />
                  <span>{formatDate(data.updatedAt || data.createdAt) || ""}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
        <div className=" bg-white">
          {isDesignThree && (
            <section className="grid gap-6 py-4 md:px-5 md:py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">{data.title}</h1>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <span>{data.postedBy?.admin ? "By Admin" : data.sideThumbName || "Editorial Team"}</span>
                  <span className="h-1 w-1 rounded-full bg-gray-300" />
                  <span>{formatDate(data.updatedAt || data.createdAt) || ""}</span>
                </div>
                {tags.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {tags.map((tag, idx) => (
                      <span
                        key={tag + idx}
                        className="rounded-full border border-[#e3dbe8] bg-[#faf7ff] px-3 py-1 text-xs font-semibold text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="lg:justify-self-end">
                <ShareCard slug={data.slug} />
              </div>
            </section>
          )}

          {designOneLeadParagraph && (
            <section className="space-y-5 md:px-5 py-4 md:py-8 sm:px-8">
              {isFilledText(designOneLeadParagraph.title) && (
                <h2 className="text-3xl font-bold leading-tight text-gray-950">{designOneLeadParagraph.title}</h2>
              )}
              <HtmlBlock html={designOneLeadParagraph.description} />
              {paragraphImages.length > 0 && (
                <div className="space-y-4">
                  {paragraphImages.map((image, imageIndex) => (
                    <div key={`${image}-${imageIndex}`} className="overflow-hidden rounded-md bg-[#f8f5ef]">
                      <img
                        src={image}
                        alt={designOneLeadParagraph.title || `Section image ${imageIndex + 1}`}
                        className="md:h-[260px] w-full object-contain md:object-cover sm:h-[360px]"
                      />
                    </div>
                  ))}
                </div>
              )}
              {/* Bullet Points Section */}
              {designOneLeadParagraph.bulletPoints && designOneLeadParagraph.bulletPoints.length > 0 && designOneLeadParagraph.bulletPoints.some(point => isFilledText(point)) && (
                <div className="space-y-3 mt-4">
                  {designOneLeadParagraph.bulletPoints.map((point, bulletIdx) => (
                    isFilledText(point) && (
                      <div key={bulletIdx} className="flex gap-3">
                        <span className="h-2 w-2 rounded-full bg-[#6156b0] mt-2 flex-shrink-0" />
                        <p className="text-md leading-6 text-gray-600">{point}</p>
                      </div>
                    )
                  ))}
                </div>
              )}
            </section>
          )}

          <div className={`grid gap-10 md:p-5 sm:px-8 ${isDesignThree ? "grid-cols-1" : isDesignTwo ? "lg:grid-cols-[330px_minmax(0,1fr)] lg:items-start" : "lg:grid-cols-[400px_1fr]"}`}>
            {isDesignThree ? (
              <>
                <main className="space-y-10">
                  {contentParagraphs.length > 0 &&
                    contentParagraphs.map((section, index) => (
                      <section key={`${section.title}-${index}`} className="space-y-3">
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
                                  className="h-[180px] w-full object-cover sm:h-[300px]"
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
                      <div className="overflow-hidden rounded-[8px] bg-white">
                        <table className="w-full text-left text-sm">
                          <tbody>
                            {tableRows.map((row, index) => (
                              <tr key={`${row.column1}-${row.column2}-${index}`} className="border-b border-[#ece7df] last:border-b-0">
                                <td className="w-1/2 px-4 py-3 font-medium text-gray-700 border-b border-r border-black">{row.column1 || "-"}</td>
                                <td className="w-1/2 px-4 py-3 text-gray-600 border-b border-black">{row.column2 || "-"}</td>
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
                    <section className="space-y-5">
                      {introHighlight && (
                        <div className="rounded-md border border-[#e6dccf] bg-[#f4ede3] px-5 py-6 shadow-sm">
                          {isFilledText(introHighlight.title) && (
                            <h2 className="text-2xl font-bold leading-tight text-gray-950">{introHighlight.title}</h2>
                          )}
                          {isFilledText(introHighlight.point) && (
                            <p className="mt-3 max-w-3xl text-base leading-7 text-gray-600">{introHighlight.point}</p>
                          )}
                        </div>
                      )}
                      <div className="grid gap-4">
                        {remainingHighlights.map((item, index) => (
                          <div
                            key={`${item.title}-${index}`}
                            className="rounded-md border border-gray-200 bg-white px-5 py-5 shadow-sm"
                          >
                            {isFilledText(item.title) && (
                              <h3 className="text-xl font-bold leading-tight text-gray-950">{item.title}</h3>
                            )}
                            {isFilledText(item.point) && (
                              <p className="mt-2 text-sm leading-7 text-gray-600">{item.point}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </main>
              </>
            ) : (
              <>
                <aside className="space-y-5">
                  <StaticSidebarCard data={data} />
                  <AuthorCard data={data} />
                  <ShareCard slug={data.slug} />
                </aside>

                <main className="space-y-10">
                  {isDesignTwo && leadParagraph && (
                    <section className="space-y-5">
                      {isFilledText(leadParagraph.description) && (
                        <HtmlBlock html={leadParagraph.description} className="max-w-none text-left" />
                      )}
                      {isFilledText(leadParagraph.title) && (
                        <h2 className="text-4xl font-bold leading-tight text-gray-950">{leadParagraph.title}</h2>
                      )}

                      {/* Bullet Points Section */}
                      {/* {leadParagraph.bulletPoints && leadParagraph.bulletPoints.length > 0 && leadParagraph.bulletPoints.some(point => isFilledText(point)) && (
                        <div className="space-y-3 mt-4">
                          {leadParagraph.bulletPoints.map((point, bulletIdx) => (
                            isFilledText(point) && (
                              <div key={bulletIdx} className="flex gap-3">
                                <span className="h-2 w-2 rounded-full bg-[#6156b0] mt-2 flex-shrink-0" />
                                <p className="text-sm leading-6 text-gray-600">{point}</p>
                              </div>
                            )
                          ))}
                        </div>
                      )} */}

                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        <span>{data.postedBy?.admin ? "By Admin" : data.sideThumbName || "Editorial Team"}</span>
                        <span className="h-1 w-1 rounded-full bg-gray-300" />
                        <span>{formatDate(data.updatedAt || data.createdAt) || ""}</span>
                      </div>
                      {paragraphImages.length > 0 && (
                        <div className={`grid gap-4 ${paragraphImages.length > 1 ? "sm:grid-cols-[2fr_1fr]" : "grid-cols-1"}`}>
                          {paragraphImages.map((image, index) => (
                            <div key={`${image}-${index}`} className="overflow-hidden rounded-md bg-[#f8f5ef]">
                              <img
                                src={image}
                                alt={leadParagraph.title || `Lead image ${index + 1}`}
                                className="h-[220px] w-full object-cover sm:h-[260px]"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </section>
                  )}

                  {(isDesignTwo ? contentParagraphs : designOneRemainingParagraphs).length > 0 &&
                    (isDesignTwo ? contentParagraphs : designOneRemainingParagraphs).map((section, index) => (
                      <section key={`${section.title}-${index}`} className="space-y-5">
                        {isFilledText(section.title) && (
                          <h2 className={`${isDesignTwo ? "text-2xl" : "text-3xl"} font-bold leading-tight text-gray-950`}>
                            {section.title}
                          </h2>
                        )}
                        <HtmlBlock html={section.description} />

                        {/* Bullet Points Section */}
                        {/* {section.bulletPoints && section.bulletPoints.length > 0 && section.bulletPoints.some(point => isFilledText(point)) && (
                          <div className="space-y-3 mt-4">
                            {section.bulletPoints.map((point, bulletIdx) => (
                              isFilledText(point) && (
                                <div key={bulletIdx} className="flex gap-3">
                                  <span className="h-2 w-2 rounded-full bg-[#6156b0] mt-2 flex-shrink-0" />
                                  <p className="text-sm leading-6 text-gray-600">{point}</p>
                                </div>
                              )
                            ))}
                          </div>
                        )} */}
                      </section>
                    ))}

                  {tableRows.length > 0 && (
                    <section className="space-y-4">
                      <h2 className="text-2xl font-bold text-gray-950">{data.tableTitle || "Table Information"}</h2>
                      <div className="overflow-hidden  border-[#ddd5ca] bg-white">
                        <table className="w-full text-left text-sm">
                          <tbody>
                            {tableRows.map((row, index) => (
                              <tr key={`${row.column1}-${row.column2}-${index}`} className="border-b border-[#ece7df] last:border-b-0">
                                <td className="w-1/2 px-4 py-3 font-medium text-gray-700 border-r border-b border-gray-400">{row.column1 || "-"}</td>
                                <td className="w-1/2 px-4 py-3 text-gray-600 border-b border-gray-400">{row.column2 || "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  )}


                  {(isFilledText(data.blockquoteDescription) || isFilledText(data.blockquoteMainTitle)) && (
                    <section className={`rounded bg-gray-100 px-2 gap-2 flex flex-col py-5 text-black ${isDesignTwo ? "max-w-3xl" : ""}`}>
                      <div className={`rounded-[24px] bg-[linear-gradient(135deg,#3f3a7a,#4c4489,#6156b0)] px-6 py-7 text-white shadow-[0_25px_60px_rgba(79,70,229,0.2)]`}>

                        <Quote className="h-7 w-7 text-white/80" />
                        {isFilledText(data.blockquoteMainTitle) && (
                          <h2 className="mt-3 text-2xl font-bold leading-tight mb-2">{data.blockquoteMainTitle}</h2>
                        )}
                        {isFilledText(data.blockquoteLeftTitle) && <span>{data.blockquoteLeftTitle}</span>}
                      </div>
                      <div className="px-2">
                        <div className="my-4 text-black">
                          <HtmlBlock html={data.blockquoteDescription} className="!text-black" />
                        </div>
                        {blockquoteTags.map((tag) => (
                          <span key={tag} className="rounded-md mx-1 w-fit border border-gray-500 px-3 py-2 text-[12px] text-black">
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
                          <div key={`${item.title}-${index}`} className="rounded-md border border-[#ece7df] bg-[#fcfaf6] p-5">
                            {isFilledText(item.title) && <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>}
                            {isFilledText(item.point) && <p className="mt-2 text-sm leading-7 text-gray-600">{item.point}</p>}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Bullet Points Section */}
                  {/* {section.bulletPoints && section.bulletPoints.length > 0 && section.bulletPoints.some(point => isFilledText(point)) && (
                    <div className="space-y-3 mt-4">
                      {section.bulletPoints.map((point, bulletIdx) => (
                        isFilledText(point) && (
                          <div key={bulletIdx} className="flex gap-3">
                            <span className="h-2 w-2 rounded-full bg-[#6156b0] mt-2 flex-shrink-0" />
                            <p className="text-sm leading-6 text-gray-600">{point}</p>
                          </div>
                        )
                      ))}
                    </div>
                  )} */}

                  {accordionItems.length > 0 && (
                    <section className="space-y-6">
                      <h2 className="text-3xl font-bold text-gray-950">Frequently asked</h2>
                      <div className="space-y-2.5">
                        {accordionItems.map((item, index) => {
                          const isOpen = openAccordion === index;
                          return (
                            <div
                              key={`${item.left}-${index}`}
                              className={`overflow-hidden rounded-lg border transition-all duration-300 ${isOpen
                                ? "border-[#6156b0] bg-gradient-to-br from-[#f9f8fd] to-[#fcfaf6]"
                                : "border-[#e6dccf] bg-white"
                                }`}
                              style={{
                                transformOrigin: "top",
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => setOpenAccordion(isOpen ? -1 : index)}
                                className={`flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-all duration-300 ${isOpen
                                  ? "bg-gradient-to-r from-[#6156b0]/5 to-transparent"
                                  : "hover:bg-[#faf8f5]"
                                  }`}
                              >
                                <span className={`font-semibold transition-colors duration-300 ${isOpen ? "text-[#6156b0]" : "text-gray-900 group-hover:text-gray-950"}`}>
                                  {item.left || `Question ${index + 1}`}
                                </span>
                                <ChevronDown
                                  className={`h-5 w-5 shrink-0 transition-all duration-500 ${isOpen ? "rotate-180 text-[#6156b0]" : "text-gray-500"
                                    }`}
                                />
                              </button>
                              {isOpen && (
                                <div
                                  className="border-t border-[#e6dccf] px-6 py-5 text-sm leading-7 text-gray-700 animate-in fade-in duration-300"
                                  style={{
                                    animation: "fadeIn 0.4s ease"
                                  }}
                                >
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
