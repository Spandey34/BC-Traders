import { useCallback, useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiShoppingCart } from "react-icons/fi";

const FeaturedProductsCarousel = ({ products, addToCart }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    if (products && products.length > 0) {
      const isLastSlide = currentIndex === products.length - 1;
      const newIndex = isLastSlide ? 0 : currentIndex + 1;
      setCurrentIndex(newIndex);
    }
  }, [currentIndex, products]);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? products.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    if (products && products.length > 1) {
      const slideInterval = setInterval(nextSlide, 5000);
      return () => clearInterval(slideInterval);
    }
  }, [nextSlide, products]);
  
  // --- FIX START: Display a message if there are no featured products ---
  if (!products || products.length === 0) {
    return (
        <div className="h-[50vh] md:h-[60vh] w-full m-auto mb-8 relative group flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-2xl">
            <p className="text-xl text-gray-500">No featured products yet.</p>
        </div>
    );
  }
  // --- FIX END ---

  const currentProduct = products[currentIndex];

  return (
    <div className="h-[50vh] md:h-[60vh] w-full m-auto mb-8 relative group">
      <div
        style={{ backgroundImage: `url(${currentProduct.imageUrl})` }}
        className="w-full h-full rounded-2xl bg-center bg-cover duration-500 ease-in-out"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent rounded-2xl"></div>
        <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white">
          <h2 className="text-2xl md:text-4xl font-bold mb-2 drop-shadow-lg">
            {currentProduct.name}
          </h2>
          <div className="flex items-center gap-4 mb-4">
            <p className="text-xl md:text-2xl font-bold text-emerald-400 drop-shadow-lg">
              ₹{currentProduct.sellingPrice}
            </p>
            <p className="text-md md:text-lg text-gray-300 line-through drop-shadow-lg">
              ₹{currentProduct.mrp}
            </p>
          </div>
          {currentProduct.inStockCount > 0 ? (
            <button
              onClick={() => {
                addToCart(currentProduct);
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FiShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
          ) : (
            <div className="flex items-center justify-center px-5 py-3 rounded-xl font-semibold text-gray-800 bg-gray-300 cursor-not-allowed">
              Out of Stock
            </div>
          )}
        </div>
      </div>
      <div
        className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer"
        onClick={prevSlide}
      >
        <FiChevronLeft className="w-8 h-8" />
      </div>
      <div
        className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer"
        onClick={nextSlide}
      >
        <FiChevronRight className="w-8 h-8" />
      </div>
      <div className="flex justify-center py-2 absolute bottom-4 right-0 left-0">
        {products.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`cursor-pointer transition-all mx-1 ${
              currentIndex === i ? "p-1.5" : "p-1 opacity-50"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                currentIndex === i ? "bg-white" : "bg-gray-400"
              }`}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProductsCarousel;