import express from "express";
import {
  getChats,
  createChat,
  updateChat,
  deleteChat,
  sendMessage,
  getChatById,
} from "../controllers/chatsControllers.js";

const chatsRouter = express.Router();

chatsRouter.get("/", getChats);

chatsRouter.get("/:id", getChatById);

chatsRouter.post("/", createChat);

chatsRouter.put("/:id", updateChat);

chatsRouter.delete("/:id", deleteChat);

chatsRouter.post("/:id/messages", sendMessage);

export default chatsRouter;
