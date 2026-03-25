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
  const [locations, setLocations] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [trendingSearches, setTrendingSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [menuItems, setMenuItems] = useState([]);
  const [fixedMenuItems, setFixedMenuItems] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);

  // Reusable Number Input Component
  const NumberInput = ({ value, onChange, min = 1, max = 10, className = '' }) => {
    const increment = () => {
      if (value < max) onChange(value + 1);
    };

    const decrement = () => {
      if (value > min) onChange(value - 1);
    };

    return (
      <div className={`flex items-center border rounded-md overflow-hidden ${className}`}>
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

  // Memoize the property options to prevent unnecessary recalculations
  const propertyForOptions = React.useMemo(() =>
    fixedMenuItems.flatMap(category =>
      category.subCat?.map(subCategory => ({
        value: subCategory._id,
        label: subCategory.title,
        packages: subCategory.subCatPackage || []
      })) || []
    ), [fixedMenuItems]);

  // Update selected packages when category changes
  useEffect(() => {
    if (!propertyFor) {
      setSelectedPackages([]);
      return;
    }

    const selectedCategory = propertyForOptions.find(option => option.value === propertyFor);
    setSelectedPackages(selectedCategory?.packages || []);
  }, [propertyFor, propertyForOptions]);

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
        setFixedMenuItems(arr.filter(item => item.active));
      });
    fetchTrendingSearches();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!propertyFor || !propertyType) {
      toast.error('Please select Yatra Type and Package Type');
      return;
    }

    setIsLoading(true);

    try {
      const selectedCategory = propertyForOptions.find(opt => opt.value === propertyFor);
      const selectedPackage = selectedCategory?.packages.find(pkg => pkg.title === propertyType);

      if (selectedPackage?.url) {
        window.location.href = selectedPackage.url;
      } else {
        toast.error('No Package Found with this Yatra Type');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to navigate to package');
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
          <div className="mb-4">
            <h2 className="text-xl md:text-[1.65rem] font-bold text-gray-900 leading-tight">
              Biggest discounts on Hotels <span className="text-gray-500 font-normal">+ DHAM YATRA</span>
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
                  {/* Search Bar Header */}
                  <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-3 mb-5 bg-gray-50/60 hover:border-orange-300 transition-colors">
                    <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                    <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">Search Package:</span>
                    <span className="text-sm text-gray-700 font-medium">Sacred India - One Journey, Infinite Blessings.</span>
                    <ChevronDown className="h-4 w-4 text-gray-400 ml-auto shrink-0" />
                  </div>

                  {/* Filter Row 1: Yatra Type, Category, Guests */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Yatra Type */}
                    <div className="space-y-1.5">
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

                    {/* Category */}
                    <div className="space-y-1.5">
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
                          {propertyForOptions.length > 0 ? (
                            propertyForOptions.map((option, index) => (
                              <SelectItem key={`cat-${index}`} value={option.value || 'all'}>
                                {option.label || 'Loading...'}
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
                  </div>

                  {/* Filter Row 2: Package, Check-in, Check-out, Search CTA */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
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
                          <Search className="h-4 w-4" /> Search hotels
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
                          <Link href={`/package/${property._id}`}>
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

        {/* ===== RIGHT: Offer Cards (25%) ===== */}
        <div className="w-full lg:w-[25%] flex flex-row lg:flex-col gap-4">
          {/* Card 1: Luxury Hotel Offer */}
          <div className="flex-1 rounded-xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.08)] border border-gray-100 group cursor-pointer hover:shadow-xl transition-shadow duration-300">
            <div className="relative w-full h-full min-h-[270px]">
              <Image
                src="/luxury-hotel-card.png"
                alt="Luxury Hotels at Low Price - 5 Star Hotels Starting ₹2,999"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="inline-block bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-1.5">
                  Luxury at Low Price
                </span>
                <p className="text-white text-sm font-semibold drop-shadow-lg">
                  5 Star Hotels Starting <span className="text-yellow-300">₹2,999</span>
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Last Minute Deals */}
          <div className="flex-1 rounded-xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.08)] border border-gray-100 bg-white p-4 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-gray-800">More offers</h4>
                <Link href="/packages" className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline">
                  View all
                </Link>
              </div>
              <div className="border-t border-gray-100 pt-3">
                <h5 className="text-base font-bold text-gray-900 mb-1.5">Last Minute Deals!</h5>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Upto 40% off on Hotels for check-ins today & tomorrow
                </p>
              </div>
            </div>
            <Link
              href="/packages"
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