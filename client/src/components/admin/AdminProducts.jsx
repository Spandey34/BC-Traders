import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { api } from '../../api/api';
import toast from 'react-hot-toast';
import Cookies from "js-cookie";
import { useProducts } from '../../redux/ReduxProvider';

// --- REUSABLE COMPONENTS ---

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, children, isLoading }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm">
                <h3 className="text-lg font-bold mb-4">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{children}</p>
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="btn-secondary" disabled={isLoading}>Cancel</button>
                    <button onClick={onConfirm} className="btn-primary bg-red-600 hover:bg-red-700 disabled:bg-red-400" disabled={isLoading}>
                        {isLoading ? 'Deleting...' : 'Confirm Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

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

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="name" value={formData.name || ''} onChange={handleChange} placeholder="Product Name" className="input-style" required/>
                    <input name="quantity" value={formData.quantity || ''} onChange={handleChange} placeholder="Quantity (e.g., 500g, 1L)" className="input-style" />
                    <input name="mrp" value={formData.mrp || ''} onChange={handleChange} placeholder="MRP" type="number" step="0.01" className="input-style" required/>
                    <input name="sellingPrice" value={formData.sellingPrice || ''} onChange={handleChange} placeholder="Selling Price" type="number" step="0.01" className="input-style" required/>
                    <input name="inStockCount" value={formData.inStockCount || ''} onChange={handleChange} placeholder="Stock Count" type="number" className="input-style" required/>
                    <input name="offer" value={formData.offer || ''} onChange={handleChange} placeholder="Offer (e.g., 10% off)" className="input-style" />
                </div>
                <textarea name="description" value={formData.description || ''} onChange={handleChange} placeholder="Product Description" rows="3" className="input-style mt-4 w-full"></textarea>
                
                <div className="mt-4 flex items-center justify-between">
                    <label htmlFor="featured-toggle" className="flex items-center cursor-pointer">
                        <div className="relative">
                            <input type="checkbox" id="featured-toggle" name="featured" className="sr-only" checked={formData.featured || false} onChange={handleChange} />
                            <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${formData.featured ? 'translate-x-full bg-green-400' : ''}`}></div>
                        </div>
                        <div className="ml-3 text-gray-700 dark:text-gray-300 font-medium">Featured</div>
                    </label>

                    <div className="text-center">
                        <label className="block text-sm font-medium mb-1">Product Image</label>
                        <input name="image" type="file" onChange={handleChange} className="input-style" accept="image/*" required={!product} />
                        {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded-md mx-auto" />}
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button type="button" onClick={onClose} className="btn-secondary" disabled={isLoading}>Cancel</button>
                    <button type="submit" className="btn-primary bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};


// --- Main AdminProducts Component ---

const AdminProducts = () => {
    const [products, setProducts] = useProducts();
    const [isLoading, setIsLoading] = useState(false);

    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null);

    const handleAddProduct = async (formData) => {
        setIsLoading(true);
        const toastId = toast.loading("Adding product...");
        try {
            const res = await axios.post(`${api}/product/add`, formData, {
                withCredentials: true
            });
            // Assuming the backend returns the new product object in `res.data.product`
            setProducts(prev => [res.data.product, ...prev]);
            toast.success("Product added successfully!", { id: toastId });
            setAddModalOpen(false);
        } catch (error) {
            toast.error("Failed to add product.", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleUpdateProduct = async (formData) => {
        setIsLoading(true);
        const toastId = toast.loading("Updating product...");
        // Add the product ID to the form data so the backend can identify it
        formData.append('_id', editingProduct._id);
        try {
            const res = await axios.post(`${api}/product/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            // Assuming the backend returns the updated product object in `res.data.product`
            setProducts(prev => prev.map(p => p._id === editingProduct._id ? res.data.product : p));
            toast.success("Product updated successfully!", { id: toastId });
            setEditingProduct(null);
        } catch (error) {
            toast.error("Failed to update product.", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteProduct = async () => {
        if (!confirmDelete) return;
        setIsLoading(true);
        const toastId = toast.loading("Deleting product...");
        try {
            // Assuming a route like '/admin/product/delete' that accepts an ID in the body
            await axios.post(`${api}/product/delete`, { _id: confirmDelete._id }, {
                withCredentials: true
            });
            setProducts(prev => prev.filter(p => p._id !== confirmDelete._id));
            toast.success(`Deleted "${confirmDelete.name}"`, { id: toastId });
            setConfirmDelete(null);
        } catch (error) {
            toast.error("Failed to delete product.", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    const filteredProducts = useMemo(() => {
        if (!Array.isArray(products)) return [];
        if (!searchQuery) return products;
        return products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [products, searchQuery]);

    if (!products || !Array.isArray(products)) {
        return <div className="p-6 text-center">Loading products...</div>;
    }

    return (
        <div className="p-4 md:p-6">
             <ProductFormModal 
                isOpen={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
                onSubmit={handleAddProduct}
                title="Add New Product"
                isLoading={isLoading}
             />
             {editingProduct && (
                <ProductFormModal 
                    isOpen={!!editingProduct}
                    onClose={() => setEditingProduct(null)}
                    onSubmit={handleUpdateProduct}
                    product={editingProduct}
                    title="Edit Product"
                    isLoading={isLoading}
                />
             )}
             <ConfirmationDialog
                isOpen={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                onConfirm={handleDeleteProduct}
                title="Confirm Deletion"
                isLoading={isLoading}
             >
                Are you sure you want to delete the product "{confirmDelete?.name}"?
             </ConfirmationDialog>

            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold">Manage Products</h1>
                <input 
                    type="text" 
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-style md:w-1/3"
                />
                <button onClick={() => setAddModalOpen(true)} className="btn-primary bg-blue-600 hover:bg-blue-700 w-full md:w-auto">Add Product</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(p => (
                    <div key={p._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm flex flex-col overflow-hidden border dark:border-gray-700">
                        <div className="relative">
                            <img src={p?.imageUrl} alt={p.name} className="w-full h-40 object-cover" />
                            {p.featured && <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">Featured</span>}
                            {p.offer && <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">{p.offer}</span>}
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                            <h3 className="font-bold text-lg mb-1">{p.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{p.quantity}</p>
                            <div className="flex items-baseline gap-2">
                                <p className="font-semibold text-xl">₹{p.sellingPrice}</p>
                                <p className="line-through text-sm text-gray-500">₹{p.mrp}</p>
                            </div>
                            <p className="mt-1 text-sm">Stock: <span className="font-bold">{p.inStockCount}</span></p>
                            <div className="mt-auto pt-4 flex gap-2">
                                <button onClick={() => setEditingProduct(p)} className="px-4 py-2 font-semibold text-white rounded-md transition-colors shadow-sm bg-blue-500 hover:bg-blue-600 text-sm w-full">Edit</button>
                                <button onClick={() => setConfirmDelete(p)} className="px-4 py-2 font-semibold text-white rounded-md transition-colors shadow-sm bg-red-500 hover:bg-red-600 text-sm w-full">Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminProducts;