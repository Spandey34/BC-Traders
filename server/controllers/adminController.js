import User from '../models/UserModel.js';
import Order from '../models/orderModel.js';
import { v2 as cloudinary } from 'cloudinary';
import { io, userSocketMap } from '../socket/socketIo.js';

const updateLogo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No logo image was provided." });
        }

        const existingAdmin = await User.findOne({ role: 'admin' });

        if (existingAdmin && existingAdmin.logo) {
            try {
                const publicId = existingAdmin.logo.split('/').slice(-2).join('/').split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (cloudinaryError) {
                console.error("Could not delete the old logo from Cloudinary:", cloudinaryError);
            }
        }

        const newLogoUrl = req.file.path;

        await User.updateMany(
            { role: 'admin' },
            { $set: { logo: newLogoUrl } }
        );

        res.status(200).json({
            message: "Logo updated successfully for all admins",
            newLogoUrl: newLogoUrl
        });

    } catch (error) {
        console.log("Error during logo update:", error);
        res.status(500).json({ message: "Server error while updating logo" });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const usersWithOrderData = await User.aggregate([
            {
                $lookup: {
                    from: "orders", 
                    localField: "clerkId",
                    foreignField: "user.clerkId",
                    as: "orders"
                }
            },
            {
                $addFields: {
                    totalPaidAmount: {
                        $sum: {
                            $map: {
                                input: {
                                    $filter: {
                                        input: "$orders",
                                        as: "order",
                                        cond: { $eq: ["$$order.paymentStatus", "paid"] }
                                    }
                                },
                                as: "paidOrder",
                                in: "$$paidOrder.totalAmount"
                            }
                        }
                    },
                    unpaidAmount: {
                        $sum: {
                            $map: {
                                input: {
                                    $filter: {
                                        input: "$orders",
                                        as: "order",
                                        cond: { $eq: ["$$order.paymentStatus", "unpaid"] }
                                    }
                                },
                                as: "unpaidOrder",
                                in: "$$unpaidOrder.totalAmount"
                            }
                        }
                    },
                    lastOrderDate: { $max: "$orders.createdAt" }
                }
            },
            {
                $addFields: {
                    lastOrder: {
                        $first: { 
                            $filter: {
                                input: "$orders",
                                as: "order",
                                cond: { $eq: ["$$order.createdAt", "$lastOrderDate"] }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    phoneNumber: 1,
                    role: 1,
                    isVerified: 1,
                    totalPaidAmount: 1,
                    unpaidAmount: 1,
                    lastOrderDate: 1,
                    lastOrderAmount: { $ifNull: ["$lastOrder.totalAmount", 0] },
                    profilePic: 1
                }
            }
        ]);
        res.status(200).json({ users: usersWithOrderData });

    } catch (error) {
        console.error("Error fetching users with order data:", error);
        res.status(500).json({ message: "Server error while fetching users" });
    }
}

const verifyUser = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { isVerified: true },
            { new: true } // This option returns the updated document
        );

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        io.to(userSocketMap[userId]).emit('verified', { message: "Your account has been verified." });

        res.status(200).json({ message: `User ${user.name} has been verified.` });
    } catch (error) {
        console.error("Error verifying user:", error);
        res.status(500).json({ message: "Server error while verifying user." });
    }
};


// --- NEW: DELETE USER CONTROLLER ---
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        // First, find the user in your database to get their Clerk ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found in local database." });
        }

        // Delete all orders associated with this user's Clerk ID
        await Order.deleteMany({ 'user.clerkId': user.clerkId });

        // After successful deletion from Clerk and orders are cleared, delete from your own database
        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: `User ${user.name} and all their orders have been deleted successfully.` });
    } catch (error) {
        console.error("Error deleting user:", error);
        // Handle cases where the user might be in Clerk but not your DB or vice-versa
        res.status(500).json({ message: "Server error while deleting user." });
    }
};

export { updateLogo, getAllUsers, verifyUser, deleteUser };