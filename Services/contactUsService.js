import ContactUs from "../Models/contactUsModel.js";

export const submitContactUsForm = async (body) => {
  const { firstName, lastName, email, message } = body;
  const contactEntry = await ContactUs.create({ firstName, lastName, email, message });
  return contactEntry;
};

export const getAllContactUsEntries = async () => {
  const entries = await ContactUs.find().sort({ createdAt: -1 });
  return entries;
};
