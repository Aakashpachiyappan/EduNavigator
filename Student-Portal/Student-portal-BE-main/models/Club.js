import mongoose from "mongoose";

const clubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    membersCount: {
      type: Number,
      default: 0,
    },
    president: String,
    image: String, 
  },
  { timestamps: true }
);

const Club = mongoose.model("Club", clubSchema);

export default Club;
