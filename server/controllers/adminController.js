

const adminHome = async (req, res) => {
    try {
        res.status(200).json({message: "Welcome to the admin dashboard"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Server error"});
    }
}

export {adminHome};