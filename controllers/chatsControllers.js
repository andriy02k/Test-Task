import axios from "axios";
import Chat from "../models/chat.js";

export const getChats = async (req, res, next) => {
  try {
    const chats = await Chat.find();

    res.status(200).json(chats);
  } catch (error) {
    next(error);
  }
};

export const getChatById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentChat = await Chat.findById(id);

    res.status(200).json(currentChat);
  } catch (error) {
    next(error);
  }
};

export const createChat = async (req, res, next) => {
  try {
    const { firstName, lastName } = req.body;
    const newChat = await Chat.create({ firstName, lastName, messages: [] });

    res.status(201).json(newChat);
  } catch (error) {
    next(error);
  }
};

export const updateChat = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firstName, lastName } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
      id,
      { firstName, lastName },
      { new: true }
    );

    res.status(200).json(updatedChat);
  } catch (error) {
    next(error);
  }
};

export const deleteChat = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedChat = await Chat.findByIdAndDelete(id);

    res.status(200).json(deletedChat);
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text, sender } = req.body;

    const chat = await Chat.findById(id);
    const newMessage = { text, sender };
    chat.messages.push(newMessage);
    await chat.save();

    res.json(chat);

    setTimeout(async () => {
      try {
        const quoteResponse = await axios.get("https://favqs.com/api/qotd");
        const quoteMessage = {
          text: quoteResponse.data.quote.body,
          sender: "Auto-response",
        };

        chat.messages.push(quoteMessage);
        await chat.save();
      } catch (error) {
        next(error);
      }
    }, 3000);
  } catch (error) {
    next(error);
  }
};
