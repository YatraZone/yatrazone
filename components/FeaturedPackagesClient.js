"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function FeaturedPackagesClient() {
    const [featuredPackages, setFeaturedPackages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch('/api/featured-packages');
                const data = await response.json();
                setFeaturedPackages(data); // Use dummy data if API returns empty
            } catch (error) {
                console.error('Error fetching data:', error);
                // setFeaturedPackages(dummyPackages); // Use dummy data on error
            } finally {
                setIsLoading(false);
            }
        };
        fetchPackages();
    }, []);
    if (isLoading) return null;
    return (
        <section className="relative py-1 w-full px-2 md:px-8 lg:px-16 overflow-hidden max-w-screen overflow-x-hidden bg-repeat-y bg-[url('/bg-custom-1.jpg')] brightness-145">
            <div className="w-full">
                <h1 className="font-semibold text-2xl border-b-4 border-dotted border-blue-600 font-barlow w-fit my-4">About Us</h1>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {featuredPackages.map((item) => (
                        <div key={item._id} className="rounded-2xl group flex flex-col justify-between relative overflow-hidden w-full h-96 p-0">
                            <Image
                                src={item.basicDetails?.thumbnail?.url}
                                width={1280}
                                height={720}
                                priority
                                quality={25}
                                alt={item.basicDetails?.title}
                                className="object-cover absolute inset-0 w-full h-96 group-hover:scale-105 transition-transform duration-500 ease-in-out"
                                style={{ width: '100%', height: '100%' }}
                            />
                            {/* Overlay for lighter, full black shade on hover */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                            {/* Text slides up on hover */}
                            <div className="absolute bottom-0 left-0 text-center w-full z-20 translate-y-full group-hover:translate-y-[-30%] opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out">
                                <h1 className="text-white text-xl xl:text-2xl mt-2 font-bold">{item.basicDetails?.title}</h1>
                                <Link key={item._id} href={`/package/${item._id}`}>
                                    <button className="hover:bg-white hover:text-black text-white font-bold px-4 py-2 rounded-full mt-4 transition duration-300 ease-in-out">
                                        View More
                                    </button>
                                </Link>
                            </div>
                        </div>  
                    ))}
                </div>
            </div>
        </section>
    );
}
