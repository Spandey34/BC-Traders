import React, { useState } from "react";
import { useProducts } from "../context/ProductsProvider"; // Assuming this context exists
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

// Icon Component
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

const Products = () => {
  // Using context instead of mock data and props
  const [products] = useProducts();
  const { addToCart } = useCart();

  const [searchQuery, setSearchQuery] = useState("");

  // --- FILTERING LOGIC ---

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // A check for when products are loading
  if (!products || products.length === 0) {
    return (
      <div className="p-6 text-center justify-center items-center mt-[60%] text-xl">
        Loading products...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="p-6 pb-30">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
            Featured Products
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
            <>
              {filteredProducts.map((product, id) => (
                <div
                  key={product.id}
                  // ADDED: Conditional classes for disabled state
                  className={`group bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300 ${
                    product.inStockCount!==0
                      ? "hover:shadow-xl hover:-translate-y-1"
                      : "opacity-60 grayscale"
                  }`}
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className={`w-full h-full object-cover transition-transform duration-300 ${
                        product.inStockCount!==0 ? "group-hover:scale-105" : ""
                      }`}
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 ${
                        product.inStockCount!==0
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
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                            ₹{product.price}
                          </p>
                          <p className="text-sm text-gray-400 line-through">
                            ₹{product.mrp}
                          </p>
                        </div>
                        <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                          Save ₹{(product.mrp - product.price)}
                        </div>
                        <div className={``} >Available: {product.inStockCount}</div>
                      </div>

                      {product.inStockCount!==0 ? (
                        <button
                          onClick={() => {
                            addToCart(product);
                           
                          }}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                          aria-label={`Add ${product.name} to cart`}
                        >
                          <ShoppingCartIcon className="w-4 h-4" />
                          Add
                        </button>
                      ) : (
                        <div
                          className="flex items-center justify-center px-4 py-2 rounded-xl font-semibold text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 cursor-not-allowed"
                          aria-label="Out of stock"
                        >
                          Out of Stock
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="text-xl h-max w-max ml-[28%] mt-[50%]">
              <p>No Such Product.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
