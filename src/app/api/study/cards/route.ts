import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Deck } from "@/models/Deck";
import mongoose from "mongoose";

export async function PATCH(req: NextRequest) {
  try {
    const { deckId, cardId, question, answer } = await req.json();

    if (!deckId || !cardId || !question || !answer) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(deckId) || !mongoose.Types.ObjectId.isValid(cardId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    await connectToDatabase();

    // Atomic subdocument update targeting the specific card inside the deck array
    const updatedDeck = await Deck.findOneAndUpdate(
      { _id: deckId, "cards._id": cardId },
      { 
        $set: { 
          "cards.$.question": question, 
          "cards.$.answer": answer,
          "cards.$.isEdited": true,
        } 
      },
      { new: true, lean: true }
    );

    if (!updatedDeck) {
      return NextResponse.json({ error: "Deck or Card not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Card updated successfully." });
  } catch (error: any) {
    console.error("[API] Error updating card:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const deckId = searchParams.get("deckId");
    const cardId = searchParams.get("cardId");

    if (!deckId || !cardId) {
      return NextResponse.json({ error: "Missing deckId or cardId" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(deckId) || !mongoose.Types.ObjectId.isValid(cardId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    await connectToDatabase();

    // Atomic subdocument deletion using $pull
    const updatedDeck = await Deck.findByIdAndUpdate(
      deckId,
      { $pull: { cards: { _id: cardId } } },
      { new: true, lean: true }
    );

    if (!updatedDeck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Card deleted successfully." });
  } catch (error: any) {
    console.error("[API] Error deleting card:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
