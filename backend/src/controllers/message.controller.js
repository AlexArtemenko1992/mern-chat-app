import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import Message from "../models/message.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const users = await User.find({ _id: { $ne: loggedInUserId } })
      .select("-password -__v")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      message: "Users fetched successfully",
      users: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const senderId = req.user._id;

    const message = await Message.find({
      $or: [
        { sender: senderId, receiver: userId },
        { sender: userId, receiver: senderId },
      ],
    });

    res.status(200).json({
      status: "success",
      message: "Messages fetched successfully",
      messages: message,
    });
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let img = '';
    if (image) {
      const uploadImg = await cloudinary.uploader.upload(image);
      img = uploadImg.secure_url;
    }

    const newMessage = new Message({
      senderId: senderId,
      receiverId: receiverId,
      text,
      image: img,
    });

    await newMessage.save();

    res.status(201).json({
      status: "success",
      message: "Message sent successfully",
      messageText: newMessage,
    });
  } catch (error) {
    console.error("Error sending message:", error.message);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
}
