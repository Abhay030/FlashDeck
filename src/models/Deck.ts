import mongoose, { Schema, Document } from "mongoose";

// ==========================================
// Card Sub-Schema Architecture
// ==========================================
// Designed modularly so it can be extracted to a separate 
// Mongoose Model later if independent card-querying scaling is required.

export interface ICard {
  _id?: string;
  question: string;
  answer: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  topic: string;
  isEdited?: boolean; // True when user has manually corrected AI output
  
  // Spaced Repetition Algorithm (SM-2 Framework) Fields
  interval: number;       // days until next review
  repetition: number;     // consecutive correct reviews
  eFactor: number;        // easiness factor (default 2.5)
  dueDate: Date;          // when the card is scheduled to be reviewed next
}

const CardSchema = new Schema<ICard>({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  difficulty: { 
    type: String, 
    enum: ["beginner", "intermediate", "advanced"],
    default: "intermediate"
  },
  topic: { type: String, required: true },
  isEdited: { type: Boolean, default: false },

  // SM-2 Defaults (Initialization state)
  interval: { type: Number, default: 0 },
  repetition: { type: Number, default: 0 },
  eFactor: { type: Number, default: 2.5 },
  dueDate: { type: Date, default: Date.now },
}, { _id: true, timestamps: true }); // Keep _id so we can iterate securely over cards


// ==========================================
// Core Deck Schema Architecture
// ==========================================

export interface IDeck extends Document {
  title: string;
  description?: string;
  userId?: string;          // Optional for now (Auth integration pending)
  sourceFileId?: string;    // Links to local / S3 file reference
  cards: ICard[];
  // New fields for incremental generation
  processedChunks: number;   // How many text chunks have already been turned into cards
  totalChunks?: number;      // Total number of chunks the source PDF was split into (optional)
  chunks: string[];          // Store raw chunk strings to avoid re‑chunking
  cardCount: number;         // Cached count of cards for quick limit checks
  createdAt: Date;
  updatedAt: Date;
}

const DeckSchema = new Schema<IDeck>({
  title: { type: String, required: true },
  description: { type: String },
  userId: { type: String, required: false }, // Future-proofing authentication
  sourceFileId: { type: String, required: false },
  
  // Embedded Document Strategy (Ideal for fast single-deck fetches during study views)
  cards: [CardSchema],
  // New fields for incremental generation
  processedChunks: { type: Number, default: 0 },
  totalChunks: { type: Number },
  chunks: { type: [String], default: [] },
  cardCount: { type: Number, default: 0 },
}, { 
  timestamps: true,
  collection: "decks" 
});

// Guard against Mongoose recompilation errors on hot-reloads in Next.js
export const Deck = mongoose.models.Deck || mongoose.model<IDeck>("Deck", DeckSchema);
