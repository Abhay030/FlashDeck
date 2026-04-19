// test-db.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI).then(async () => {
  console.log("Connected to MongoDB.");
  
  const deckSchema = new mongoose.Schema({}, { strict: false });
  const Deck = mongoose.models.Deck || mongoose.model("Deck", deckSchema, "decks");
  
  const decks = await Deck.find().sort({ createdAt: -1 }).limit(1);
  console.log("Most recent deck ID:", decks[0]._id);
  console.log("Cards count:", decks[0].cards?.length || 0);
  
  if (decks[0].cards?.length === 0) {
    console.log("The cards array is genuinely empty in the DB document.");
  } else {
    console.log("The DB document has cards!", decks[0].cards.slice(0,1));
  }
  
  mongoose.disconnect();
});
