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

// export const sendMessage = async (req, res, next) => {
//   res.send({ maessage: ok });
// };
export const sendMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { sender, text } = req.body;

    const chat = await Chat.findById(id);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const newMessage = { sender, text, createdAt: new Date() };
    chat.messages.push(newMessage);
    await chat.save();

    // Відправка повідомлення користувачу
    res.status(201).json(newMessage);

    // Отримання випадкової цитати з Quotable
    const response = await axios.get("https://api.quotable.io/random");
    const quote = response.data.content;

    // Додаємо автоматичну відповідь у чат
    const autoResponse = {
      sender: "AutoResponder",
      text: quote,
      createdAt: new Date(),
    };
    chat.messages.push(autoResponse);
    await chat.save();

    // Відправка автоматичної відповіді клієнтам
    io.emit("message", autoResponse);
  } catch (error) {
    next(error);
  }
};
