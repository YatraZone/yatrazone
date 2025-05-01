"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../ui/carousel";
import { useState } from "react";

const dummyImages = [
  { url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" },
  { url: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2" },
  { url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca" },
  { url: "https://images.unsplash.com/photo-1454023492550-5696f8ff10e1" },
  { url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429" },
  { url: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2" },
  { url: "https://images.unsplash.com/photo-1416339306562-f3d12fefd36f" },
  { url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e" },
  { url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9" },
];

const chunkGalleryImages = (images) => {
  const slides = [];
  const allImages = [...images];
  while (allImages.length % 6 !== 0) {
    allImages.push(dummyImages[allImages.length % dummyImages.length]);
  }
  for (let i = 0; i < allImages.length; i += 6) {
    slides.push(allImages.slice(i, i + 6));
  }
  return slides;
};

const PackageGallery = ({ images }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const galleryImages = images && images.length ? images : dummyImages;

  const openModal = (index) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
    document.body.style.overflow = "auto";
  };

  const slides = chunkGalleryImages(galleryImages);
  const flatImages = galleryImages;

  return (
    <div className="space-y-4 overflow-visible px-5 relative">
      <Carousel className="overflow-visible w-full">
        <CarouselContent>
          {slides.map((slide, slideIdx) => (
            <CarouselItem className="basis-full" key={slideIdx}>
              <div className="grid grid-cols-4 gap-2 h-72 md:h-96">
                {/* Col 1 */}
                <div className="flex flex-col gap-2 h-full">
                  {slide[0] && (
                    <div
                      className="flex-1 cursor-pointer rounded-lg overflow-hidden bg-gray-200"
                      onClick={() => openModal(slideIdx * 6 + 0)}
                    >
                      <Image
                        src={slide[0].url}
                        alt="Gallery"
                        width={300}
                        height={200}
                        style={{ height: '200px', width: '100%', objectFit: 'cover', objectPosition: 'center' }}
                        className="object-cover w-full h-[200px]"
                      />
                    </div>
                  )}
                  {slide[1] && (
                    <div
                      className="flex-1 cursor-pointer rounded-lg overflow-hidden bg-gray-200"
                      onClick={() => openModal(slideIdx * 6 + 1)}
                    >
                      <Image
                        src={slide[1].url}
                        alt="Gallery"
                        width={300}
                        height={200}
                        style={{ height: '200px', width: '100%', objectFit: 'cover', objectPosition: 'center' }}
                        className="object-cover w-full h-[200px]"
                      />
                    </div>
                  )}
                </div>

                {/* Col 2 */}
                <div className="flex flex-col gap-2 h-full">
                  {slide[2] && (
                    <div
                      className="flex-1 cursor-pointer rounded-lg overflow-hidden bg-gray-200"
                      onClick={() => openModal(slideIdx * 6 + 2)}
                    >
                      <Image
                        src={slide[2].url}
                        alt="Gallery"
                        width={300}
                        height={200}
                        style={{ height: '200px', width: '100%', objectFit: 'cover', objectPosition: 'center' }}
                        className="object-cover w-full h-[200px]"
                      />
                    </div>
                  )}
                </div>
                {/* Col 3 */}
                <div className="flex flex-col gap-2 h-full">
                  {slide[3] && (
                    <div
                      className="flex-1 cursor-pointer rounded-lg overflow-hidden bg-gray-200"
                      onClick={() => openModal(slideIdx * 6 + 3)}
                    >
                      <Image
                        src={slide[3].url}
                        alt="Gallery"
                        width={300}
                        height={200}
                        style={{ height: '200px', width: '100%', objectFit: 'cover', objectPosition: 'center' }}
                        className="object-cover w-full h-[200px]"
                      />
                    </div>
                  )}
                </div>

                {/* Col 3 */}
                <div className="flex flex-col gap-2 h-full">
                  {slide[4] && (
                    <div
                      className="flex-1 cursor-pointer rounded-lg overflow-hidden bg-gray-200"
                      onClick={() => openModal(slideIdx * 6 + 0)}
                    >
                      <Image
                        src={slide[0].url}
                        alt="Gallery"
                        width={300}
                        height={200}
                        style={{ height: '200px', width: '100%', objectFit: 'cover', objectPosition: 'center' }}
                        className="object-cover w-full h-[200px]"
                      />
                    </div>
                  )}
                  {slide[5] && (
                    <div
                      className="flex-1 cursor-pointer rounded-lg overflow-hidden bg-gray-200"
                      onClick={() => openModal(slideIdx * 6 + 1)}
                    >
                      <Image
                        src={slide[1].url}
                        alt="Gallery"
                        width={300}
                        height={200}
                        style={{ height: '200px', width: '100%', objectFit: 'cover', objectPosition: 'center' }}
                        className="object-cover w-full h-[200px]"
                      />
                    </div>
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>


      {/* Modal */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
          >
            &times;
          </button>
          <button
            onClick={() =>
              setSelectedImageIndex((prev) =>
                prev === 0 ? flatImages.length - 1 : prev - 1
              )
            }
            className="absolute left-8 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center z-10"
          >
            &#10094;
          </button>
          <div className="relative w-full max-w-4xl h-full max-h-[90vh] flex items-center justify-center">
            <Image
              src={
                flatImages[selectedImageIndex]?.url ||
                "https://dummyimage.com/600x400/000/fff"
              }
              alt={`Gallery image ${selectedImageIndex + 1}`}
              fill
              quality={50}
              className="object-contain"
              priority
            />
          </div>
          <button
            onClick={() =>
              setSelectedImageIndex((prev) =>
                prev === flatImages.length - 1 ? 0 : prev + 1
              )
            }
            className="absolute right-8 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center z-10"
          >
            &#10095;
          </button>
          <div className="absolute bottom-4 text-white">
            {selectedImageIndex + 1} / {flatImages.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageGallery;
