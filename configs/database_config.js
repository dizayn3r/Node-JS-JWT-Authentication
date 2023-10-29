import mongoose from "mongoose";

export const connectDB = async (CONNECTION_STRING) => {
  try {
    const DB_OPTIONS = {
      dbName: "authentication",
    };
    const connection = await mongoose.connect(CONNECTION_STRING, DB_OPTIONS);
    console.log("Database connection established");
  } catch (error) {
    console.error(error);
  }
};
