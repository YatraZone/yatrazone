"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";

const PackageGallery = ({ images }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [showAllImages, setShowAllImages] = useState(false);

  // Minimum swipe distance to trigger navigation
  const minSwipeDistance = 50;

  const openModal = (index) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
    document.body.style.overflow = "auto"; // Re-enable scrolling
  };

  const goToPrevious = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const onTouchStart = (e) => {
    setTouchEnd(null); // Reset touchEnd
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) goToNext();
    if (isRightSwipe) goToPrevious();
  }, [touchStart, touchEnd]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImageIndex !== null) {
        if (e.key === "ArrowLeft") {
          goToPrevious();
        } else if (e.key === "ArrowRight") {
          goToNext();
        } else if (e.key === "Escape") {
          closeModal();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex]);

  // Show first 4 images in grid, 5th is "View More"
  const displayedImages = images?.slice(0, 4) || [];

  return (
    <div className="space-y-4">
      {/* Gallery Grid - Show exactly 5 items (4 images + 1 "View More") */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* First 4 images */}
        {displayedImages.map((image, index) => (
          <div
            key={index}
            className="relative rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => openModal(index)}
          >
            <Image
              src={image.url || "https://dummyimage.com/600x400/000/fff"}
              alt={`Gallery image ${index + 1}`}
              width={600}
              height={400}
              quality={50}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
        
        {/* 5th item - "View More" button */}
        <div 
          className="relative rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity bg-gray-100 flex flex-col items-center justify-center p-4 text-center"
          onClick={() => openModal(0)} // Open modal at first image when clicking "View More"
        >
          <div className="text-lg font-medium mb-2">View More Images</div>
          <div className="text-sm text-gray-600">+{images.length - 4} images</div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImageIndex !== null && (
        <div className="fixed -inset-4 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
          >
            &times;
          </button>

          <button
            onClick={goToPrevious}
            className="absolute left-4 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center z-10"
          >
            &#10094;
          </button>

          <div
            className="relative w-full max-w-4xl h-full max-h-[90vh] flex items-center justify-center"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <Image
              src={
                images[selectedImageIndex]?.url ||
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
            onClick={goToNext}
            className="absolute right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center z-10"
          >
            &#10095;
          </button>

          <div className="absolute bottom-4 text-white">
            {selectedImageIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageGallery;