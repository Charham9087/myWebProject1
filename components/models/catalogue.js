import mongoose from 'mongoose';

const cataloguesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "catalogue"
  }
);

export default mongoose.models.catalogue || mongoose.model('catalogue', cataloguesSchema);
