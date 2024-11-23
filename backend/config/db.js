import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB connected to Atals`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
