import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import os from "os";
import { parsePdfBuffer } from "@/lib/pdf/parser";
import { chunkText } from "@/lib/pdf/chunker";
import { extractAllConcepts } from "@/lib/ai/extractor";
import { generateFlashcards } from "@/lib/ai/generator";
import { processFinalDeck } from "@/lib/ai/processor";
import connectToDatabase from "@/lib/db";
import { Deck } from "@/models/Deck";

// 10 MB upload limit (adjustable)
const MAX_UPLOAD_SIZE = 10 * 1024 * 1024; // 10 MB

// Vercel timeout override – Hobby tier allows up to 60 s
export const maxDuration = 60;

/**
 * POST /api/upload
 * Handles two modes:
 *   1️⃣ New deck creation (no expandDeckId)
 *   2️⃣ Incremental expansion of an existing deck (expandDeckId provided)
 *
 * Returns a rich JSON payload containing:
 *   - success / expanded flags
 *   - progress (processed / total / percent)
 *   - up‑next preview (first few words of the next chunk(s))
 *   - limitReached flag when the 300‑card cap is hit
 */
export async function POST(req: NextRequest) {
  let filePath: string | null = null;
  let finalizedCards: any[] = [];
  let rawConcepts: any[] = [];

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const expandDeckId = (formData.get("expandDeckId") as string) ?? null;

    // ---------- Basic validation ----------
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Invalid file type. Only PDFs are allowed." }, { status: 400 });
    }
    if (file.size > MAX_UPLOAD_SIZE) {
      return NextResponse.json(
        { error: `File is too large. Maximum allowed size is ${MAX_UPLOAD_SIZE / (1024 * 1024)}MB.` },
        { status: 413 }
      );
    }

    // ---------- Read file into memory ----------
    const buffer = Buffer.from(await file.arrayBuffer());
    const uniqueNaming = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${uniqueNaming}-${originalName}`;
    filePath = path.join(os.tmpdir(), fileName);
    await fs.writeFile(filePath, buffer);

    // ---------- Parse PDF ----------
    console.log(`[Upload API] Parsing ${originalName}...`);
    const parsedData = await parsePdfBuffer(buffer);
    if (parsedData.error) {
      return NextResponse.json({ error: `Failed to parse PDF: ${parsedData.error}` }, { status: 422 });
    }

    // ---------- Chunking ----------
    const allChunks = chunkText(parsedData.text, { maxTokensPerChunk: 1000 });
    let deck: any = null;
    let startChunk = 0;
    let totalChunks = allChunks.length;

    if (expandDeckId) {
      // ----- Expansion mode -----
      await connectToDatabase();
      deck = await Deck.findById(expandDeckId);
      if (!deck) {
        return NextResponse.json({ error: "Deck not found" }, { status: 404 });
      }
      // Store chunks on first expansion if not present
      if (!deck.chunks || deck.chunks.length === 0) {
        deck.chunks = allChunks;
        deck.totalChunks = totalChunks;
        await deck.save();
      }
      // Use stored values
      startChunk = deck.processedChunks ?? 0;
      totalChunks = deck.totalChunks ?? deck.chunks.length;
    }

    // ---------- Determine how many new chunks to process ----------
    const MAX_NEW_CHUNKS = 5; // 5 chunks × 3 cards = 15 cards max
    const sourceChunks = deck ? deck.chunks : allChunks;
    const remaining = sourceChunks.slice(startChunk);
    const newChunkCount = Math.min(MAX_NEW_CHUNKS, remaining.length);
    const newChunks = sourceChunks.slice(startChunk, startChunk + newChunkCount);

    // ---------- Concept extraction (only new chunks) ----------
    console.log(`[Upload API] Extracting concepts from ${newChunkCount} new chunk(s)...`);
    rawConcepts = await extractAllConcepts(newChunks);
    const limitedConcepts = rawConcepts.slice(0, 30);

    // ---------- Card generation (chunks × 3, capped at 15) ----------
    const cardsToGenerate = Math.min(newChunkCount * 3, 15);
    console.log(`[Upload API] Generating ${cardsToGenerate} flashcards...`);
    const rawDeck = await generateFlashcards(limitedConcepts, cardsToGenerate);
    finalizedCards = processFinalDeck(rawDeck);

    // ---------- Enforce deck card limit (300) ----------
    const MAX_DECK_CARDS = 300;
    let limitReached = false;
    if (deck) {
      const currentCount = deck.cardCount ?? deck.cards.length;
      if (currentCount + finalizedCards.length > MAX_DECK_CARDS) {
        const allowed = MAX_DECK_CARDS - currentCount;
        finalizedCards = finalizedCards.slice(0, allowed);
        limitReached = true;
      }
    }

    // ---------- Persist changes ----------
    let savedDeckId = "partial_unpersisted";
    try {
      await connectToDatabase();
      if (deck) {
        // Append cards and update counters atomically
        await Deck.updateOne(
          { _id: deck._id },
          {
            $push: { cards: { $each: finalizedCards } },
            $inc: {
              processedChunks: newChunkCount,
              cardCount: finalizedCards.length,
            },
            ...(deck.totalChunks == null && { $set: { totalChunks } })
          }
        );
        savedDeckId = deck._id.toString();
      } else {
        const newDeck = await Deck.create({
          title: originalName.split('.pdf')[0].replace(/_/g, " "),
          sourceFileId: fileName,
          cards: finalizedCards,
          processedChunks: newChunkCount,
          totalChunks,
          chunks: allChunks,
          cardCount: finalizedCards.length,
        });
        savedDeckId = newDeck._id.toString();
      }
    } catch (dbError) {
      console.error(`[Upload API] DB persistence error:`, dbError);
    }

    // ---------- Build progress payload ----------
    const processed = (deck ? (deck.processedChunks ?? 0) + newChunkCount : newChunkCount);
    const percent = Math.round((processed / totalChunks) * 100);
    // Up‑next preview – take up to 2 upcoming chunks, grab first 3 words each, safely handling missing chunks
    const upNextChunks = sourceChunks.slice(startChunk + newChunkCount, startChunk + newChunkCount + 2);
    const upNextPreview = upNextChunks
      .filter((c: unknown): c is string => typeof c === "string" && c.length > 0)
      .map((c: string) => c.split(/\s+/).slice(0, 3).join(" "));

    // ---------- Response ----------
    return NextResponse.json({
      success: true,
      expanded: !!deck,
      limitReached,
      metadata: {
        deckId: savedDeckId,
        newCardsAdded: finalizedCards.length,
        processedChunks: processed,
        totalChunks,
        percent,
        upNextPreview,
      },
      progress: {
        processed,
        total: totalChunks,
        percent,
      },
      concepts: rawConcepts,
      flashcards: finalizedCards,
    }, { status: 200 });

  } catch (error: any) {
    console.error(`[Upload API] Unexpected error:`, error);
    if (finalizedCards && finalizedCards.length > 0) {
      return NextResponse.json({
        success: false,
        partial: true,
        error: "Process interrupted, returning partial flashcards.",
        flashcards: finalizedCards,
      }, { status: 206 });
    }
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  } finally {
    // Cleanup temporary file
    if (filePath) {
      try { await fs.unlink(filePath); } catch (e) { console.warn(`[Upload API] Cleanup failed:`, e); }
    }
  }
}
