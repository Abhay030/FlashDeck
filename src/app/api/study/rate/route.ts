import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Deck } from "@/models/Deck";
import { calculateSM2, SM2Rating } from "@/lib/sm2";
import { StudyLog } from "@/models/StudyLog";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { deckId, cardId, rating } = body as { deckId: string, cardId: string, rating: SM2Rating };

    if (!deckId || !cardId || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!["again", "hard", "good", "easy"].includes(rating)) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
    }

    await connectToDatabase();

    // 1. Fetch the entire deck containing the target card
    const deck = await Deck.findById(deckId);
    if (!deck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    // 2. Locate the specific card within the embedded array safely bypassing TS strict mappings
    const card = deck.cards.find((c: any) => c._id && c._id.toString() === cardId);
    if (!card) {
      return NextResponse.json({ error: "Card not found in deck" }, { status: 404 });
    }

    // 3. Process SM-2 Mathematics locally
    const newState = calculateSM2(rating, {
      interval: card.interval,
      repetition: card.repetition,
      eFactor: card.eFactor,
    });

    // 4. Mutate the MongoDB Document in memory
    card.interval = newState.interval;
    card.repetition = newState.repetition;
    card.eFactor = newState.eFactor;
    card.dueDate = newState.dueDate;

    // 5. Persist to remote MongoDB cluster natively
    await deck.save();

    // 6. Asynchronous Background Logging (Fire-and-forget to avoid blocking UX)
    Promise.resolve().then(async () => {
      try {
        await StudyLog.create({
          deckId: new mongoose.Types.ObjectId(deckId),
          cardId: new mongoose.Types.ObjectId(cardId),
          rating: rating,
          // timestamp is handled natively by default: Date.now
        });
      } catch (logError) {
        console.error("[Study Rate API] Failed to write to StudyLog:", logError);
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "SM-2 Progression Saved", 
      cardData: newState 
    }, { status: 200 });

  } catch (error) {
    console.error("[Study Rate API] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
