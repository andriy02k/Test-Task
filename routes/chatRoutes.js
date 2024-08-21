import express from "express";
import {
  getChats,
  createChat,
  updateChat,
  deleteChat,
  sendMessage,
} from "../controllers/chatsControllers.js";

const chatsRouter = express.Router();

chatsRouter.get("/", getChats);

chatsRouter.post("/", createChat);

chatsRouter.put("/:id", updateChat);

chatsRouter.delete("/:id", deleteChat);

chatsRouter.post("/:id/messages", sendMessage);

export default chatsRouter;
