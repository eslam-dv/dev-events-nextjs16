import mongoose, { Connection } from "mongoose";

// Define a global type for the cached connection
interface MongooseGlobal {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

declare global {
  // Allow global caching of the mongoose connection in development
  var mongooseGlobal: MongooseGlobal | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

let cached: MongooseGlobal;

if (typeof global.mongooseGlobal === "undefined") {
  cached = { conn: null, promise: null };
  global.mongooseGlobal = cached;
} else {
  cached = global.mongooseGlobal;
}

/**
 * Connects to MongoDB using Mongoose, with connection caching to prevent
 * multiple connections during development (hot reloads).
 * @returns {Promise<Connection>} The established Mongoose connection
 */
export async function connectToDatabase(): Promise<Connection> {
  if (cached.conn) {
    // Return cached connection if already established
    return cached.conn;
  }
  if (!cached.promise) {
    // Create a new connection promise if not already connecting
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((mongooseInstance) => mongooseInstance.connection);
  }
  // Await the connection and cache it
  cached.conn = await cached.promise;
  return cached.conn;
}

// Usage: await connectToDatabase();
// This ensures a single connection instance across hot reloads in development.
