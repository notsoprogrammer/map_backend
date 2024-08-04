import mongoose from "mongoose";

const connectDB = async (app) => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        // Store the database connection in req.app.locals
        if (!process.env.DATABASE_NAME) {
            throw new Error('Database name is not defined in environment variables.');
        }
        const dbName = process.env.DATABASE_NAME;
        app.locals.db = conn.connection.db;
        app.locals.db.dbName = dbName;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;