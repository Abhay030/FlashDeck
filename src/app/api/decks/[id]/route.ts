import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Deck } from "@/models/Deck";

export async function DELETE(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> } // Await dynamic params in Next.js 15+
) {
  try {
    const resolvedParams = await params;
    
    if (!resolvedParams.id || resolvedParams.id.length !== 24) {
      return NextResponse.json({ error: "Invalid Deck ID" }, { status: 400 });
    }

    await connectToDatabase();
    
    const result = await Deck.findByIdAndDelete(resolvedParams.id);
    
    if (!result) {
      return NextResponse.json({ error: "Deck not found or already deleted" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Deck successfully deleted" }, { status: 200 });
    
  } catch (error) {
    console.error("[Deck Delete API] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
