"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Star, SlidersHorizontal, ChevronDown, X, ArrowUpDown, Search, LayoutGrid, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

const CategoryClient = ({ packages, reviews = {}, menuItems = [], currentCategoryId = "" }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read query params
  const queryGuests = searchParams.get("guests") || "1";
  const queryCheckIn = searchParams.get("checkIn") || "";
  const queryCheckOut = searchParams.get("checkOut") || "";
  const queryYatraType = searchParams.get("yatraType") || "";
  const queryCategoryName = searchParams.get("category") || "";
  const querySubcategoryName = searchParams.get("subcategory") || "";

  // Filter states
  const [sortBy, setSortBy] = useState("recommended");
  const [priceRange, setPriceRange] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Category search states
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [guestCount, setGuestCount] = useState(parseInt(queryGuests) || 1);
  const [checkInDate, setCheckInDate] = useState(queryCheckIn);
  const [checkOutDate, setCheckOutDate] = useState(queryCheckOut);
  const [yatraType, setYatraType] = useState(queryYatraType);

  const yatraTypes = [
    { value: "Solo", label: "Solo" },
    { value: "Family", label: "Family" },
    { value: "Group", label: "Group" },
    { value: "Helicopter", label: "Helicopter" },
    { value: "Cruise", label: "Cruise" },
  ];

  // Main category options
  const mainCategoryOptions = useMemo(() => {
    return menuItems.filter((item) => item.active).map((item) => ({
      value: String(item._id),
      label: item.title,
    }));
  }, [menuItems]);

  // Sub category options based on selected main
  const subCategoryOptions = useMemo(() => {
    if (!selectedMainCategory) return [];
    const main = menuItems.find((item) => String(item._id) === selectedMainCategory);
    if (!main) return [];
    return (main.subMenu || [])
      .filter((sub) => sub.active !== false)
      .map((sub) => ({
        value: String(sub._id),
        label: sub.title,
        url: sub.url || "",
      }));
  }, [selectedMainCategory, menuItems]);

  // Reset sub when main changes
  useEffect(() => {
    setSelectedSubCategory("");
  }, [selectedMainCategory]);

  // Handle category search navigation
  const handleCategorySearch = () => {
    let targetUrl = "";
    let subLabel = "";

    if (selectedSubCategory) {
      const sub = subCategoryOptions.find((s) => s.value === selectedSubCategory);
      if (sub?.url) {
        targetUrl = sub.url;
        subLabel = sub.label;
      }
    }
    if (!targetUrl && subCategoryOptions.length > 0 && subCategoryOptions[0]?.url) {
      targetUrl = subCategoryOptions[0].url;
      subLabel = subCategoryOptions[0].label;
    }
    if (!targetUrl) return;

    // Get main category name
    const mainCat = mainCategoryOptions.find((opt) => opt.value === selectedMainCategory);

    const params = new URLSearchParams();
    if (guestCount > 1) params.set("guests", String(guestCount));
    if (checkInDate) params.set("checkIn", checkInDate);
    if (checkOutDate) params.set("checkOut", checkOutDate);
    if (yatraType) params.set("yatraType", yatraType);
    if (mainCat?.label) params.set("category", mainCat.label);
    if (subLabel) params.set("subcategory", subLabel);

    const qs = params.toString() ? `?${params.toString()}` : "";
    // Ensure /category/ prefix
    const path = targetUrl.startsWith("/category/") ? targetUrl : `/category/${targetUrl.replace(/^\//, "")}`;
    router.push(path + qs);
  };

  // Extract unique locations from packages
  const locations = useMemo(() => {
    const locs = [...new Set(packages.map((p) => p.basicDetails?.location).filter(Boolean))];
    return locs.sort();
  }, [packages]);

  // Extract unique durations
  const durations = useMemo(() => {
    const durs = [...new Set(packages.map((p) => p.basicDetails?.duration).filter(Boolean))];
    return durs.sort((a, b) => a - b);
  }, [packages]);

  // Filter and sort
  const filteredPackages = useMemo(() => {
    let result = [...packages];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.packageName?.toLowerCase().includes(q) || p.basicDetails?.location?.toLowerCase().includes(q)
      );
    }

    if (priceRange === "low") result = result.filter((p) => p.price > 0 && p.price <= 10000);
    else if (priceRange === "mid") result = result.filter((p) => p.price > 10000 && p.price <= 25000);
    else if (priceRange === "high") result = result.filter((p) => p.price > 25000);

    if (durationFilter !== "all") {
      const d = parseInt(durationFilter);
      result = result.filter((p) => p.basicDetails?.duration === d);
    }

    if (locationFilter !== "all") {
      result = result.filter((p) => p.basicDetails?.location === locationFilter);
    }

    if (sortBy === "price-low") result.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (sortBy === "price-high") result.sort((a, b) => (b.price || 0) - (a.price || 0));
    else if (sortBy === "duration") result.sort((a, b) => (a.basicDetails?.duration || 0) - (b.basicDetails?.duration || 0));
    else if (sortBy === "rating") {
      result.sort((a, b) => {
        const rA = reviews[a._id]?.avg || 0;
        const rB = reviews[b._id]?.avg || 0;
        return rB - rA;
      });
    }

    return result;
  }, [packages, sortBy, priceRange, durationFilter, locationFilter, searchQuery, reviews]);

  const activeFiltersCount = [priceRange !== "all", durationFilter !== "all", locationFilter !== "all", searchQuery.trim() !== ""].filter(Boolean).length;

  const clearFilters = () => {
    setSortBy("recommended");
    setPriceRange("all");
    setDurationFilter("all");
    setLocationFilter("all");
    setSearchQuery("");
  };

  const formatNumber = (number) => new Intl.NumberFormat("en-IN").format(number);
  return (
    <div className="container mx-auto px-2 md:px-4 py-3">
      {/* ===== Filter Bar ===== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        {/* Search Row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search packages by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <Button
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-full px-5"
            onClick={() => { }}
          >
            <SlidersHorizontal className="w-4 h-4 mr-1.5" />
            All Filters
            {activeFiltersCount > 0 && (
              <span className="ml-1.5 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>

        {/* Filter Chips Row */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Sort */}
          <FilterDropdown
            label={`Sort by: ${sortBy === "recommended" ? "Recommended" : sortBy === "price-low" ? "Price ↑" : sortBy === "price-high" ? "Price ↓" : sortBy === "duration" ? "Duration" : "Rating"}`}
            icon={<ArrowUpDown className="w-3.5 h-3.5" />}
          >
            {[
              { value: "recommended", label: "Recommended" },
              { value: "price-low", label: "Price: Low to High" },
              { value: "price-high", label: "Price: High to Low" },
              { value: "duration", label: "Duration" },
              { value: "rating", label: "Guest Rating" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-blue-50 ${sortBy === opt.value ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700"}`}
              >
                {opt.label}
              </button>
            ))}
          </FilterDropdown>

          {/* Price */}
          <FilterDropdown
            label="Price"
            active={priceRange !== "all"}
            icon={<span className="text-xs">₹</span>}
          >
            {[
              { value: "all", label: "All Prices" },
              { value: "low", label: "Under ₹10,000" },
              { value: "mid", label: "₹10,000 - ₹25,000" },
              { value: "high", label: "Above ₹25,000" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPriceRange(opt.value)}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-blue-50 ${priceRange === opt.value ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700"}`}
              >
                {opt.label}
              </button>
            ))}
          </FilterDropdown>

          {/* Duration */}
          <FilterDropdown
            label="Duration"
            active={durationFilter !== "all"}
            icon={<Calendar className="w-3.5 h-3.5" />}
          >
            <button
              onClick={() => setDurationFilter("all")}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-blue-50 ${durationFilter === "all" ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700"}`}
            >
              All Durations
            </button>
            {durations.map((d) => (
              <button
                key={d}
                onClick={() => setDurationFilter(String(d))}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-blue-50 ${durationFilter === String(d) ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700"}`}
              >
                {d} Days / {d - 1} Nights
              </button>
            ))}
          </FilterDropdown>

          {/* Location */}
          <FilterDropdown
            label="Location"
            active={locationFilter !== "all"}
            icon={<MapPin className="w-3.5 h-3.5" />}
          >
            <button
              onClick={() => setLocationFilter("all")}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-blue-50 ${locationFilter === "all" ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700"}`}
            >
              All Locations
            </button>
            {locations.map((loc) => (
              <button
                key={loc}
                onClick={() => setLocationFilter(loc)}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-blue-50 ${locationFilter === loc ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700"}`}
              >
                {loc}
              </button>
            ))}
          </FilterDropdown>

          {/* Clear */}
          {activeFiltersCount > 0 && (
            <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 ml-auto">
              <X className="w-3.5 h-3.5" /> Clear all
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4">
        Showing <span className="font-semibold text-gray-900">{filteredPackages.length}</span> of {packages.length} packages
      </p>

      {/* Package Cards Grid */}
      {filteredPackages.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-600">No packages match your filters</h3>
          <p className="mt-2 text-gray-500">Try adjusting your filters or search</p>
          <Button onClick={clearFilters} className="mt-4 bg-blue-600 hover:bg-blue-500">
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => {
            const r = reviews[pkg._id];
            const avgRating = r?.avg || 0;
            const totalReviews = r?.count || 0;
            return (
              <Link key={pkg._id} href={`/package/${pkg?.slug}`} className="group">
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
                  {/* Image */}
                  <div className="relative w-full h-52 overflow-hidden">
                    {pkg?.basicDetails?.thumbnail?.url ? (
                      <Image
                        src={pkg.basicDetails.thumbnail.url}
                        alt={pkg.packageName}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110 p-2"
                        quality={60}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
                    )}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                      ₹{pkg.price === 0 ? "XXXX*" : `${formatNumber(pkg.price)}*`}
                    </div>
                    <div className="absolute top-3 right-3 bg-blue-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {pkg.basicDetails?.duration}D / {(pkg.basicDetails?.duration || 1) - 1}N
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-base md:text-lg text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                      {pkg.packageName}
                    </h3>

                    <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{pkg.basicDetails?.location}</span>
                    </div>

                    <div className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4 flex-1">
                      <span dangerouslySetInnerHTML={{ __html: pkg.basicDetails?.smallDesc || "" }} />
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold">{avgRating.toFixed(1)}</span>
                        <span className="text-xs text-gray-400">({totalReviews})</span>
                      </div>
                      <span className="text-sm font-semibold text-blue-600 group-hover:underline">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Dropdown filter component
const FilterDropdown = ({ label, children, active, icon }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-full border transition-colors ${active ? "border-blue-600 bg-blue-50 text-blue-600 font-semibold" : "border-gray-300 text-gray-700 hover:border-gray-400"
          }`}
      >
        {icon}
        {label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px] max-h-60 overflow-y-auto py-1">
            <div onClick={() => setOpen(false)}>{children}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryClient;
