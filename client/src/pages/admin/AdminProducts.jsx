import React, { useState, useMemo, useEffect, useCallback } from 'react';
import axios from 'axios';
import { api } from '../../api/api';
import toast from 'react-hot-toast';
import { useProducts } from '../../redux/ReduxProvider';
import AdminFeaturedCarousel from '../../components/AdminFeaturedCarousel';
import ProductFormModal from '../../components/ProductFormModel';

// --- SVG Icon Components ---
const SearchIcon = ({ className = "w-5 h-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>);


// --- REUSABLE COMPONENTS (Unchanged) ---
const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, children, isLoading }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm">
                <h3 className="text-lg font-bold mb-4">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{children}</p>
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-md font-semibold bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition" disabled={isLoading}>Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded-md font-semibold text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400 transition" disabled={isLoading}>
                        {isLoading ? 'Deleting...' : 'Confirm Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const AdminProducts = () => {
    const [products, setProducts] = useProducts();
    const [isLoading, setIsLoading] = useState(false);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null);

    // Handler functions (handleAdd, handleUpdate, handleDelete) remain unchanged
    const handleAddProduct = async (formData) => {
        setIsLoading(true);
        const toastId = toast.loading("Adding product...");
        try {
            const res = await axios.post(`${api}/product/add`, formData, {
                withCredentials: true
            });
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
        formData.append('_id', editingProduct._id);
        try {
            const res = await axios.post(`${api}/product/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
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

    const handleToggleFeatured = async (productToToggle) => {
        const originalProducts = [...products];
        const newFeaturedStatus = !productToToggle.featured;

        // Optimistic UI Update
        setProducts(prev =>
            prev.map(p =>
                p._id === productToToggle._id ? { ...p, featured: newFeaturedStatus } : p
            )
        );

        const toastId = toast.loading(productToToggle.featured ? 'Removing from featured...' : 'Adding to featured...');

        try {
            const formData = new FormData();
            Object.keys(productToToggle).forEach(key => {
                if (key !== 'imageUrl' && key !== 'image') { // Also exclude 'image' if it exists
                    formData.append(key, productToToggle[key]);
                }
            });
            formData.set('featured', newFeaturedStatus);

            await axios.post(`${api}/product/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });

            toast.success("Product status updated!", { id: toastId });
        } catch (error) {
            toast.error("Failed to update status.", { id: toastId });
            setProducts(originalProducts);
        }
    };

    const { filteredProducts, featuredProducts } = useMemo(() => {
        if (!Array.isArray(products)) return { filteredProducts: [], featuredProducts: [] };
        
        const featured = products.filter(p => p.featured);
        const all = searchQuery
            ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
            : products;

        return { filteredProducts: all, featuredProducts: featured };
    }, [products, searchQuery]);


    if (!products || !Array.isArray(products)) {
        return <div className="p-6 text-center h-screen flex items-center justify-center">Loading products...</div>;
    }

    return (
        <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100">
             <ProductFormModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} onSubmit={handleAddProduct} title="Add New Product" isLoading={isLoading} />
             {editingProduct && <ProductFormModal isOpen={!!editingProduct} onClose={() => setEditingProduct(null)} onSubmit={handleUpdateProduct} product={editingProduct} title="Edit Product" isLoading={isLoading}/>}
             <ConfirmationDialog isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={handleDeleteProduct} title="Confirm Deletion" isLoading={isLoading}>
                 Are you sure you want to delete the product "{confirmDelete?.name}"?
             </ConfirmationDialog>

            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Manage Products</h1>
                <button onClick={() => setAddModalOpen(true)} className="px-5 py-2.5 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition w-full md:w-auto shadow-sm">Add New Product</button>
            </div>
            
            <AdminFeaturedCarousel 
                products={featuredProducts} 
                setEditingProduct={setEditingProduct}
                handleToggleFeatured={handleToggleFeatured} 
            />

             <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">All Products</h2>
                <div className="mt-6 relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search all products..."
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="text-gray-400" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(p => (
  <div key={p._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm flex flex-col overflow-hidden border dark:border-gray-700">
    <div className="relative">
      {/*  */}
      <img src={p?.imageUrl} alt={p.name} className="w-full h-40 object-contain" /> {/* Changed from object-cover */}
      {p.featured && <span className="absolute top-2 left-2 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded">Featured</span>}
      {p.offer && <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">{p.offer}Off</span>}
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <h3 className="font-bold text-lg mb-1">{p.name}</h3>
      {p.description&&<p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-3">
                    {p.description}
                  </p>}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{p.quantity}</p>
      <div className="flex items-baseline gap-2">
        <p className="font-semibold text-xl">₹{p.sellingPrice}</p>
        <p className="line-through text-sm text-gray-500">₹{p.mrp}</p>
      </div>
      <p className="mt-1 text-sm">Stock: <span className="font-bold">{p.inStockCount > 0 ? p.inStockCount : <span className="text-red-500">Out of Stock</span>}</span></p>
      
      <div className="mt-auto pt-4 flex flex-col gap-2">
        <button
          onClick={() => handleToggleFeatured(p)}
          className={`w-full px-4 py-2 font-semibold text-white rounded-md transition-colors shadow-sm text-sm ${p.featured ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-500 hover:bg-green-600'}`}
        >
          {p.featured ? 'Remove from Featured' : 'Make Featured'}
        </button>
        <div className="flex gap-2">
          <button onClick={() => setEditingProduct(p)} className="px-4 py-2 font-semibold text-white rounded-md transition-colors shadow-sm bg-blue-500 hover:bg-blue-600 text-sm w-full">Edit</button>
          <button onClick={() => setConfirmDelete(p)} className="px-4 py-2 font-semibold text-white rounded-md transition-colors shadow-sm bg-red-500 hover:bg-red-600 text-sm w-full">Delete</button>
        </div>
      </div>
    </div>
  </div>
))}
            </div>
        </div>
    );
};

export default AdminProducts;

