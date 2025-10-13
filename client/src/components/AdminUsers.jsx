import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { api } from '../api/api';
import toast from 'react-hot-toast';
import { useUsers } from '../redux/ReduxProvider';

// --- Reusable Confirmation Dialog ---
const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, children, confirmText, confirmColor }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm">
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{children}</p>
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg font-semibold bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded-lg font-semibold text-white transition-colors shadow-sm ${confirmColor}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main AdminUsers Component ---
const AdminUsers = () => {
    const [users, setUsers] = useUsers();
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, user: null });
    const [verifyConfirm, setVerifyConfirm] = useState({ isOpen: false, user: null });

    // --- API HANDLERS ---

    const deleteUser = async (userToDelete) => {
        const originalUsers = JSON.parse(JSON.stringify(users));
        setUsers(prev => prev.filter(u => u._id !== userToDelete._id));
        try {
            await axios.post(`${api}/admin/delete-user`, { userId: userToDelete._id }, { withCredentials: true });
            toast.success(`User "${userToDelete.name}" deleted.`);
        } catch (error) {
            toast.error("Deletion failed. Reverting changes.");
            setUsers(originalUsers);
            console.error("Failed to delete user:", error);
        }
    };

    const verifyUser = async (userToVerify) => {
        const originalUsers = JSON.parse(JSON.stringify(users));
        setUsers(prev => prev.map(u => u._id === userToVerify._id ? { ...u, isVerified: true } : u));
        try {
            await axios.post(`${api}/admin/verify-user`, { userId: userToVerify._id }, { withCredentials: true });
            toast.success(`User "${userToVerify.name}" has been verified.`);
        } catch (error) {
            toast.error("Verification failed. Reverting changes.");
            setUsers(originalUsers);
            console.error("Failed to verify user:", error);
        }
    };

    // --- CONFIRMATION HANDLERS ---

    const confirmAction = async (action) => {
        if (action === 'delete') {
            const { user } = deleteConfirm;
            if (user) await deleteUser(user);
            setDeleteConfirm({ isOpen: false, user: null });
        }
        if (action === 'verify') {
            const { user } = verifyConfirm;
            if (user) await verifyUser(user);
            setVerifyConfirm({ isOpen: false, user: null });
        }
    };

    // --- FILTERING ---

    const filteredUsers = useMemo(() => {
        if (!users) return [];
        const searchMatch = searchQuery.toLowerCase();
        if (!searchMatch) return users;
        return users.filter(user =>
            user.name.toLowerCase().includes(searchMatch) ||
            user.email.toLowerCase().includes(searchMatch) ||
            user.phoneNumber?.includes(searchMatch)
        );
    }, [users, searchQuery]);


    if (users === undefined) {
        return <div className="p-6 text-center">Loading users...</div>;
    }

    return (
        <div className="p-4 md:p-6 pb-24 lg:pb-6">
            {/* --- DIALOGS --- */}
            <ConfirmationDialog isOpen={deleteConfirm.isOpen} onClose={() => setDeleteConfirm({ isOpen: false })} onConfirm={() => confirmAction('delete')} title="Confirm Deletion" confirmText="Yes, Delete User" confirmColor="bg-red-600 hover:bg-red-700" >
                Are you sure you want to permanently delete {deleteConfirm.user?.name}? This action cannot be undone.
            </ConfirmationDialog>
            <ConfirmationDialog isOpen={verifyConfirm.isOpen} onClose={() => setVerifyConfirm({ isOpen: false })} onConfirm={() => confirmAction('verify')} title="Confirm Verification" confirmText="Yes, Verify" confirmColor="bg-blue-600 hover:bg-blue-700" >
                Are you sure you want to mark {verifyConfirm.user?.name} as verified?
            </ConfirmationDialog>

            {/* --- HEADER & SEARCH --- */}
            <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input type="text" name="search" placeholder="Search by Name, Email, or Phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-style flex-grow" />
            </div>

            {/* --- USER CARDS --- */}
            <div className="space-y-4">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <div key={user._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700">
                            {/* User Info */}
                            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                <div>
                                    <p className="font-bold text-lg flex items-center gap-2">
                                        {user.name}
                                        {!user.isVerified && <span className="text-xs font-semibold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Not Verified</span>}
                                    </p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                    <p className="text-sm text-gray-400 mt-1">{user.phoneNumber || 'No phone number'}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === "admin" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>{user.role}</span>
                                </div>
                            </div>
                            
                            {/* Order Details */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center border-t border-b dark:border-gray-700 py-3 my-3 text-sm">
                                <div><span className="block text-gray-500 text-xs">Paid Total</span><span className="font-semibold">₹{user.totalPaidAmount?.toFixed(2) || '0.00'}</span></div>
                                <div><span className="block text-gray-500 text-xs">Unpaid Total</span><span className="font-semibold text-yellow-500">₹{user.unpaidAmount?.toFixed(2) || '0.00'}</span></div>
                                <div><span className="block text-gray-500 text-xs">Last Order</span>{user.lastOrderDate ? new Date(user.lastOrderDate).toLocaleDateString() : 'N/A'}</div>
                                <div><span className="block text-gray-500 text-xs">Last Amt</span>{user.lastOrderAmount > 0 ? `₹${user.lastOrderAmount.toFixed(2)}` : 'N/A'}</div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-2 flex flex-wrap gap-2 justify-end items-center min-h-[42px]">
                                {user.isVerified ? (
                                     <span className="px-4 py-2 text-xs font-bold text-green-800 bg-green-100 rounded-full">Verified</span>
                                ) : (
                                    <button onClick={() => setVerifyConfirm({ isOpen: true, user })} className="px-4 py-2 text-sm font-semibold text-white rounded-md shadow-sm bg-blue-500 hover:bg-blue-600">Verify</button>
                                )}
                                <button onClick={() => setDeleteConfirm({ isOpen: true, user })} className="px-4 py-2 text-sm font-semibold text-white rounded-md shadow-sm bg-red-500 hover:bg-red-600">Delete</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center py-8 text-gray-500">No users match the current search.</p>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;

