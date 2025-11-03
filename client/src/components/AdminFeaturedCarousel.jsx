import { useCallback, useEffect, useState } from "react";
const ChevronLeftIcon = ({ className = "w-6 h-6" }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6" /></svg>);
const ChevronRightIcon = ({ className = "w-6 h-6" }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6" /></svg>);

const AdminFeaturedCarousel = ({ products, setEditingProduct, handleToggleFeatured }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        if (products.length === 0) return;
        const isLastSlide = currentIndex === products.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }, [currentIndex, products.length]);

    const prevSlide = () => {
        if (products.length === 0) return;
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

    if (!products || products.length === 0) {
        return (
            <div className="h-[40vh] w-full m-auto mb-8 rounded-2xl bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center text-center p-4">
                <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">No Featured Products</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">You can mark a product as "featured" from the list below to have it appear here.</p>
            </div>
        )
    }

    const currentProduct = products[currentIndex];

    return (
        <div className='h-[40vh] w-full m-auto mb-8 relative group'>
            <div style={{ backgroundImage: `url(${currentProduct?.imageUrl?? ""})` }} className='w-full h-full rounded-2xl bg-center bg-cover duration-500 ease-in-out'>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent rounded-2xl"></div>
                <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white">
                    <h2 className="text-2xl md:text-4xl font-bold mb-2 drop-shadow-lg">{currentProduct?.name?? ""}</h2>
                    <div className="flex items-center gap-4 mb-4">
                        <p className="text-xl md:text-2xl font-bold text-emerald-400 drop-shadow-lg">₹{currentProduct.sellingPrice}</p>
                        <p className="text-md md:text-lg text-gray-300 line-through drop-shadow-lg">₹{currentProduct.mrp}</p>
                    </div>
                    <div className="flex items-center gap-3">
                         <button onClick={() => setEditingProduct(currentProduct)} className="px-4 py-2 rounded-md font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-all duration-200 shadow-lg">Edit</button>
                         <button onClick={() => handleToggleFeatured(currentProduct)} className="px-4 py-2 rounded-md font-semibold text-white bg-amber-500 hover:bg-amber-600 transition-all duration-200 shadow-lg">Remove from Featured</button>
                    </div>
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

export default AdminFeaturedCarousel;