const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  byId: {},
  allIds: [],
  messages: [],
  activeConversationId: null,
  lastFetched: null,
  isLoading: false,
  isError: false,
  errorMessage: "",
};

const messagesSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    fetchMessagesRequest: (state, action) => {
      state.isLoading = true;
      state.activeConversationId = action.payload;
    },
    fetchMessagesSuccess: (state, action) => {
      state.isLoading = false;
      state.messages = action.payload.messages;
      state.lastFetched = action.payload.timestamp;

      action.payload.messages.forEach((message) => {
        if (!state.allIds.includes(message.id)) {
          state.allIds.push(message.id);
          state.byId[message.id] = message;
        }
      });
    },
    fetchMessagesFailure: (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.payload;
    },
    setActiveConversation: (state, action) => {
      state.activeConversationId = action.payload;
    },
    addMessage: (state, action) => {
      const newMessage = {
        ...action.payload,
        like: false, // added property
        dislike: false, // added property
        suggestion: "", // added property
      };
      state.allIds.push(newMessage.id);
      state.byId[newMessage.id] = newMessage;
      state.messages.push(newMessage);
    },
    removeMessage: (state, action) => {
      const messageId = action.payload;
      state.allIds = state.allIds.filter((id) => id !== messageId);
      delete state.byId[messageId];
      state.messages = state.messages.filter(
        (message) => message.id !== messageId
      );
    },
    likeMessage: (state, action) => {
      const messageId = action.payload;
      state.byId[messageId].like = true;
    },

    dislikeMessage: (state, action) => {
      const messageId = action.payload;
      state.byId[messageId].dislike = true;
    },

    addSuggestion: (state, action) => {
      const { messageId, suggestion } = action.payload;
      state.byId[messageId].suggestion = suggestion;
    },
  },
});

export const {
  fetchMessagesRequest,
  fetchMessagesSuccess,
  fetchMessagesFailure,
  setActiveConversation,
  addMessage,
} = messagesSlice.actions;

// Get the messages for the current conversation
export const selectCurrentConversationMessages = (state) => state.messages;

// Get the last 10 messages of the current conversation
export const selectLastNMessages = (state, n) => state.messages.slice(-n);

// Get the latest message of the current conversation
export const selectLatestMessage = (state) =>
  state.messages[state.messages.length - 1];

// Get messages sent by the user in the current conversation
export const selectUserMessages = (state) =>
  state.messages.filter((message) => message.role === "user");

// Get messages sent by the assistant in the current conversation
export const selectAssistantMessages = (state) =>
  state.messages.filter((message) => message.role === "assistant");

// Get first 100 characters of each message in the current conversation
export const selectFirst100CharsOfEachMessage = (state) =>
  state.messages.map((message) => message.content.slice(0, 100));

// Get messages of the current conversation sorted by date and time
export const selectMessagesSortedByDateTime = (state) =>
  [...state.messages].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

// Get all messages across all conversations
export const selectAllMessages = (state) =>
  state.allIds.map((id) => state.byId[id]);

// Get a specific message by id
export const selectMessageById = (state, messageId) => state.byId[messageId];

export const selectActiveConversationMessages = (state) =>
  state.allIds
    .map((id) => state.byId[id])
    .filter((message) => message.conversationId === state.activeConversationId);

// Get all messages that have been liked
export const selectLikedMessages = (state) =>
  Object.values(state.byId).filter((message) => message.like);

// Get all messages that have been disliked
export const selectDislikedMessages = (state) =>
  Object.values(state.byId).filter((message) => message.dislike);

// Get all messages that have a suggestion
export const selectMessagesWithSuggestions = (state) =>
  Object.values(state.byId).filter((message) => message.suggestion !== "");

// Get all suggestions
export const selectAllSuggestions = (state) =>
  Object.values(state.byId)
    .filter((message) => message.suggestion !== "")
    .map((message) => message.suggestion);

export default messagesSlice.reducer;
