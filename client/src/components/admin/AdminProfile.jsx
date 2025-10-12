import React, { useState, useEffect } from 'react';
import { useUser, useClerk } from "@clerk/clerk-react";
import toast from 'react-hot-toast';
import axios from 'axios';
import { api } from '../../api/api';
import { useAuth } from '../../redux/ReduxProvider';

const AdminProfile = () => {
    const { user } = useUser();
    const { signOut } = useClerk();
    const [authUser, setAuthUser] = useAuth();

    // State for new logo upload
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // State for phone number
    const [phoneNumber, setPhoneNumber] = useState('');

    useEffect(() => {
        // Populate local state from the auth context when it loads
        if (authUser) {
            setPhoneNumber(authUser.phoneNumber || '');
            setLogoPreview(authUser.logo || '');
        }
    }, [authUser]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file)); // Show instant preview of the selected file
        } else {
            setLogoFile(null);
            toast.error("Please select a valid image file.");
        }
    };

    const handleLogoUpload = async () => {
        if (!logoFile) return;

        setIsUploading(true);
        const toastId = toast.loading("Uploading logo...");
        
        const formData = new FormData();
        formData.append('logo', logoFile);
        // Append user data from Clerk as requested
        formData.append('clerkId', user.id);
        formData.append('email', user.primaryEmailAddress.emailAddress);
        formData.append('name', user.fullName);

        try {
            const res = await axios.post(`${api}/admin/logo`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });
            
            // Assuming backend returns the new URL in res.data.newLogoUrl
            const { newLogoUrl } = res.data;

            // Update the global auth context with the new logo URL
            setAuthUser(prev => ({ ...prev, logo: newLogoUrl }));
            
            toast.success("Logo updated successfully!", { id: toastId });
            setLogoFile(null); // Clear the selected file after successful upload
        } catch (error) {
            console.error("Logo upload failed:", error);
            toast.error("Failed to upload logo.", { id: toastId });
            // Revert preview to the original logo if upload fails
            setLogoPreview(authUser?.logo || '');
        } finally {
            setIsUploading(false);
        }
    };
    
    const handlePhoneUpdate = async () => {
        if (!/^\d{10}$/.test(phoneNumber)) {
            toast.error("Please enter a valid 10-digit phone number.");
            return;
        }
        
        const toastId = toast.loading("Updating phone number...");
        try {
            await user.update({
                unsafeMetadata: { ...user.unsafeMetadata, phoneNumber: phoneNumber }
            });

            setAuthUser({ ...authUser, phoneNumber: phoneNumber });
            
            toast.success("Phone number updated successfully!", { id: toastId });
        } catch (err) {
            toast.error("Failed to update phone number.", { id: toastId });
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Admin Profile</h1>

            {/* Admin Info */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-6">
                <div className="flex items-center gap-4">
                    <img src={user?.imageUrl} alt={user?.fullName || 'Admin'} className="w-16 h-16 rounded-full" />
                    <div>
                        <h2 className="text-xl font-bold">{user?.fullName}</h2>
                        <p className="text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>
                    </div>
                </div>
            </div>

            {/* Settings */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm space-y-6">
                <div>
                    <label className="block font-semibold mb-2">Company Logo</label>
                    <div className="flex items-center gap-4">
                        {logoPreview ? (
                            <img src={logoPreview} alt="Company Logo" className="w-20 h-20 object-contain rounded-md bg-gray-100 dark:bg-gray-700 p-1" />
                        ) : (
                            <div className="w-20 h-20 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md text-gray-400">No Logo</div>
                        )}
                        <input type="file" onChange={handleFileSelect} accept="image/*" className="input-style flex-1"/>
                    </div>
                    {logoFile && (
                        <button 
                            onClick={handleLogoUpload} 
                            className="btn-primary bg-blue-600 hover:bg-blue-700 w-full mt-4 disabled:bg-blue-400 disabled:cursor-not-allowed"
                            disabled={isUploading}
                        >
                            {isUploading ? 'Uploading...' : 'Upload New Logo'}
                        </button>
                    )}
                </div>

                <div>
                    <label htmlFor="phone" className="block font-semibold mb-2">Admin Phone Number</label>
                    <div className="flex gap-3">
                        <input 
                            id="phone" 
                            type="tel" 
                            value={phoneNumber} 
                            onChange={(e) => setPhoneNumber(e.target.value)} 
                            className="input-style flex-1"
                            placeholder="Enter 10-digit number"
                        />
                        <button onClick={handlePhoneUpdate} className="btn-primary bg-blue-600 hover:bg-blue-700">Save</button>
                    </div>
                </div>
            </div>

            {/* Logout */}
            <button 
                onClick={() => signOut()} 
                className="w-full mt-8 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors">
                Logout
            </button>
        </div>
    );
};

export default AdminProfile;