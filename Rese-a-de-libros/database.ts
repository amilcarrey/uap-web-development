import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    console.log("Conectado a MongoDB)");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string, {
      dbName: "bookreviews",
    });
    isConnected = true;
    console.log(`MongoDB conectado en: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error conectando a MongoDB", error);
    process.exit(1);
  }
};
