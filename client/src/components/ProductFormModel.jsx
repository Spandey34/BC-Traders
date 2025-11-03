import { useEffect, useState } from "react";

const ProductFormModal = ({ isOpen, onClose, onSubmit, product, title, isLoading }) => {
    const [formData, setFormData] = useState({});
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        const initialFormState = product || {
            name: '', mrp: '', sellingPrice: '', quantity: '', inStockCount: '', featured: false, offer: '', description: '', image: null
        };
        setFormData(initialFormState);
        setImagePreview(product?.imageUrl || null);
    }, [product, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file') {
            const file = files[0];
            setFormData(prev => ({ ...prev, image: file }));
            if (file) {
                setImagePreview(URL.createObjectURL(file));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        }
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        for (const key in formData) {
            if (key !== 'imageUrl') {
                data.append(key, formData[key]);
            }
        }
        onSubmit(data);
    };

    if (!isOpen) return null;
    
    const inputStyle = "w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="name" value={formData.name || ''} onChange={handleChange} placeholder="Product Name" className={inputStyle} required/>
                    <input name="quantity" value={formData.quantity || ''} onChange={handleChange} placeholder="Quantity (e.g., 500g, 1L)" className={inputStyle} />
                    <input name="mrp" value={formData.mrp || ''} onChange={handleChange} placeholder="MRP" type="number" step="0.01" className={inputStyle} required/>
                    <input name="sellingPrice" value={formData.sellingPrice || ''} onChange={handleChange} placeholder="Selling Price" type="number" step="0.01" className={inputStyle} required/>
                    <input name="inStockCount" value={formData.inStockCount || ''} onChange={handleChange} placeholder="Stock Count" type="number" className={inputStyle} required/>
                    <input name="offer" value={formData.offer || ''} onChange={handleChange} placeholder="Offer (e.g., 10% off)" className={inputStyle} />
                </div>
                <textarea name="description" value={formData.description || ''} onChange={handleChange} placeholder="Product Description" rows="3" className={`${inputStyle} mt-4 w-full`}></textarea>
                
                <div className="mt-4 flex items-center justify-between">
                    <label htmlFor="featured-toggle" className="flex items-center cursor-pointer">
                        <div className="relative">
                            <input type="checkbox" id="featured-toggle" name="featured" className="sr-only" checked={formData.featured || false} onChange={handleChange} />
                            <div className={`block w-14 h-8 rounded-full transition ${formData.featured ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${formData.featured ? 'translate-x-full' : ''}`}></div>
                        </div>
                        <div className="ml-3 text-gray-700 dark:text-gray-300 font-medium">Featured</div>
                    </label>

                    <div className="text-center">
                        <label className="block text-sm font-medium mb-1">Product Image</label>
                        <input name="image" type="file" onChange={handleChange} className="text-sm" accept="image/*" required={!product} />
                        {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded-md mx-auto" />}
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-md font-semibold bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition" disabled={isLoading}>Cancel</button>
                    <button type="submit" className="px-4 py-2 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 transition" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductFormModal;