"use client"
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Home, Hotel, Navigation, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import Link from 'next/link';

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
  const [guestCount, setGuestCount] = useState(1);
  const [menuItems, setMenuItems] = useState([]);
  const [fixedMenuItems, setFixedMenuItems] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);
  // console.log(menuItems)
  // console.log(fixedMenuItems)
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

  // console.log(trendingSearches)
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

  ]
  const fetchTrendingSearches = async () => {
    try {
      const locResponse = await fetch("/api/getTrendingPackages");
      if (!locResponse.ok) {
        throw new Error(`HTTP error! status: ${locResponse.status}`);
      }
      const locData = await locResponse.json();
      // console.log(locData)
      // Handle both response formats
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
  }
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

    // Validate inputs first
    if (!propertyFor || !propertyType) {
      toast.error('Please select Yatra Type and Package Type');
      return; // Exit early if validation fails
    }

    setIsLoading(true); // Set loading state only after validation passes

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
  // Add useEffect to handle initial load with URL params
  useEffect(() => {
    // Parse URL params on component mount
    const params = new URLSearchParams(window.location.search);
    if (params.get('location')) setLocation(params.get('location'));
    if (params.get('category')) setPropertyFor(params.get('category'));
    if (params.get('subcategory')) setPropertyType(params.get('subcategory'));
    if (params.get('checkInDate')) setCheckInDate(params.get('checkInDate'));
    if (params.get('guests')) setGuestCount(parseInt(params.get('guests')));
  }, []);

  return (
    <section className="md:p-5 bg-gray-100 w-full md:w-[80%] mx-auto md:my-10 rounded-lg shadow-md border border-gray-400">
      <div className="container mx-auto px-4">
        {/* Tabs */}
        <Tabs
          defaultValue="property"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <div className="text-md md:text-2xl font-semibold py-2">Search Package: Sacred India - One Journey, Infinite Blessings.</div>
          <TabsContent value="property">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-6 gap-4">
                {/* Location Select */}
                <div className="w-full">
                  <Select
                    value={location}
                    onValueChange={(value) => setLocation(value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Yatra Type" />
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

                {/* Property For Select */}
                <Select
                  value={propertyFor}
                  onValueChange={(value) => setPropertyFor(value)}
                >
                  <SelectTrigger className="">
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

                {/* Property Type Select */}
                <div className="">
                  <Select
                    value={propertyType}
                    onValueChange={(value) => setPropertyType(value)}
                    disabled={!propertyFor || isLoading}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={propertyFor ? "Select Package" : "Select a category first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedPackages.length > 0 ? (
                        selectedPackages.map((pkg, index) => (
                          <SelectItem key={`pkg-${pkg._id || index}`} value={pkg.title || `pkg-${index}`}>
                            {pkg.title}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-packages" disabled>
                          {propertyFor ? "No packages available" : "Select a category first"}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="">
                  <Input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} />
                </div>
                <div className="w-full flex items-center gap-2">
                  <NumberInput
                    value={guestCount}
                    onChange={setGuestCount}
                    min={1}
                    max={20}
                    className=""
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-6"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Search className="mr-2 h-4 w-4" /> Search
                    </span>
                  )}
                </Button>
              </form>
              <div className="mt-8">
                {trendingSearches.length > 0 ? (
                  <div className="flex items-center gap-2 text-gray-700 mb-4">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <h3 className="text-lg font-semibold">Trending Divine India</h3>
                  </div>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.length > 0 ? (
                    <>
                      {trendingSearches.map((property, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="rounded-full px-4 py-1 text-sm hover:bg-blue-50 hover:text-blue-600 border-gray-200"
                          asChild
                        >
                          <Link href={`/package/${property._id}`}>
                            {property.packageName}
                          </Link>
                        </Button>
                      ))}
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default SearchSection;