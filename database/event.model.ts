import mongoose, { Schema, Document, Model } from "mongoose";

// Custom slug generator
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumeric except space and hyphen
    .replace(/\s+/g, "-")         // replace spaces with hyphens
    .replace(/-+/g, "-");          // collapse multiple hyphens
}

// Event interface for strong typing
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: true, trim: true },
    overview: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    mode: { type: String, required: true, trim: true },
    audience: { type: String, required: true, trim: true },
    agenda: { type: [String], required: true },
    organizer: { type: String, required: true, trim: true },
    tags: { type: [String], required: true },
  },
  {
    timestamps: true,
  },
);

// Pre-save hook for slug generation, date/time normalization, and validation
EventSchema.pre<IEvent>("save", function(next) {
  // Generate slug from title if title is modified or document is new
if (this.isModified("title") || this.isNew) {
      this.slug = generateSlug(this.title);
    }

  // Normalize date to ISO format
  if (this.isModified("date")) {
    const parsedDate = new Date(this.date);
    if (isNaN(parsedDate.getTime())) {
      return next(new Error("Invalid date format."));
    }
    this.date = parsedDate.toISOString().split("T")[0]; // YYYY-MM-DD
  }

  // Normalize time to HH:MM (24h) format
  if (this.isModified("time")) {
    const timeMatch = /^([01]?\d|2[0-3]):([0-5]\d)$/.test(this.time);
    if (!timeMatch) {
      return next(new Error("Invalid time format. Use HH:MM (24h)."));
    }
    // Already normalized if matches
  }

  // Validate required string fields are non-empty
  const requiredFields: (keyof IEvent)[] = [
    "title",
    "description",
    "overview",
    "image",
    "venue",
    "location",
    "date",
    "time",
    "mode",
    "audience",
    "organizer",
  ];
  for (const field of requiredFields) {
    if (
      !this[field] ||
      (typeof this[field] === "string" && !this[field].trim())
    ) {
      return next(new Error(`${field} is required and cannot be empty.`));
    }
  }
  // Validate required arrays are non-empty
  if (!Array.isArray(this.agenda) || this.agenda.length === 0) {
    return next(new Error("Agenda is required and cannot be empty."));
  }
  if (!Array.isArray(this.tags) || this.tags.length === 0) {
    return next(new Error("Tags are required and cannot be empty."));
  }
  next();
});

// Export Event model
export const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
