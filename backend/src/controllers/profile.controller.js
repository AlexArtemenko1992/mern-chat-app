import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js";

export const updateProfile = async (req, res) => {
  try {
    const { fullname, profilePicture } = req.body;

    const userId = req.user._id;


    if (!fullname || !profilePicture) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required.",
      });
    }

    const uploadResponse = cloudinary.uploader.upload(profilePicture);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullname,
        profilePicture: uploadResponse.secure_url,
      },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        fullname: updatedUser.fullname,
        email: updatedUser.email,
        profilePicture: updatedUser.profilePicture,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};


