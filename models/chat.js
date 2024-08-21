import { Schema, model } from "mongoose";

const messageSchema = new Schema({
  text: { type: String, required: true },
  sender: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const chatSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  messages: [messageSchema],
});

export default model("Chat", chatSchema);
