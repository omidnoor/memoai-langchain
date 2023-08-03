import { configureStore } from "@reduxjs/toolkit";
import userReducer from "src/features/user/userReducer";

export default configureStore({
  reducer: {
    user: userReducer,
    messages: messagesReducer,
    conversations: conversationReducer,
  },
});
