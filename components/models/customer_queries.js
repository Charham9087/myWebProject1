// /models/customerQuery.js
import mongoose from "mongoose";

const CustomerQueriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Avoid redefining the model during hot reload
const CustomerQuery = mongoose.models.CustomerQuery || mongoose.model("CustomerQuery", CustomerQueriesSchema);

export default CustomerQuery;
