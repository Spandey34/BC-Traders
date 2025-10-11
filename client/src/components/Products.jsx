import React from "react";
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

const Products = () => {
  // Using context instead of mock data and props
  //const [products] = useProducts();
  const products = [
    {
      id: 1,
      name: "Premium Cotton T-Shirt",
      price: 250.0,
      mrp: 499.0,
      imageUrl: "https://placehold.co/400x400/f0f0f0/333?text=T-Shirt",
    },

    {
      id: 2,
      name: "Denim Jeans (Bulk Pack)",
      price: 1200.0,
      mrp: 1999.0,
      imageUrl: "https://placehold.co/400x400/f0f0f0/333?text=Jeans",
    },

    {
      id: 3,
      name: "Leather Wallets (Set of 10)",
      price: 800.0,
      mrp: 1500.0,
      imageUrl: "https://placehold.co/400x400/f0f0f0/333?text=Wallets",
    },

    {
      id: 4,
      name: "Classic Wrist Watch",
      price: 1500.0,
      mrp: 2999.0,
      imageUrl: "https://placehold.co/400x400/f0f0f0/333?text=Watch",
    },
  ];
  const { addToCart } = useCart();

  // A check for when products are loading
  if (!products || products.length === 0) {
    return <div className="p-6 text-center">Loading products...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="p-6 pb-30">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
            Featured Products
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:-translate-y-1"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2 h-12">
                  {product.name}
                </h3>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                        ₹{product.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-400 line-through">
                        ₹{product.mrp.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                      Save ₹{(product.mrp - product.price).toFixed(2)}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(product);
                      toast.success(`${product.name} added to cart!`);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <ShoppingCartIcon className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
