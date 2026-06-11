import ContactUs from "../Models/contactUsModel.js";
import ApiError from "../utils/apiError.js";

// Service function to handle contact us form submission
export const submitContactUsForm = async (body) => {
  const { firstName, lastName, email, message } = body;
  const contactEntry = await ContactUs.create({
    firstName,
    lastName,
    email,
    message,
  });
  return contactEntry;
};

// Service function to retrieve all contact us entries
export const getAllContactUsEntries = async () => {
  const entries = await ContactUs.find().sort({ createdAt: -1 });
  return entries;
};

// Service function to retrieve today's contact us messages
export const getTodayMessagesService = async () => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const messages = await ContactUs.find({
    createdAt: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });

  return messages;
};

// Service function to retrieve a contact us message by ID
export const getMessageByIdService = async (id) => {
  const message = await ContactUs.findById(id);

  if (!message) {
    throw new ApiError("Message not found", 404);
  }

  return message;
};

// Service function to delete a contact us message by ID
export const deleteMessageService = async (id) => {
  const message = await ContactUs.findByIdAndDelete(id);

  if (!message) {
    throw new ApiError("Message not found", 404);
  }

  return message;
};

// Service function to delete all contact us messages
export const deleteAllMessagesService = async () => {
  const result = await ContactUs.deleteMany({});

  return result;
};

// Service function to get statistics about contact us messages
export const getMessagesStatsService = async () => {
  const totalMessages = await ContactUs.countDocuments();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayMessages = await ContactUs.countDocuments({
    createdAt: {
      $gte: today,
    },
  });

  return {
    totalMessages,
    todayMessages,
  };
};
