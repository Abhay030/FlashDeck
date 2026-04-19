import mongoose, { Schema, Document } from "mongoose";

export interface IStudyLog extends Document {
  deckId: mongoose.Types.ObjectId;
  cardId?: mongoose.Types.ObjectId;
  userId?: string; // Future-proofing authentication
  rating: "again" | "hard" | "good" | "easy";
  timestamp: Date;
}

const StudyLogSchema = new Schema<IStudyLog>({
  deckId: { type: Schema.Types.ObjectId, required: true },
  cardId: { type: Schema.Types.ObjectId, required: false },
  userId: { type: String, required: false },
  rating: { type: String, enum: ["again", "hard", "good", "easy"], required: true },
  timestamp: { type: Date, default: Date.now }
}, { 
  collection: "studylogs",
  timestamps: false 
});

// Primary compound index for fast daily metric aggregation (and future user filters)
StudyLogSchema.index({ userId: 1, timestamp: -1 });
// Deck-level analytics index
StudyLogSchema.index({ deckId: 1, timestamp: -1 });

export const StudyLog = mongoose.models.StudyLog || mongoose.model<IStudyLog>("StudyLog", StudyLogSchema);
