import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../redux/ReduxProvider";
import toast from "react-hot-toast";
import FeaturedProductsCarousel from "../../components/UserFeaturedCarousel";

// --- SVG Icon Components ---
const ShoppingCartIcon = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);
const SearchIcon = ({ className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

// --- FeaturedProductsCarousel Component ---


const Products = () => {
  const [products] = useProducts();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");

  // --- FIX START: Changed logic to return an array directly, not an object ---
  const featuredProducts = useMemo(() => {
    if (!Array.isArray(products)) {
        return [];
    }
    return products.filter(p => p.featured);
  }, [products]);
  // --- FIX END ---
  
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ProductSkeletonCard = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
      <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      <div className="p-5">
        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
        <div className="flex items-center justify-between mt-4">
          <div>
            <div className="h-7 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  if (!products || products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="p-4 md:p-6 pb-24 lg:pb-6">
          {/* Skeleton for Carousel */}
          <div className="h-[50vh] md:h-[60vh] w-full m-auto mb-8 relative group bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>

          {/* Skeleton for Header and Search */}
          <div className="mb-8">
            <div className="h-10 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6"></div>
            <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
          </div>

          {/* Skeleton for Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductSkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="p-4 md:p-6 pb-24 lg:pb-6">
        <FeaturedProductsCarousel products={featuredProducts} addToCart={addToCart} />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            All Products
          </h1>
          <div className="mt-6 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="text-gray-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                className={`group bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300 ${
                  product.inStockCount !== 0
                    ? "hover:shadow-xl hover:-translate-y-1"
                    : "opacity-60 grayscale"
                }`}
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-300 ${
                      product.inStockCount !== 0 ? "group-hover:scale-105" : ""
                    }`}
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 ${
                      product.inStockCount !== 0
                        ? "group-hover:opacity-100"
                        : ""
                    }`}
                  ></div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2 h-12">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                          ₹{product.sellingPrice}
                        </p>
                        <p className="text-sm text-gray-400 line-through">
                          ₹{product.mrp}
                        </p>
                      </div>
                      <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                        Save ₹{product.mrp - product.sellingPrice}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Available: {product.inStockCount}
                      </div>
                    </div>
                    {product.inStockCount !== 0 ? (
                      <button
                        onClick={() => {
                          addToCart(product);
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                        aria-label={`Add ${product.name} to cart`}
                      >
                        <ShoppingCartIcon className="w-4 h-4" /> Add
                      </button>
                    ) : (
                      <div className="px-4 py-2 rounded-xl font-semibold text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 cursor-not-allowed">
                        Out of Stock
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-xl">
              <p>No products match your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
