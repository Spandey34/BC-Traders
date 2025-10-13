import React, { useState, useEffect, useCallback } from "react";
import { useCart } from "../context/CartContext";
import { useProducts } from "../redux/ReduxProvider";
import toast from "react-hot-toast";

// --- SVG Icon Components ---
const ShoppingCartIcon = ({ className = "w-6 h-6" }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>);
const SearchIcon = ({ className = "w-5 h-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>);
const ChevronLeftIcon = ({ className="w-6 h-6" }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6" /></svg>);
const ChevronRightIcon = ({ className="w-6 h-6" }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6" /></svg>);


// --- FeaturedProductsCarousel Component ---
const FeaturedProductsCarousel = ({ products, addToCart }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        const isLastSlide = currentIndex === products.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }, [currentIndex, products.length]);

    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? products.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };
    
    useEffect(() => {
        if (products && products.length > 0) {
            const slideInterval = setInterval(nextSlide, 5000);
            return () => clearInterval(slideInterval);
        }
    }, [nextSlide, products]);

    if (!products || products.length === 0) return null;
    const currentProduct = products[currentIndex];

    return (
        <div className='h-[50vh] md:h-[60vh] w-full m-auto mb-8 relative group'>
            <div style={{ backgroundImage: `url(${currentProduct.imageUrl})` }} className='w-full h-full rounded-2xl bg-center bg-cover duration-500 ease-in-out'>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent rounded-2xl"></div>
                <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white">
                    <h2 className="text-2xl md:text-4xl font-bold mb-2 drop-shadow-lg">{currentProduct.name}</h2>
                    <div className="flex items-center gap-4 mb-4">
                        <p className="text-xl md:text-2xl font-bold text-emerald-400 drop-shadow-lg">₹{currentProduct.sellingPrice}</p>
                        <p className="text-md md:text-lg text-gray-300 line-through drop-shadow-lg">₹{currentProduct.mrp}</p>
                    </div>
                    {currentProduct.inStockCount > 0 ? (
                        <button onClick={() => { addToCart(currentProduct);}} className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                            <ShoppingCartIcon className="w-5 h-5" /> Add to Cart
                        </button>
                    ) : (
                        <div className="flex items-center justify-center px-5 py-3 rounded-xl font-semibold text-gray-800 bg-gray-300 cursor-not-allowed">Out of Stock</div>
                    )}
                </div>
            </div>
            <div className='hidden group-hover:block absolute top-1/2 -translate-y-1/2 left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer' onClick={prevSlide}><ChevronLeftIcon className="w-8 h-8" /></div>
            <div className='hidden group-hover:block absolute top-1/2 -translate-y-1/2 right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer' onClick={nextSlide}><ChevronRightIcon className="w-8 h-8" /></div>
            <div className='flex justify-center py-2 absolute bottom-4 right-0 left-0'>
                {products.map((_, i) => (<div key={i} onClick={() => setCurrentIndex(i)} className={`cursor-pointer transition-all mx-1 ${currentIndex === i ? 'p-1.5' : 'p-1 opacity-50'}`}><div className={`w-2 h-2 rounded-full ${currentIndex === i ? 'bg-white' : 'bg-gray-400'}`}></div></div>))}
            </div>
        </div>
    );
};


const Products = () => {
    const [products] = useProducts();
    const { addToCart } = useCart();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!products || products.length === 0) {
        return (
            <div className="p-6 text-center flex justify-center items-center h-screen text-xl">
                Loading products...
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="p-4 md:p-6 pb-24 lg:pb-6">
                <FeaturedProductsCarousel products={products} addToCart={addToCart} />
                
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
                                    product.inStockCount !== 0 ? "hover:shadow-xl hover:-translate-y-1" : "opacity-60 grayscale"
                                }`}
                            >
                                <div className="relative h-48 w-full overflow-hidden">
                                    <img src={product.imageUrl} alt={product.name} className={`w-full h-full object-cover transition-transform duration-300 ${product.inStockCount !== 0 ? "group-hover:scale-105" : ""}`} />
                                    <div className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 ${product.inStockCount !== 0 ? "group-hover:opacity-100" : ""}`}></div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2 h-12">{product.name}</h3>
                                    <div className="flex items-center justify-between mt-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">₹{product.sellingPrice}</p>
                                                <p className="text-sm text-gray-400 line-through">₹{product.mrp}</p>
                                            </div>
                                            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">Save ₹{(product.mrp - product.sellingPrice)}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Available: {product.inStockCount}</div>
                                        </div>
                                        {product.inStockCount !== 0 ? (
                                            <button
                                                onClick={() => { addToCart(product); }}
                                                className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                                                aria-label={`Add ${product.name} to cart`}
                                            >
                                                <ShoppingCartIcon className="w-4 h-4" /> Add
                                            </button>
                                        ) : (
                                            <div className="px-4 py-2 rounded-xl font-semibold text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 cursor-not-allowed">Out of Stock</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10 text-xl"><p>No products match your search.</p></div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;
