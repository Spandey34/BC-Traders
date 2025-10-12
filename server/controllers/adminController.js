import User from '../models/UserModel.js';
import { v2 as cloudinary } from 'cloudinary';

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
        res.status(500).json({message: "Server error while updating logo"});
    }
}

export {updateLogo};