import React, { useState, useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, useClerk, useUser } from "@clerk/clerk-react";
import toast from 'react-hot-toast';
import { useAuth } from '../../redux/ReduxProvider';

// Icon Component
const UserIcon = ({ className = "w-6 h-6" }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>);

const Profile = () => {
    const { user } = useUser();
    const { signOut } = useClerk();
    const [authUser, setAuthUser]  = useAuth();

    const [phoneNumber, setPhoneNumber] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Populate state from authUser, the source of truth from your backend
        if (user?.unsafeMetadata.phoneNumber) {
            setPhoneNumber(user.unsafeMetadata.phoneNumber);
        } else {
            setPhoneNumber(''); // Clear if user has no number
        }
    }, [authUser]);

    const handleUpdatePhoneNumber = async () => {
        if (!/^\d{10}$/.test(phoneNumber)) {
            toast.error("Please enter a valid 10-digit phone number.");
            return;
        }
        setIsLoading(true);
        try {
            // Step 1: Update Clerk's metadata which triggers your backend webhook
            await user.update({
                unsafeMetadata: {
                    ...user.unsafeMetadata,
                    phoneNumber: phoneNumber,
                }
            });

            // Step 2: Optimistically update local authUser state for instant UI change
            setAuthUser({ ...authUser, phoneNumber: phoneNumber });

            toast.success("Phone number updated successfully!");
            setIsEditing(false);
        } catch (err) {
            console.error("Clerk update error:", err);
            toast.error("Failed to update phone number.");
        } finally {
            setIsLoading(false);
        }
    };
    
    // Handle cancel button click
    const handleCancel = () => {
        // Reset phone number to the one from context and exit editing mode
        setPhoneNumber(authUser?.phoneNumber || '');
        setIsEditing(false);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">My Profile</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage your account and preferences</p>
                </div>

                <SignedIn>
                    {/* Main Profile Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-center mb-6">
                        <div className="flex justify-center mb-6">
                            <img
                                src={user?.imageUrl}
                                alt={user?.fullName || 'User Profile Picture'}
                                className="rounded-full w-24 h-24 object-cover shadow-lg"
                            />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{user?.fullName || 'User'}</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-lg truncate w-full" title={user?.primaryEmailAddress?.emailAddress}>
                            {user?.primaryEmailAddress?.emailAddress}
                        </p>
                    </div>

                    {/* Phone Number Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
                        <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-100">Contact Information</h3>
                        
                        {isEditing || !authUser?.phoneNumber ? (
                            // Edit/Add View
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="Enter 10-digit number"
                                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={handleUpdatePhoneNumber} disabled={isLoading} className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50">
                                        {isLoading ? 'Saving...' : 'Save'}
                                    </button>
                                    {authUser?.phoneNumber && (
                                       <button onClick={handleCancel} className="w-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            // Display View
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{authUser.phoneNumber}</p>
                                </div>
                                <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                    Change
                                </button>
                            </div>
                        )}
                    </div>
                    
                    {/* Logout Button */}
                    <div className="space-y-4 mb-25">
                        <button onClick={() => signOut()} className="w-full bg-red-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-red-600 transition-colors duration-200 shadow-sm hover:shadow-md">
                            Logout
                        </button>
                    </div>
                </SignedIn>

                <SignedOut>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="bg-gray-100 dark:bg-gray-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <UserIcon className="w-6 h-8 mt-2 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Welcome to BC-Traders</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">
                            Log in to manage your profile and track orders.
                        </p>
                        <SignInButton mode="modal">
                           <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-shadow duration-200 w-full">
                               Sign In 
                           </button>
                        </SignInButton>
                    </div>
                </SignedOut>
            </div>
        </div>
    );
};

export default Profile;