"use client"
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Star, MapPin, LayoutGrid, Users, Calendar, ChevronDown, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import Link from 'next/link';
import Image from 'next/image';

const SearchSection = () => {
  const [activeTab, setActiveTab] = useState('property');
  const [location, setLocation] = useState('');
  const [propertyFor, setPropertyFor] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [trendingSearches, setTrendingSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [menuItems, setMenuItems] = useState([]);
  const [fixedMenuItems, setFixedMenuItems] = useState([]);
  const [filterBanners, setFilterBanners] = useState([]);
  const [offerDetails, setOfferDetails] = useState(null);

  // Reusable Number Input Component
  const NumberInput = ({ value, onChange, min = 1, max = 10, className = '' }) => {
    const increment = () => {
      if (value < max) onChange(value + 1);
    };

    const decrement = () => {
      if (value > min) onChange(value - 1);
    };

    return (
      <div className={`flex items-center border w-fit rounded-md overflow-hidden ${className}`}>
        <button
          type="button"
          onClick={decrement}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 focus:outline-none"
          disabled={value <= min}
        >
          -
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => {
            const val = parseInt(e.target.value) || min;
            onChange(Math.min(Math.max(val, min), max));
          }}
          min={min}
          max={max}
          className="w-14 text-center border-0 focus:ring-0"
        />
        <button
          type="button"
          onClick={increment}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 focus:outline-none"
          disabled={value >= max}
        >
          +
        </button>
      </div>
    );
  };

  // Main category options (top-level menu items)
  const mainCategoryOptions = React.useMemo(() => {
    return menuItems
      .filter(item => item.active)
      .map(item => ({
        value: String(item._id),
        label: item.title,
      }));
  }, [menuItems]);

  // Subcategory options based on selected main category
  const subCategoryOptions = React.useMemo(() => {
    if (!propertyFor) return [];
    const selectedMain = menuItems.find(item => String(item._id) === propertyFor);
    if (!selectedMain) return [];
    return (selectedMain.subMenu || [])
      .filter(sub => sub.active !== false)
      .map(sub => ({
        value: String(sub._id),
        label: sub.title,
        url: sub.url || '',
      }));
  }, [propertyFor, menuItems]);

  // Reset subcategory when main category changes
  useEffect(() => {
    setPropertyType('');
  }, [propertyFor]);

  const yatraType = [
    { value: 'Solo', label: 'Solo' },
    { value: 'Family', label: 'Family' },
    { value: 'Group', label: 'Group' },
    { value: 'Helicopter', label: 'Helicopter' },
    { value: 'Cruise', label: 'Cruise' }
  ];

  const fetchTrendingSearches = async () => {
    try {
      const locResponse = await fetch("/api/getTrendingPackages");
      if (!locResponse.ok) {
        throw new Error(`HTTP error! status: ${locResponse.status}`);
      }
      const locData = await locResponse.json();
      if (Array.isArray(locData)) {
        setTrendingSearches(locData);
      } else if (locData && locData.success && Array.isArray(locData.data)) {
        setTrendingSearches(locData.data);
      } else {
        console.error("Unexpected location types response format:", locData);
      }
    } catch (error) {
      console.error("Error fetching location types:", error);
      toast.error("Failed to load location types");
    }
  };

  useEffect(() => {
    fetch("/api/getAllMenuItems")
      .then((res) => res.json())
      .then((data) => setMenuItems(data));
    fetch("/api/subMenuFixed")
      .then(res => res.json())
      .then(data => {
        let arr = Array.isArray(data) ? data : (Array.isArray(data.packages) ? data.packages : []);
        // console.log("subMenuFixed raw data:", arr);
        setFixedMenuItems(arr.filter(item => item.active));
      })
      .catch(err => console.error("Failed to fetch subMenuFixed:", err));
    fetchTrendingSearches();
    fetch("/api/filterBanner")
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setFilterBanners(data); })
      .catch(() => {});
    fetch("/api/offerDetails")
      .then(res => res.json())
      .then(data => { if (data) setOfferDetails(data); })
      .catch(() => {});
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!propertyFor) {
      toast.error('Please select a Category');
      return;
    }

    setIsLoading(true);

    try {
      // Get main category name
      const mainCat = mainCategoryOptions.find(opt => opt.value === propertyFor);

      // Build query params
      const params = new URLSearchParams();
      if (guestCount > 1) params.set('guests', guestCount);
      if (checkInDate) params.set('checkIn', checkInDate);
      if (checkOutDate) params.set('checkOut', checkOutDate);
      if (location) params.set('yatraType', location);
      if (mainCat?.label) params.set('category', mainCat.label);

      // Helper to build final URL with /category/ prefix
      const buildUrl = (rawUrl, subLabel) => {
        if (subLabel) params.set('subcategory', subLabel);
        const qs = params.toString() ? `?${params.toString()}` : '';
        // Ensure /category/ prefix
        const path = rawUrl.startsWith('/category/') ? rawUrl : `/category/${rawUrl.replace(/^\//, '')}`;
        return path + qs;
      };

      // If subcategory selected, navigate to its URL
      if (propertyType) {
        const selectedSub = subCategoryOptions.find(opt => opt.value === propertyType);
        if (selectedSub?.url) {
          window.location.href = buildUrl(selectedSub.url, selectedSub.label);
          return;
        }
      }
      // Fallback: navigate to first subcategory URL of the main category
      if (subCategoryOptions.length > 0 && subCategoryOptions[0].url) {
        window.location.href = buildUrl(subCategoryOptions[0].url, subCategoryOptions[0].label);
      } else {
        toast.error('No packages found for this category');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to navigate');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('location')) setLocation(params.get('location'));
    if (params.get('category')) setPropertyFor(params.get('category'));
    if (params.get('subcategory')) setPropertyType(params.get('subcategory'));
    if (params.get('checkInDate')) setCheckInDate(params.get('checkInDate'));
    if (params.get('guests')) setGuestCount(parseInt(params.get('guests')));
  }, []);
  return (
    <section className="w-full md:w-[90%] mx-auto md:my-8">
      <div className="flex flex-col lg:flex-row gap-5">

        {/* ===== LEFT: Search Section (75%) ===== */}
        <div className="w-full lg:w-[75%]">
          {/* Heading */}
          <div className="mb-4 px-10 md:px-5">
            <h2 className="text-xl md:text-[1.65rem] font-bold text-gray-900 leading-tight">
              Biggest discounts on Dham<span className="text-gray-500 font-normal">+Yatra Packages</span>
            </h2>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              30-80% off | 5-star stays from <span className="font-semibold text-gray-700">₹2999</span>
            </p>
          </div>

          {/* Search Card */}
          <div className="bg-white rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] border border-gray-100 p-5 md:p-6">
            <Tabs
              defaultValue="property"
              className="w-full"
              onValueChange={setActiveTab}
            >
              <TabsContent value="property">
                <form onSubmit={handleSearch}>
                  <div className="flex-col md:flex-row flex items-center gap-2 w-full mb-3">
                    {/* Yatra Type */}
                    <div className="space-y-1.5 w-full">
                      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        <LayoutGrid className="h-3.5 w-3.5" />
                        Yatra Type
                      </label>
                      <Select
                        value={location}
                        onValueChange={(value) => setLocation(value)}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="w-full h-10 border-gray-200 rounded-lg text-sm">
                          <SelectValue placeholder="Select Yatra Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {yatraType.map((loc, index) => (
                            <SelectItem key={`loc-${index}`} value={loc.value}>
                              {loc.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Category (Main) */}
                    <div className="space-y-1.5 w-full">
                      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        <LayoutGrid className="h-3.5 w-3.5" />
                        Category
                      </label>
                      <Select
                        value={propertyFor}
                        onValueChange={(value) => setPropertyFor(value)}
                      >
                        <SelectTrigger className="w-full h-10 border-gray-200 rounded-lg text-sm">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {mainCategoryOptions.length > 0 ? (
                            mainCategoryOptions.map((option, index) => (
                              <SelectItem key={`cat-${index}`} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="loading" disabled>
                              Loading categories...
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Subcategory */}
                    <div className="space-y-1.5 w-full">
                      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        <LayoutGrid className="h-3.5 w-3.5" />
                        Subcategory
                      </label>
                      <Select
                        value={propertyType}
                        onValueChange={(value) => setPropertyType(value)}
                        disabled={!propertyFor}
                      >
                        <SelectTrigger className="w-full h-10 border-gray-200 rounded-lg text-sm">
                          <SelectValue placeholder={propertyFor ? "Select Subcategory" : "Select a category first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {subCategoryOptions.length > 0 ? (
                            subCategoryOptions.map((option, index) => (
                              <SelectItem key={`sub-${index}`} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>
                              No subcategories available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Filter Row 2: Package, Check-in, Check-out, Search CTA */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    {/* Guests */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        <Users className="h-3.5 w-3.5" />
                        1 Room, {guestCount} {guestCount === 1 ? 'Adult' : 'Adults'}
                      </label>
                      <NumberInput
                        value={guestCount}
                        onChange={setGuestCount}
                        min={1}
                        max={20}
                        className="h-10 rounded-lg"
                      />
                    </div>
                    {/* Check-in Date */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        <Calendar className="h-3.5 w-3.5" />
                        Check In
                      </label>
                      <Input
                        type="date"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="h-10 border-gray-200 rounded-lg text-sm"
                      />
                    </div>

                    {/* Check-out Date */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        <Calendar className="h-3.5 w-3.5" />
                        Check Out
                      </label>
                      <Input
                        type="date"
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        className="h-10 border-gray-200 rounded-lg text-sm"
                      />
                    </div>

                    {/* Search Button */}
                    <Button
                      type="submit"
                      className="h-10 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-md text-sm font-semibold shadow-lg shadow-orange-200/60 transition-all duration-200 hover:shadow-xl hover:shadow-orange-300/50 hover:scale-[1.02] active:scale-[0.98]"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Searching...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <Search className="h-4 w-4" /> Search Packages
                        </span>
                      )}
                    </Button>
                  </div>
                </form>

                {/* Trending Section */}
                {trendingSearches.length > 0 && (
                  <div className="mt-6 pt-5 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-gray-700 mb-3">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <h3 className="text-sm font-semibold">Trending Divine India</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trendingSearches.map((property, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="rounded-full px-3.5 py-1 text-xs h-auto hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border-gray-200 text-gray-600 transition-colors"
                          asChild
                        >
                          <Link href={`/package/${property?.slug}`}>
                            {property.packageName}
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* ===== RIGHT: Filter Banner Cards (25%) ===== */}
        <div className="w-full lg:w-[25%] px-2 flex-col md:flex-row flex lg:flex-col gap-4">
          {filterBanners.length > 0 && (
            filterBanners.map((banner, idx) => (
              <Link
                key={banner._id || idx}
                href={banner.buttonLink || '#'}
                className="flex-1 rounded-xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.08)] border border-gray-100 group cursor-pointer hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative w-full h-full min-h-[270px]">
                  <Image
                    src={banner.image?.url || '/placeholder.png'}
                    alt="Filter Banner"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </Link>
            ))
          )}
          <div className="flex-1 rounded-xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.08)] border border-gray-100 bg-white p-4 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-gray-800">{offerDetails?.moreOffers?.title || 'More offers'}</h4>
                {/* <Link href={offerDetails?.moreOffers?.knowMoreLink || ''} className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline">
                  View all
                </Link> */}
              </div>
              <div className="border-t border-gray-100 pt-3">
                <p className="text-sm text-gray-500 leading-relaxed">
                  {offerDetails?.moreOffers?.description || 'Upto 40% off on Hotels for check-ins today & tomorrow'}
                </p>
              </div>
            </div>
            <Link
              href={offerDetails?.moreOffers?.knowMoreLink || ''}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 mt-3 group/link"
            >
              Know more
              <ArrowRight className="h-3 w-3 group-hover/link:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SearchSection;