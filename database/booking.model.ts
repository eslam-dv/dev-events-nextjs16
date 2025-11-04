import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { Event } from "./event.model";

// Booking interface for strong typing
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    email: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  },
);

// Pre-save hook for event existence and email validation
BookingSchema.pre<IBooking>("save", async function(next) {
  // Validate eventId references an existing Event
  const eventExists = await Event.exists({ _id: this.eventId });
  if (!eventExists) {
    return next(new Error("Referenced event does not exist."));
  }
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(this.email)) {
    return next(new Error("Invalid email format."));
  }
  next();
});

// Export Booking model
export const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
